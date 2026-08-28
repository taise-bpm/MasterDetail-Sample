import React from 'react';
import { Edit2, Trash2, ArrowRight, Eye } from 'lucide-react';

export default function RecordCard({ title, description, data, fields, onEdit, onDelete, onClickView, viewLabel, onViewDetail }) {
    // Helper to get value gracefully handling known typos
    const getFieldValue = (obj, fieldName) => {
        if (!obj) return '';
        if (obj[fieldName] !== undefined && obj[fieldName] !== null && obj[fieldName] !== '') return obj[fieldName];
        return '';
    };

    let displayTitle = title;
    if (data && fields && fields.length > 0) {
        displayTitle = getFieldValue(data, fields[0].name);
    }

    let bodyContent = null;
    if (data && fields && fields.length > 1) {
        bodyContent = (
            <div className="space-y-3 flex-1 mb-6 mt-2">
                {fields.slice(1).map(field => (
                    <div key={field.name} className="flex flex-col text-sm">
                        <span className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">{field.label}</span>
                        <span className="text-gray-700 dark:text-gray-300 line-clamp-2 mt-0.5">{getFieldValue(data, field.name) || <span className="text-gray-400 italic">N/A</span>}</span>
                    </div>
                ))}
            </div>
        );
    } else {
        bodyContent = (
            <p className={`text-gray-600 dark:text-gray-300 text-sm flex-1 line-clamp-2 ${onClickView ? 'mb-6' : 'mb-2'}`}>
                {description || <span className="text-gray-400 dark:text-gray-500 italic">No description provided.</span>}
            </p>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate pr-4">{displayTitle}</h3>
                <div className="flex space-x-1 shrink-0">
                    {onViewDetail && (
                        <button
                            onClick={onViewDetail}
                            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-md transition-colors"
                            title="View Details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={onEdit}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {bodyContent}

            {onClickView && viewLabel && (
                <button
                    onClick={onClickView}
                    className="mt-auto w-full flex items-center justify-center py-2.5 bg-gray-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-colors group"
                >
                    {viewLabel}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    );
}
