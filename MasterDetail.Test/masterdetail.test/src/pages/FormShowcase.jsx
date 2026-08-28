import React, { useState } from 'react';
import RecordForm from '../components/RecordForm';
import RecordCard from '../components/RecordCard';
import RecordView from '../components/RecordView';

export default function FormShowcase() {
    const [submittedData, setSubmittedData] = useState(null);

    const sampleData = {
        name: 'John Doe',
        bio: 'A passionate developer from the tech world exploring new frameworks and tools.',
        role: 'admin',
        notificationPreference: 'email',
        termsAccepted: true
    };

    const showcaseScenarios = {
        list: [
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'bio', label: 'Biography', type: 'textarea' }
        ],
        view: [
            { name: 'id', label: 'User ID', type: 'number' },
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'bio', label: 'Biography', type: 'textarea' },
            { name: 'role', label: 'System Role', type: 'text' },
            { name: 'notificationPreference', label: 'Notification', type: 'text' }
        ],
        create: [
            { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Jane Doe' },
            { name: 'bio', label: 'Biography', type: 'textarea', placeholder: 'Tell us about yourself...' },
            {
                name: 'role',
                label: 'System Role',
                type: 'select',
                required: true,
                placeholder: 'Choose a role',
                options: [
                    { label: 'Admin', value: 'admin' },
                    { label: 'Editor', value: 'editor' },
                    { label: 'Viewer', value: 'viewer' }
                ]
            },
            {
                name: 'notificationPreference',
                label: 'Notification Preference',
                type: 'radio',
                required: true,
                options: [
                    { label: 'Email', value: 'email' },
                    { label: 'SMS', value: 'sms' },
                    { label: 'Push', value: 'push' }
                ]
            },
            { name: 'termsAccepted', label: 'I accept the terms and conditions', type: 'checkbox', required: true }
        ],
        update: [
            { name: 'id', label: 'User ID', type: 'hidden' }, // Hidden ID field for updates
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'bio', label: 'Biography', type: 'textarea' },
            {
                name: 'role',
                label: 'System Role',
                type: 'select',
                required: true,
                options: [
                    { label: 'Admin', value: 'admin' },
                    { label: 'Editor', value: 'editor' },
                    { label: 'Viewer', value: 'viewer' }
                ]
            }
        ],
        dynamicDropdown: [
            { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Jane Doe' },
            {
                name: 'masterId',
                label: 'Select Master',
                type: 'dynamic-select',
                entity: 'master',
                required: true,
                placeholder: 'Choose a master record...'
            },
            {
                name: 'detailId',
                label: 'Select Detail',
                type: 'dynamic-select',
                entity: 'detail',
                required: true,
                placeholder: 'Choose a dependent detail...',
                dependsOn: { masterId: 'masterId' }
            },
            {
                name: 'childId',
                label: 'Select Child',
                type: 'dynamic-select',
                entity: 'child',
                required: true,
                placeholder: 'Choose a dependent child...',
                dependsOn: { masterId: 'masterId', detailId: 'detailId' }
            }
        ]
    };

    const handleSubmit = (data) => {
        setSubmittedData(data);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-12 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Scenario JSON Showcase</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    A demonstration of how a single set of <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">Scenarios</code> drives the rendering of all core CRUD components dynamically.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Scenario Form */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">1. Create Scenario</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Uses <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">showcaseScenarios.create</code> to collect full user input.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <RecordForm
                            fields={showcaseScenarios.create}
                            onSubmit={handleSubmit}
                            onCancel={() => setSubmittedData(null)}
                            submitLabel="Create User"
                        />
                    </div>
                </div>

                {/* Update Scenario Form */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">2. Update Scenario</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Uses <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">showcaseScenarios.update</code>. Notice how only requested editable fields appear, and the hidden ID is handled seamlessly.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <RecordForm
                            fields={showcaseScenarios.update}
                            initialData={{ ...sampleData, id: 99 }}
                            onSubmit={handleSubmit}
                            onCancel={() => setSubmittedData(null)}
                            submitLabel="Update User"
                        />
                    </div>
                </div>
            </div>

            {submittedData && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <h2 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-4">Captured Form Submission:</h2>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed shadow-inner">
                        {JSON.stringify(submittedData, null, 2)}
                    </pre>
                </div>
            )}

            <div className="pt-8 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* List Scenario Card */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">3. List Scenario</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Uses <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">showcaseScenarios.list</code> to show a compact summary.</p>
                    </div>
                    <div>
                        <RecordCard
                            data={sampleData}
                            fields={showcaseScenarios.list}
                            onEdit={() => alert('Edit clicked')}
                            onDelete={() => alert('Delete clicked')}
                            onClickView={() => alert('View details clicked')}
                            viewLabel="View Detailed Summary"
                        />
                    </div>
                </div>

                {/* View Scenario */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">4. View Scenario</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Uses <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">showcaseScenarios.view</code> to render exhaustive data detail properties.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
                        <RecordView
                            data={{ ...sampleData, id: 99 }}
                            fields={showcaseScenarios.view}
                        />
                    </div>
                </div>
            </div>

            {/* Dynamic Dropdown Scenario */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">5. Dynamic Cascading Dropdowns</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Uses <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">showcaseScenarios.dynamicDropdown</code> to fetch connected options dynamically based on selection.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <RecordForm
                            fields={showcaseScenarios.dynamicDropdown}
                            onSubmit={handleSubmit}
                            onCancel={() => setSubmittedData(null)}
                            submitLabel="Submit Dependent Selection"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
