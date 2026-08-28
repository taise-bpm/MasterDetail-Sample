import React from 'react';
import { Edit2, Trash2, ArrowRight, Eye } from 'lucide-react';

export default function RecordTable({ data, fields, onEdit, onDelete, onClickView, viewLabel, onViewDetail, lastElementRef, idField }) {
    if (!data || data.length === 0) return null;

    // Helper to get value gracefully handling known typos
    const getFieldValue = (obj, fieldName) => {
        if (!obj) return '';
        if (obj[fieldName] !== undefined && obj[fieldName] !== null && obj[fieldName] !== '') return obj[fieldName];
        return '';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                        {fields.map(field => (
                            <th key={field.name} className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm tracking-wider">
                                {field.label}
                            </th>
                        ))}
                        <th className="py-3 px-4 text-right font-semibold text-gray-700 dark:text-gray-300 text-sm tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {data.map((row, index) => {
                        const isLast = data.length === index + 1;
                        return (
                            <tr
                                key={idField ? row[idField] : index}
                                ref={isLast ? lastElementRef : null}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors group"
                            >
                                {fields.map(field => (
                                    <td key={field.name} className="py-3 px-4 text-gray-600 dark:text-gray-300 text-sm max-w-xs truncate">
                                        {getFieldValue(row, field.name) || <span className="text-gray-400 italic">N/A</span>}
                                    </td>
                                ))}
                                <td className="py-3 px-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        {onViewDetail && (
                                            <button
                                                onClick={() => onViewDetail(row)}
                                                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-md transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && idField && (
                                            <button
                                                onClick={() => onDelete(row[idField])}
                                                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onClickView && viewLabel && (
                                            <button
                                                onClick={() => onClickView(row)}
                                                className="p-1.5 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors flex items-center"
                                                title={viewLabel}
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
