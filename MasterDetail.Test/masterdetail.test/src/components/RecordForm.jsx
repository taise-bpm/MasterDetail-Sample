import React, { useState, useEffect } from 'react';
import DynamicSelect from './DynamicSelect';

export default function RecordForm({ initialData, onSubmit, onCancel, submitLabel, fields }) {
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
        return (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-center">
                <p className="font-semibold mb-1">Missing Scenario Configuration</p>
                <p className="text-sm">Please provide a valid fields scenario (e.g. scenarios.create or scenarios.update) to render this form.</p>
            </div>
        );
    }

    const formFields = fields;

    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            const initial = {};
            formFields.forEach(field => {
                initial[field.name] = '';
            });
            setFormData(initial);
        }
    }, [initialData, fields]);

    const handleChange = (name, value) => {
        setFormData(prev => {
            const nextData = { ...prev, [name]: value };

            // Cascading resets for dynamic dropdowns
            const resetDependents = (changedFieldName) => {
                formFields.forEach(f => {
                    if (f.type === 'dynamic-select' && f.dependsOn) {
                        const dependencies = Object.values(f.dependsOn);
                        if (dependencies.includes(changedFieldName)) {
                            nextData[f.name] = ''; // Reset dependent field
                            resetDependents(f.name); // Recursively reset down the chain
                        }
                    }
                });
            };

            resetDependents(name);
            return nextData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
                <div key={field.name} style={{ display: field.type === 'hidden' ? 'none' : 'block' }}>
                    {field.type !== 'checkbox' && field.type !== 'hidden' && (
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                    )}
                    {field.type === 'textarea' ? (
                        <textarea
                            rows={3}
                            required={field.required}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                        />
                    ) : field.type === 'select' ? (
                        <select
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none"
                        >
                            <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
                            {field.options?.map((opt, idx) => (
                                <option key={idx} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : field.type === 'radio' ? (
                        <div className="flex flex-wrap gap-4 mt-1">
                            {field.options?.map((opt, idx) => (
                                <label key={idx} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={field.name}
                                        value={opt.value}
                                        checked={formData[field.name] === opt.value}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        required={field.required}
                                        className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                                    />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    ) : field.type === 'checkbox' ? (
                        <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer mt-2 pt-1">
                            <input
                                type="checkbox"
                                checked={!!formData[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.checked)}
                                required={field.required}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5 bg-white dark:bg-gray-900 dark:border-gray-600 transition-colors"
                            />
                            <span>{field.label} {field.required && <span className="text-red-500">*</span>}</span>
                        </label>
                    ) : field.type === 'dynamic-select' ? (
                        <DynamicSelect
                            field={field}
                            value={formData[field.name]}
                            onChange={(val) => handleChange(field.name, val)}
                            formData={formData}
                        />
                    ) : (
                        <input
                            type={field.type || 'text'}
                            required={field.required}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder={field.placeholder}
                        />
                    )}
                </div>
            ))}
            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                >
                    {submitLabel || 'Save'}
                </button>
            </div>
        </form>
    );
}
