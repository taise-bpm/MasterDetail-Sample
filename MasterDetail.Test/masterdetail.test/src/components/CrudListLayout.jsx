import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Plus, Search, ArrowUpDown, LayoutGrid, List, ArrowLeft } from 'lucide-react';

/**
 * Reusable layout wrapper for Master, Detail, and Child lists.
 * Provides a standardized header, filter bar, loading/error states, and grid container.
 */
export default function CrudListLayout({
    // Header & Breadcrumbs
    breadcrumbs = [],
    backUrl,
    title,
    subtitle,
    // Add Action
    onAdd,
    addLabel = 'Add Record',
    // Search & Sort Filters
    search,
    onSearchChange,
    reverse,
    onReverseToggle,
    // State Tracking
    status,
    isFetchingNextPage,
    // Data Length
    itemsCount,
    // Messages
    loadingMessage = 'Loading records...',
    errorMessage = 'Failed to load records. Please try again.',
    emptyMessage = 'No records found. Click add to create one.',
    // Items
    children
}) {
    // --- View Mode State ---
    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('crudViewMode');
        return savedMode || 'card';
    });

    useEffect(() => {
        localStorage.setItem('crudViewMode', viewMode);
    }, [viewMode]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="sticky top-0 z-10 flex flex-col space-y-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">

                {/* Top row: Breadcrumbs + Title + Add Button */}
                <div className="flex flex-row justify-between items-start sm:items-center sm:space-x-4">
                    <div className="flex flex-row items-start sm:items-center space-x-2 sm:space-x-4 overflow-hidden">
                        {backUrl && (
                            <Link
                                to={backUrl}
                                className="mt-1 sm:mt-0 p-1.5 sm:p-2 shrink-0 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                                title="Back"
                            >
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Link>
                        )}
                        {!Array.isArray(breadcrumbs) && breadcrumbs && (
                            <div className="shrink-0 flex items-center">{breadcrumbs}</div>
                        )}
                        <div className="min-w-0 flex flex-col">
                            {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 && (
                                <div className="hidden sm:flex items-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-1.5">
                                    {breadcrumbs.map((bc, index) => (
                                        <React.Fragment key={index}>
                                            {index > 0 && <span className="text-gray-400 dark:text-gray-600">/</span>}
                                            {bc.path ? (
                                                <Link to={bc.path} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[120px] sm:max-w-[200px]">
                                                    {bc.label}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-800 dark:text-gray-200 truncate max-w-[120px] sm:max-w-[200px]">
                                                    {bc.label}
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                            {title && (
                                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white truncate">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="hidden sm:block text-gray-500 dark:text-gray-400 text-sm mt-0.5 truncate">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-200 dark:shadow-none shrink-0 text-sm sm:text-base"
                        >
                            <Plus className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">{addLabel}</span>
                        </button>
                    )}
                </div>

                {/* Bottom row: Filter Controls */}
                <div className="flex flex-row items-center gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 text-sm sm:text-base"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={onReverseToggle}
                        className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border transition-colors shrink-0 justify-center text-sm sm:text-base ${reverse
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
                            }`}
                        title="Reverse Sort"
                    >
                        <ArrowUpDown className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Reverse</span>
                    </button>

                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shrink-0 border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            title="List View"
                        >
                            <List className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('card')}
                            className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            title="Card View"
                        >
                            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            {status === 'pending' ? (
                <div className="flex justify-center flex-col items-center h-64 my-4">
                    <Loader className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
                    <p className="text-gray-500">{loadingMessage}</p>
                </div>
            ) : status === 'error' ? (
                <div className="flex justify-center flex-col items-center h-64 text-red-500 my-4">
                    <Loader className="w-8 h-8 animate-spin mb-4" />
                    <p>{errorMessage}</p>
                </div>
            ) : typeof children === 'function' ? children(viewMode) : (
                <div className={`gap-6 ${viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'flex flex-col'}`}>
                    {children}
                </div>
            )}

            {/* Empty State */}
            {itemsCount === 0 && status !== 'pending' && status !== 'error' && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    {emptyMessage}
                </div>
            )}

            {/* Inline "Fetching Next Page" Loader */}
            {isFetchingNextPage && (
                <div className="flex justify-center py-6">
                    <Loader className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
            )}
        </div>
    );
}
