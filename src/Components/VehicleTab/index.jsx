import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useVehiclesData, useDeleteVehicle } from '../../hooks/useVehiclesData';
import { useGroupsData } from '../../hooks/useGroupsData';
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import { openAddVehicleModal } from '../../store/modalSlice';
import Styles from './styled';
import Button from '../Button';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import { vehicleTypes } from '../../helpres';

export default function VehiclesTab() {
    const dispatch = useDispatch();

    const { data: vehicles = [], isLoading, isError, error } = useVehiclesData();
    const { data: groups = [] } = useGroupsData();
    const deleteVehicle = useDeleteVehicle();

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    // Мапа groupId => назва групи
    const groupMap = useMemo(() => {
        return groups.reduce((acc, group) => {
        acc[group._id] = group.name;
        return acc;
        }, {});
    }, [groups]);

    // Мапа vehicleTypeId => назва українською
    const vehicleTypeMap = useMemo(() => {
        return vehicleTypes.reduce((acc, vt) => {
        acc[vt._id] = vt.name;
        return acc;
        }, {});
    }, []);

    const handleAdd = () => {
        dispatch(openAddVehicleModal({}));
    };

    const handleEdit = (vehicleId) => {
        dispatch(openAddVehicleModal({ vehicleId }));
    };

    const handleDelete = (vehicleId) => {
        if (window.confirm('Ви дійсно хочете видалити цей транспортний засіб?')) {
        deleteVehicle.mutate(vehicleId, {
            onError: (err) => {
            console.error('Помилка при видаленні:', err);
            alert('Помилка видалення');
            },
        });
        }
    };

    const columns = useMemo(() => [
        {
        id: 'rowNumber',
        header: '#',
        cell: info => info.row.index + 1,
        },
        columnHelper.accessor(row => groupMap[row.groupId] || '—', {
        id: 'groupName',
        header: 'Група',
        enableGlobalFilter: true,
        }),
        columnHelper.accessor('mark', {
        header: 'Марка',
        enableGlobalFilter: true,
        cell: info => info.getValue() || '—',
        }),
        columnHelper.accessor('regNumber', {
        header: 'Реєстраційний номер',
        enableGlobalFilter: true,
        cell: info => info.getValue() || '—',
        }),
        columnHelper.accessor(row => vehicleTypeMap[row.vehicleType] || '—', {
        id: 'vehicleType',
        header: 'Тип транспорту',
        enableGlobalFilter: false,
        }),
        columnHelper.accessor('imei', {
        header: 'IMEI',
        enableGlobalFilter: true,
        cell: info => info.getValue() || '—',
        }),
        columnHelper.accessor('note', {
        header: 'Примітка',
        enableGlobalFilter: false,
        cell: info => info.getValue() || '—',
        }),
        {
        id: 'actions',
        header: 'Дії',
        cell: info => (
            <div style={{ display: 'flex', gap: 8 }}>
            <Styles.button onClick={() => handleEdit(info.row.original._id)} title="Редагувати">
                <Styles.ico $pic={EditIco} />
            </Styles.button>
            <Styles.button onClick={() => handleDelete(info.row.original._id)} title="Видалити">
                <Styles.ico $pic={DelIco} />
            </Styles.button>
            </div>
        ),
        },
    ], [handleEdit, handleDelete, groupMap, vehicleTypeMap]);

    const table = useReactTable({
        data: vehicles,
        columns,
        state: {
        globalFilter,
        sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (isLoading) return <div>Завантаження...</div>;
    if (isError) return <div>Помилка: {error.message}</div>;

    return (
        <Styles.wrapper>
            <Styles.header>
                <Styles.searchInput
                    type="text"
                    placeholder="Пошук по групі, марці, реєстрації..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    />
                    <Button text="Додати" onClick={handleAdd} />
            </Styles.header>

            <Styles.tableContainer>
                <Styles.table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                        <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                        </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </Styles.table>
            </Styles.tableContainer>
        </Styles.wrapper>
    );
}
