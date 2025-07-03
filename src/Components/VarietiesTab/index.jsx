import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useVarietiesData, useDeleteVariety } from '../../hooks/useVarietiesData'; // хуки для сортів
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import { openAddVarietyModal } from '../../store/modalSlice'; // дія відкриття модалки сорту
import Styles from './styled';
import Button from '../Button';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';

export default function VarietiesTab() {
    const dispatch = useDispatch();
    const { data: varieties = [], isLoading, isError, error } = useVarietiesData();
    const deleteVariety = useDeleteVariety();

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const handleAdd = () => {
        dispatch(openAddVarietyModal()); // без ID — створення
    };

    const handleEdit = (varietyId) => {
        dispatch(openAddVarietyModal(varietyId)); // з ID — редагування
    };

    const handleDelete = (varietyId) => {
        if (window.confirm('Ви дійсно хочете видалити цей сорт?')) {
            deleteVariety.mutate(varietyId, {
                onError: (err) => {
                    console.error('Помилка при видаленні сорту:', err);
                    alert('Помилка видалення сорту');
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
        columnHelper.accessor('name', {
            header: 'Назва сорту',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('description', {
            header: 'Опис',
            enableGlobalFilter: true,
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
    ], [handleEdit, handleDelete]);

    const table = useReactTable({
        data: varieties,
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
                    placeholder="Пошук по назві"
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
