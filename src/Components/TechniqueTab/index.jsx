import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTechniquesData, useDeleteTechnique } from '../../hooks/useTechniquesData';
import { useGroupsData } from '../../hooks/useGroupsData';
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import { openAddTechniqueModal } from '../../store/modalSlice';
import Styles from './styled';
import Button from '../Button';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import { fieldOperations } from '../../helpres';

export default function TechniqeTab() {
    const dispatch = useDispatch();
    const { data: techniques = [], isLoading, isError, error } = useTechniquesData();
    const { data: groups = [] } = useGroupsData();
    const deleteTechnique = useDeleteTechnique();

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const groupMap = useMemo(() => {
        return groups.reduce((acc, group) => {
        acc[group._id] = group.name;
        return acc;
        }, {});
    }, [groups]);

    const operationMap = useMemo(() => {
        return fieldOperations.reduce((acc, op) => {
        acc[op._id] = op.name;
        return acc;
        }, {});
    }, []);

    const handleAdd = () => {
        dispatch(openAddTechniqueModal({}));
    };

    const handleEdit = (techniqueId) => {
        dispatch(openAddTechniqueModal({ techniqueId }));
    };

    const handleDelete = (techniqueId) => {
        if (window.confirm('Ви дійсно хочете видалити техніку?')) {
        deleteTechnique.mutate(techniqueId, {
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
        columnHelper.accessor('name', {
        header: 'Назва',
        enableGlobalFilter: true,
        cell: info => info.getValue() || '—',
        }),
        columnHelper.accessor('rfid', {
        header: 'RFID',
        enableGlobalFilter: true,
        cell: info => info.getValue() || '—',
        }),
        columnHelper.accessor('uniqNum', {
        header: 'Унікальний №',
        enableGlobalFilter: true,
        cell: info => info.getValue() || '—',
        }),
        columnHelper.accessor('width', {
        header: 'Ширина (м)',
        enableGlobalFilter: false,
        cell: info => info.getValue() || '—',
        }),
        columnHelper.accessor('speed', {
        header: 'Швидкість (км/г)',
        enableGlobalFilter: false,
        cell: info => info.getValue() || '—',
        }),
        columnHelper.accessor(row => operationMap[row.fieldOperation] || '—', {
        id: 'fieldOperation',
        header: 'Тип операції',
        enableGlobalFilter: true,
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
    ], [handleEdit, handleDelete, groupMap, operationMap]);

    const table = useReactTable({
        data: techniques,
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
                    placeholder="Пошук по групі, RFID, назві..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    />
                    
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
