import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

const DataTable = ({
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    searchable = true,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No data available',
    compact = false,
    loading = false,
    disablePagination = false,
    rowClassName = null
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredData = searchable && searchQuery
        ? data.filter(row =>
            columns.some(col =>
                String(row[col.key]).toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        : data;

    const sortedData = sortColumn
        ? [...filteredData].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];
            const modifier = sortDirection === 'asc' ? 1 : -1;

            if (typeof aVal === 'string') {
                return aVal.localeCompare(bVal) * modifier;
            }
            return (aVal - bVal) * modifier;
        })
        : filteredData;

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = disablePagination ? sortedData : sortedData.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (columnKey) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    // Column resizing logic
    const [columnWidths, setColumnWidths] = useState({});
    const [resizing, setResizing] = useState(null);
    const resizingRef = useRef(null); // Ref to keep track of resizing state without re-renders loop

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (resizingRef.current) {
                const { key, startX, startWidth } = resizingRef.current;
                const newWidth = Math.max(50, startWidth + (e.clientX - startX));
                setColumnWidths(prev => ({ ...prev, [key]: newWidth }));
            }
        };

        const handleMouseUp = () => {
            if (resizingRef.current) {
                resizingRef.current = null;
                setResizing(null);
                document.body.style.cursor = 'default';
                document.body.style.userSelect = '';
            }
        };

        if (resizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing]);

    const startResizing = (e, key) => {
        e.preventDefault();
        e.stopPropagation();
        const startWidth = e.target.parentElement.offsetWidth;
        const resizeState = { key, startX: e.clientX, startWidth };
        resizingRef.current = resizeState;
        setResizing(resizeState);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        // Initialize width if not set
        if (!columnWidths[key]) {
            setColumnWidths(prev => ({ ...prev, [key]: startWidth }));
        }
    };

    return (
        <div className="space-y-3">
            {/* Search bar - Compact */}
            {searchable && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder={searchPlaceholder}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                </div>
            )}

            {/* Table - Compact with Fixed Header & Resizable Columns */}
            <div className="overflow-auto max-h-[calc(100vh-14rem)] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 custom-scrollbar">
                <table className="w-full relative border-collapse">
                    <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 shadow-sm">
                        <tr>
                            <th className="px-2 py-2.5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide w-12 border-r border-gray-200 dark:border-gray-600">
                                S.No
                            </th>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{
                                        width: columnWidths[column.key] || column.width,
                                        minWidth: column.width
                                    }}
                                    className={`relative ${compact ? 'px-2 py-1.5' : 'px-4 py-2.5'} text-left ${compact ? 'text-[10px]' : 'text-xs'} font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide border-r border-gray-200 dark:border-gray-600 last:border-r-0 group select-none ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                                        }`}
                                    onClick={(e) => {
                                        // Only sort if not resizing
                                        if (column.sortable) handleSort(column.key);
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-1.5 overflow-hidden">
                                        <span className="truncate">{column.label}</span>
                                        {column.sortable && sortColumn === column.key && (
                                            sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                                        )}
                                    </div>

                                    {/* Resizer Handle */}
                                    <div
                                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary-500 transition-colors z-20"
                                        onMouseDown={(e) => startResizing(e, column.key)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </th>
                            ))}
                            {(onEdit || onDelete || onView) && (
                                <th className={`${compact ? 'px-2 py-1.5 text-[10px]' : 'px-4 py-2.5 text-xs'} text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide w-24`}>
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (onEdit || onDelete || onView ? 2 : 1)} className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3"></div>
                                        <p>Loading records...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (onEdit || onDelete || onView ? 2 : 1)} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${rowClassName ? rowClassName(row) : ''}`}
                                >
                                    <td className={`${compact ? 'px-2 py-1 text-xs' : 'px-2 py-2 text-sm'} text-center text-gray-600 dark:text-gray-400 font-medium w-12 border-r border-gray-100 dark:border-gray-700`}>
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={`${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} text-gray-900 dark:text-gray-100 border-r border-gray-100 dark:border-gray-700 last:border-r-0 truncate max-w-xs`}
                                            style={{
                                                width: columnWidths[column.key] || column.width,
                                                maxWidth: columnWidths[column.key] || column.width,
                                                minWidth: column.width
                                            }}
                                        >
                                            <div className="truncate">
                                                {column.render ? column.render(row[column.key], row) : row[column.key]}
                                            </div>
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || onView) && (
                                        <td className={`${compact ? 'px-2 py-1' : 'px-4 py-2'} text-sm`}>
                                            <div className="flex gap-1.5">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(row)}
                                                        className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium"
                                                    >
                                                        View
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        className="px-2.5 py-1 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(row)}
                                                        className="px-2.5 py-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Compact */}
            {!disablePagination && totalPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1.5 text-gray-700 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
