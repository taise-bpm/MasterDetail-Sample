import React from 'react';
import { useMasters } from '../hooks/useMasterHooks';
import { useDetails } from '../hooks/useDetailHooks';
import { useChildren } from '../hooks/useChildHooks';

export default function DynamicSelect({ field, value, onChange, formData }) {
    if (field.entity === 'master') {
        return <MasterSelect field={field} value={value} onChange={onChange} />;
    }
    if (field.entity === 'detail') {
        const masterId = formData[field.dependsOn?.masterId];
        return <DetailSelect field={field} value={value} onChange={onChange} masterId={masterId} />;
    }
    if (field.entity === 'child') {
        const masterId = formData[field.dependsOn?.masterId];
        const detailId = formData[field.dependsOn?.detailId];
        return <ChildSelect field={field} value={value} onChange={onChange} masterId={masterId} detailId={detailId} />;
    }
    return <div className="text-red-500 text-sm py-2">Unknown entity type: {field.entity}</div>;
}

function MasterSelect({ field, value, onChange }) {
    const { data, isLoading } = useMasters('', false);
    const options = data ? data.pages.flatMap(page => page.masters || page.content || page.data || []) : [];

    return (
        <select
            required={field.required}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none"
            disabled={isLoading}
        >
            <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
            {options.map(opt => (
                <option key={opt.masterId} value={opt.masterId}>{opt.name}</option>
            ))}
        </select>
    );
}

function DetailSelect({ field, value, onChange, masterId }) {
    const { data, isLoading } = useDetails(masterId, '', false);
    const options = data ? data.pages.flatMap(page => page.details || page.detailList || page.content || page.data || []) : [];

    // Disable if no masterId is selected or if loading
    const isDisabled = !masterId || isLoading;

    return (
        <select
            required={field.required}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isDisabled}
        >
            <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
            {options.map(opt => (
                <option key={opt.detailId} value={opt.detailId}>{opt.name}</option>
            ))}
        </select>
    );
}

function ChildSelect({ field, value, onChange, masterId, detailId }) {
    const { data, isLoading } = useChildren(masterId, detailId, '', false);
    const options = data ? data.pages.flatMap(page => page.childs || page.children || page.childList || page.content || page.data || []) : [];

    // Disable if missing dependencies or loading
    const isDisabled = !masterId || !detailId || isLoading;

    return (
        <select
            required={field.required}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isDisabled}
        >
            <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
            {options.map(opt => (
                <option key={opt.childId} value={opt.childId}>{opt.name}</option>
            ))}
        </select>
    );
}
