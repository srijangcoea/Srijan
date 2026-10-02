import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import {
  useLegacyTable as useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table/legacy';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Columns,
  Search,
  Maximize2,
  Minimize2,
  Inbox
} from 'lucide-react';

export default function DataTable({
  data = [],
  columns = [],
  loading = false,
  globalFilter = '',
  setGlobalFilter,
  rowSelection = {},
  setRowSelection,
  onRowClick,
  pageSizeOptions = [10, 25, 50, 100],
  initialPageSize = 25,
  title,
  actions,
  filterControls,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showColMenu, setShowColMenu] = useState(false);
  const [dense, setDense] = useState(true);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection: rowSelection || {},
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/[0.06] backdrop-blur-sm">
        {/* Search & Custom Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {setGlobalFilter !== undefined && (
            <div className="relative min-w-[220px] max-w-sm flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search all records..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40"
              />
            </div>
          )}
          {filterControls}
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2 justify-end">
          {actions}

          {/* Dense Toggle */}
          <button
            onClick={() => setDense(!dense)}
            title={dense ? 'Comfortable view' : 'Compact dense view'}
            className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            {dense ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
          </button>

          {/* Column Visibility Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowColMenu(!showColMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <Columns size={14} />
              <span className="hidden sm:inline">Columns</span>
            </button>

            {showColMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowColMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/[0.1] rounded-xl shadow-2xl p-2 z-40 max-h-72 overflow-y-auto space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Toggle Columns
                  </div>
                  {table.getAllLeafColumns().map((column) => {
                    if (column.id === 'select' || column.id === 'actions') return null;
                    return (
                      <label
                        key={column.id}
                        className="flex items-center gap-2 px-2 py-1 rounded text-xs text-slate-300 hover:bg-white/5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={column.getToggleVisibilityHandler()}
                          className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-0"
                        />
                        <span className="capitalize">
                          {typeof column.columnDef.header === 'string'
                            ? column.columnDef.header
                            : column.id}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[640px] relative scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-950/95 backdrop-blur z-20 border-b border-white/[0.08] text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                        className={`px-3 py-3 select-none ${
                          canSort ? 'cursor-pointer hover:text-slate-200' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1.5">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-slate-500">
                              {sorted === 'asc' ? (
                                <ArrowUp size={13} className="text-cyan-400" />
                              ) : sorted === 'desc' ? (
                                <ArrowDown size={13} className="text-cyan-400" />
                              ) : (
                                <ArrowUpDown size={12} className="opacity-40 hover:opacity-100" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {loading ? (
                // Skeleton loading rows
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="px-3 py-3.5">
                        <div className="h-3.5 bg-white/[0.06] rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={`transition-colors duration-150 ${
                      row.getIsSelected()
                        ? 'bg-cyan-500/10 hover:bg-cyan-500/15'
                        : 'hover:bg-white/[0.03]'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-3 ${dense ? 'py-2' : 'py-3.5'} align-middle`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-16 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox size={36} className="text-slate-600" />
                      <p className="text-sm font-medium text-slate-400">No matching records found</p>
                      <p className="text-xs text-slate-600">Try adjusting your filters or search terms</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-white/[0.06] bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Page{' '}
              <strong className="text-white">
                {table.getState().pagination.pageIndex + 1}
              </strong>{' '}
              of{' '}
              <strong className="text-white">
                {Math.max(1, table.getPageCount())}
              </strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>
              Total{' '}
              <strong className="text-cyan-400">
                {table.getFilteredRowModel().rows.length}
              </strong>{' '}
              entries
            </span>
            {Object.keys(rowSelection || {}).length > 0 && (
              <>
                <span className="text-slate-600">|</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium">
                  {Object.keys(rowSelection).length} selected
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2">
              <span className="text-slate-500">Rows:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="bg-white/[0.04] border border-white/[0.08] text-white rounded px-2 py-1 text-xs outline-none focus:border-cyan-500/50"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size} className="bg-slate-900 text-white">
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded border border-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 text-slate-300"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 rounded border border-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 text-slate-300"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded border border-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 text-slate-300"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-1 rounded border border-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 text-slate-300"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
