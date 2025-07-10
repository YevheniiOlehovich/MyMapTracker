import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePropertiesData } from '../../hooks/usePropertiesData';
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import Styles from './styled';

export default function PropertiesTab() {
    const dispatch = useDispatch();
    const { data: propertiesData = [], isLoading, isError, error } = usePropertiesData();

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const totalArea = useMemo(() => {
        return propertiesData.reduce((sum, p) => {
            const area = parseFloat(p.properties?.area);
            return !isNaN(area) ? sum + area : sum;
        }, 0).toFixed(4);
    }, [propertiesData]);

    const columns = useMemo(() => [
        {
            id: 'rowNumber',
            header: '#',
            cell: info => info.row.index + 1,
            enableSorting: false,
        },
        columnHelper.accessor(row => row.properties?.username || '—', {
            id: 'username',
            header: 'Власник',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.properties?.ikn || '—', {
            id: 'ikn',
            header: 'Кадастровий номер',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.properties?.address || '—', {
            id: 'address',
            header: 'Адреса',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.properties?.area, {
            id: 'area',
            header: 'Площа (га)',
            enableSorting: true,
            cell: info => {
                const num = parseFloat(info.getValue());
                return !isNaN(num) ? num.toFixed(4) : '—';
            },
        }),
        columnHelper.accessor(row => row.properties?.start, {
            id: 'start',
            header: 'Дата набуття',
            enableSorting: true,
            cell: info => {
                const raw = info.getValue();
                const date = new Date(parseInt(raw));
                return isNaN(date) ? '—' : date.toLocaleDateString('uk-UA');
            },
            sortingFn: (rowA, rowB, columnId) => {
                const a = parseInt(rowA.getValue(columnId));
                const b = parseInt(rowB.getValue(columnId));
                return a - b;
            },
        }),
    ], []);

    const table = useReactTable({
        data: propertiesData,
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
                    placeholder="Пошук по назві, кадастру, адресі..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div><b>Сумарна площа:</b> {totalArea} га</div>
                    <Styles.sortButtons>
                        <button onClick={() => setSorting([{ id: 'area', desc: false }])}>↑ Площа</button>
                        <button onClick={() => setSorting([{ id: 'area', desc: true }])}>↓ Площа</button>
                    </Styles.sortButtons>
                </div>
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
                                        style={{
                                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                            userSelect: 'none',
                                        }}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === 'asc' ? ' 🔼'
                                            : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
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
