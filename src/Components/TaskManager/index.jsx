import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';

import { useTasksData, useDeleteTask } from '../../hooks/useTasksData';
import { useFieldsData } from '../../hooks/useFieldsData';
import { openAddTaskModal } from '../../store/modalSlice';

import Header from '../Header';
import Styles from './styled';
import Button from '../Button';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import Modals from '../Modals';
import dayjs from 'dayjs';

export default function TasksTab() {
    const dispatch = useDispatch();
    const { data: tasks = [], isLoading, isError, error } = useTasksData();
    const { data: fieldsData = [] } = useFieldsData();
    
    const deleteTask = useDeleteTask();

    const [globalFilter, setGlobalFilter] = useState('');
    // const [sorting, setSorting] = useState([{ id: 'order', desc: true }]); // свіже зверху за order
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const handleAdd = () => dispatch(openAddTaskModal());

    const handleEdit = (taskId) => dispatch(openAddTaskModal(taskId));

    const handleDelete = (taskId) => {
        if (window.confirm('Ви дійсно хочете видалити цей таск?')) {
            deleteTask.mutate(taskId, {
                onError: (err) => {
                    console.error('Помилка при видаленні таска:', err);
                    alert('Помилка видалення');
                },
            });
        }
    };

    const columns = useMemo(() => [
        columnHelper.accessor(row => row.order ?? 0, {
            id: 'order',
            header: '#',
            enableGlobalFilter: false,
        }),
        columnHelper.accessor(row => row.groupId?.name || '—', {
            id: 'group',
            header: 'Група',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.fieldId?.properties?.name || '—', {
            id: 'field',
            header: 'Поле',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.operationId?.name || '—', {
            id: 'operation',
            header: 'Операція',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('status', {
            header: 'Статус',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.vehicleId ? `${row.vehicleId.mark} (${row.vehicleId.regNumber})` : '—', {
            id: 'vehicle',
            header: 'Транспорт',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.techniqueId?.name || '—', {
            id: 'technique',
            header: 'Техніка',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.personnelId ? `${row.personnelId.lastName} ${row.personnelId.firstName}` : '—', {
            id: 'executor',
            header: 'Виконавець',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.cropId?.name || '—', {
            id: 'crop',
            header: 'Культура',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.varietyId?.name || '—', {
            id: 'variety',
            header: 'Сорт',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor('note', {
            header: 'Примітка',
            enableGlobalFilter: true,
            cell: info => info.getValue() || '—',
        }),
        columnHelper.accessor(row => dayjs(row.createdAt).format('DD.MM.YYYY HH:mm'), {
            id: 'createdAt',
            header: 'Дата створення',
            enableGlobalFilter: false,
        }),
        columnHelper.accessor(row => row.fieldId?.properties?.calculated_area ?? '—', {
            id: 'area',
            header: 'Площа (га)',
            enableGlobalFilter: false,
            cell: info => {
                const value = info.getValue();
                return typeof value === 'number' ? value.toFixed(2) : value;
            }
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
    ], []);

    const table = useReactTable({
        data: tasks,
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
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 20,
                pageIndex: 0,
            },
        },
    });

    if (isLoading) return <div>Завантаження...</div>;
    if (isError) return <div>Помилка: {error.message}</div>;

    return (
        <>
            <Header />
            <Styles.wrapper>
                <Styles.header>
                    <Styles.searchInput
                        type="text"
                        placeholder="Пошук..."
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
                                            {header.column.getIsSorted() === 'asc'
                                                ? ' 🔼'
                                                : header.column.getIsSorted() === 'desc'
                                                    ? ' 🔽'
                                                    : ''}
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

                <Styles.pagination>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Назад
                    </button>
                    <span>
                        Сторінка {table.getState().pagination.pageIndex + 1} з {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Вперед
                    </button>
                </Styles.pagination>
            </Styles.wrapper>
            <Modals />
        </>
    );
}
