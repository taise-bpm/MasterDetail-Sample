import React from 'react';

export default function RecordView({ data, fields }) {
    if (!data) return null;

    // Helper to get value gracefully handling known typos
    const getFieldValue = (obj, fieldName) => {
        if (!obj) return '';
        if (obj[fieldName] !== undefined && obj[fieldName] !== null && obj[fieldName] !== '') return obj[fieldName];
        return '';
    };

    if (fields && fields.length > 0) {
        return (
            <div className="space-y-6">
                {fields.map(field => (
                    <div key={field.name}>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{field.label}</h4>
                        {field.type === 'textarea' ? (
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 mt-2">
                                <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{getFieldValue(data, field.name) || 'N/A'}</p>
                            </div>
                        ) : (
                            <p className="text-gray-900 dark:text-gray-100 text-lg">{getFieldValue(data, field.name) || 'N/A'}</p>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // Fallback if no fields are provided
    const name = data.name || 'N/A';
    const description = data.description || data.descritption || data.descritpion || 'N/A';

    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Name</h4>
                <p className="text-gray-900 dark:text-gray-100 text-lg">{name}</p>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 mt-2">
                    <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{description}</p>
                </div>
            </div>
        </div>
    );
}
