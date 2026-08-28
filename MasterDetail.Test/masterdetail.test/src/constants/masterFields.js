export const masterScenarios = {
    list: [
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
        { name: 'descritption', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
    ],
    view: [
        { name: 'masterId', label: 'Master ID', type: 'number' },
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'descritption', label: 'Description', type: 'textarea' }
    ],
    create: [
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
        { name: 'descritption', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
    ],
    update: [
        { name: 'masterId', label: 'Master ID', type: 'hidden' },
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
        { name: 'descritption', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
    ]
};