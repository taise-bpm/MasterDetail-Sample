export const detailScenarios = {
    list: [
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
        { name: 'descritpion', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
    ],
    view: [
        { name: 'detailId', label: 'Detail ID', type: 'number' },
        { name: 'masterId', label: 'Master ID', type: 'number' },
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'descritpion', label: 'Description', type: 'textarea' }
    ],
    create: [
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
        { name: 'descritpion', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
    ],
    update: [
        { name: 'detailId', label: 'Detail ID', type: 'hidden' },
        { name: 'masterId', label: 'Master ID', type: 'hidden' },
        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
        { name: 'descritpion', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
    ]
};