import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useOperationsData, useDeleteOperation } from '../../hooks/useOperationsData'; // хуки для операцій
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import { openAddOperationModal } from '../../store/modalSlice'; // дія відкриття модалки операції
import Styles from './styled';
import Button from '../Button';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';

export default function OperationsTab() {
    const dispatch = useDispatch();
    const { data: operations = [], isLoading, isError, error } = useOperationsData();
    const deleteOperation = useDeleteOperation();

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const handleAdd = () => {
        dispatch(openAddOperationModal());
    };

    const handleEdit = (operationId) => {
        dispatch(openAddOperationModal(operationId));
    };

    const handleDelete = (operationId) => {
        if (window.confirm('Ви дійсно хочете видалити цю операцію?')) {
            deleteOperation.mutate(operationId, {
                onError: (err) => {
                    console.error('Помилка при видаленні операції:', err);
                    alert('Помилка видалення операції');
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
            header: 'Назва операції',
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
        data: operations,
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
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted()] ?? ''}
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
