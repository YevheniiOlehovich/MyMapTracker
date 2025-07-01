import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFieldsData } from '../../hooks/useFieldsData';
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import { setSelectedField, openAddFieldsModal } from '../../store/modalSlice'; // змінив!
import Styles from './styled';
import EditIco from '../../assets/ico/edit-icon-black.png';
// import DelIco from '../../assets/ico/del-icon-black.png';

export default function FieldsTab() {
    const dispatch = useDispatch();
    const { data: fieldsData = [], isLoading, isError, error } = useFieldsData();
  

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const handleEdit = (field) => {
        dispatch(setSelectedField(field._id));
        dispatch(openAddFieldsModal());
    };

    const columns = useMemo(() => [
    {
        id: 'rowNumber',
        header: '#',
        cell: info => info.row.index + 1,
    },
    columnHelper.accessor(row => row.properties?.name || '—', {
        id: 'name',
        header: 'Назва',
        enableGlobalFilter: true,
    }),
    columnHelper.accessor(row => row.properties?.region || '—', {
        id: 'region',
        header: 'Регіон',
        enableGlobalFilter: true,
    }),
    columnHelper.accessor(row => row.properties?.area || '—', {
        id: 'area',
        header: 'Площа (заявл.)',
        enableGlobalFilter: false,
    }),
    columnHelper.accessor(row => row.properties?.calculated_area || '—', {
        id: 'calc_area',
        header: 'Площа (розрах.)',
        enableGlobalFilter: false,
    }),
    columnHelper.accessor(row => row.properties?.culture || '—', {
        id: 'culture',
        header: 'Культура',
        enableGlobalFilter: true,
    }),
    columnHelper.accessor(row => row.properties?.sort || '—', {
        id: 'sort',
        header: 'Сорт',
        enableGlobalFilter: true,
    }),
    columnHelper.accessor(row => row.properties?.date || '—', {
        id: 'date',
        header: 'Дата',
        enableGlobalFilter: false,
    }),
    columnHelper.accessor(row => row.properties?.mapkey || '—', {
        id: 'mapkey',
        header: 'Ключ карти',
        enableGlobalFilter: true,
    }),
    columnHelper.accessor(row => row.properties?.note || '—', {
        id: 'note',
        header: 'Примітка',
        enableGlobalFilter: true,
    }),
    {
        id: 'actions',
        header: 'Дії',
        cell: info => (
        <div style={{ display: 'flex', gap: 8 }}>
            <Styles.button
            onClick={() => handleEdit(info.row.original)}
            title="Редагувати"
            >
            <Styles.ico $pic={EditIco} />
            </Styles.button>
            {/*
            <Styles.button onClick={() => handleDelete(info.row.original._id)} title="Видалити">
                <Styles.ico $pic={DelIco} />
            </Styles.button>
            */}
        </div>
        ),
    },
    ], [handleEdit]);

    const table = useReactTable({
        data: fieldsData,
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
                    placeholder="Пошук по назві, культурі, ключу..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                />
                {/*
                    <Button text="Додати" onClick={handleAdd} />
                */}
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
