import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRentsData } from '../../hooks/useRentData';
import {
    createColumnHelper,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import Styles from './styled';
import EditIco from '../../assets/ico/edit-icon-black.png';
// import DelIco from '../../assets/ico/del-icon-black.png';
// import { setSelectedRent, openAddRentModal } from '../../store/modalSlice';

export default function RentsTab() {

    const dispatch = useDispatch();
    const { data: rentsData = [], isLoading, isError, error } = useRentsData();

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const columnHelper = createColumnHelper();

    const handleEdit = (rent) => {
        // dispatch(setSelectedRent(rent._id));
        // dispatch(openAddRentModal());
        console.log('Edit rent:', rent);
    };

    const totalArea = useMemo(() => {
        return rentsData.reduce((sum, rent) => {
            const area = parseFloat(rent.properties?.area);
            return !isNaN(area) ? sum + area : sum;
        }, 0).toFixed(4);
    }, [rentsData]);

    const columns = useMemo(() => [
        {
            id: 'rowNumber',
            header: '#',
            cell: info => info.row.index + 1,
            enableSorting: false,
        },
        columnHelper.accessor(row => row.properties?.name || '—', {
            id: 'name',
            header: 'Орендар',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.properties?.ikn || '—', {
            id: 'ikn',
            header: 'Кадастровий номер',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.properties?.lessor || '—', {
            id: 'lessor',
            header: 'Орендодавець',
            enableGlobalFilter: true,
        }),
        columnHelper.accessor(row => row.properties?.area, {
            id: 'area',
            header: 'Площа (га)',
            enableSorting: true,
            cell: info => {
                const raw = info.getValue();
                const num = parseFloat(raw);
                return !isNaN(num) ? num.toFixed(4) : '—';
            },
        }),
        columnHelper.accessor(row => row.properties?.end, {
            id: 'end',
            header: 'Кінець оренди',
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
        // {
        //     id: 'actions',
        //     header: 'Дії',
        //     enableSorting: false,
        //     cell: info => (
        //         <div style={{ display: 'flex', gap: 8 }}>
        //             <Styles.button
        //                 onClick={() => handleEdit(info.row.original)}
        //                 title="Редагувати"
        //             >
        //                 <Styles.ico $pic={EditIco} />
        //             </Styles.button>
        //         </div>
        //     ),
        // },
    ], []);

    const table = useReactTable({
        data: rentsData,
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
                    placeholder="Пошук по орендарю, кадастру, орендодавцю..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div><b>Сумарна площа:</b> {totalArea} га</div>
                    <Styles.sortButtons>
                        <button onClick={() => setSorting([{ id: 'area', desc: false }])}>↑ Площа</button>
                        <button onClick={() => setSorting([{ id: 'area', desc: true }])}>↓ Площа</button>
                        <button onClick={() => setSorting([{ id: 'end', desc: false }])}>↑ Кінець оренди</button>
                        <button onClick={() => setSorting([{ id: 'end', desc: true }])}>↓ Кінець оренди</button>
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
                                        style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', userSelect: 'none' }}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === 'asc' ? ' 🔼' :
                                            header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
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
