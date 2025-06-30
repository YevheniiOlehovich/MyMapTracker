import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import { usePersonnelData, useDeletePersonnel } from '../../hooks/usePersonnelData';
import { useGroupsData } from '../../hooks/useGroupsData';
import { openAddPersonalModal } from '../../store/modalSlice';
import Styles from './styled';
import Button from '../Button';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import { personalFunctions } from '../../helpres';

export default function PersonnelTab() {
    const dispatch = useDispatch();
    const { data: personnel = [], isLoading, isError, error } = usePersonnelData();
    const { data: groups = [] } = useGroupsData();
    const deletePersonnel = useDeletePersonnel();
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const functionMap = useMemo(() => {
        return personalFunctions.reduce((acc, curr) => {
        acc[curr._id] = curr.name;
        return acc;
        }, {});
    }, []);

    const groupMap = useMemo(() => {
        return groups.reduce((acc, group) => {
        acc[group._id] = group.name;
        return acc;
        }, {});
    }, [groups]);

    const handleAdd = () => {
        dispatch(openAddPersonalModal({}));
    };

    const handleEdit = (personId) => {
        dispatch(openAddPersonalModal({ personId }));
    };

    const handleDelete = (personId) => {
        if (window.confirm('Ви дійсно хочете видалити цього співробітника?')) {
        deletePersonnel.mutate(personId, {
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
        columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
        id: 'fullName',
        header: 'ПІБ',
        enableGlobalFilter: true,
        }),
        columnHelper.accessor('rfid', {
        header: 'RFID',
        enableGlobalFilter: true,
        }),
        columnHelper.accessor('function', {
        header: 'Посада',
        enableGlobalFilter: false,
        cell: info => functionMap[info.getValue()] || info.getValue(),
        }),
        columnHelper.accessor('contactNumber', {
        header: 'Телефон',
        enableGlobalFilter: false,
        }),
        columnHelper.accessor('note', {
        header: 'Примітка',
        enableGlobalFilter: false,
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
    ], [handleEdit, handleDelete, functionMap, groupMap]);

    const table = useReactTable({
        data: personnel,
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
                placeholder="Пошук по групі, ПІБ, RFID..."
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
