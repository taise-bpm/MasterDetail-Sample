// export const childScenarios = {
//     list: [
//         { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
//         { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
//     ],
//     view: [
//         { name: 'childId', label: 'Child ID', type: 'number' },
//         { name: 'detailId', label: 'Detail ID', type: 'number' },
//         { name: 'masterId', label: 'Master ID', type: 'number' },
//         { name: 'name', label: 'Name', type: 'text' },
//         { name: 'description', label: 'Description', type: 'textarea' }
//     ],
//     create: [
//         { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
//         { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
//     ],
//     update: [
//         { name: 'childId', label: 'Child ID', type: 'hidden' },
//         { name: 'detailId', label: 'Detail ID', type: 'hidden' },
//         { name: 'masterId', label: 'Master ID', type: 'hidden' },
//         { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
//         { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' }
//     ]
// };




//-------------------------------
export const childScenarios = {
    list: [


        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },



        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' },



        { name: 'status', label: 'Status', type: 'select', required: true },



        { name: 'notificationPreference', label: 'Notification Preference', type: 'radio', required: true },



        { name: 'termsAccepted', label: 'I accept the terms and conditions', type: 'checkbox', required: true },






    ],
    view: [
        { name: 'childId', label: 'Child ID', type: 'number' },


        { name: 'name', label: 'Name', type: 'text' },



        { name: 'description', label: 'Description', type: 'textarea' },



        { name: 'status', label: 'Status', type: 'select' },



        { name: 'notificationPreference', label: 'Notification Preference', type: 'radio' },



        { name: 'termsAccepted', label: 'I accept the terms and conditions', type: 'checkbox' },



        { name: 'masterId', label: 'Select Master', type: 'dynamic-select' },



        { name: 'detailId', label: 'Select Detail', type: 'dynamic-select' }


    ],
    create: [


        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },



        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' },



        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,

            options: [

                { label: 'Active', value: 'active' },

                { label: 'Inactive', value: 'inactive' },

                { label: 'Pending', value: 'pending' }

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



        { name: 'termsAccepted', label: 'I accept the terms and conditions', type: 'checkbox', required: true },



        {
            name: 'masterId',
            label: 'Select Master',
            type: 'dynamic-select',
            entity: 'master',
            required: true,
            placeholder: 'Choose a master record...',

        },



        {
            name: 'detailId',
            label: 'Select Detail',
            type: 'dynamic-select',
            entity: 'detail',
            required: true,
            placeholder: 'Choose a dependent detail...',

            dependsOn: {

                masterId: 'masterId'

            }

        }


    ],
    update: [
        { name: 'childId', label: 'Child ID', type: 'hidden' },


        { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },



        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description' },



        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,

            options: [

                { label: 'Active', value: 'active' },

                { label: 'Inactive', value: 'inactive' },

                { label: 'Pending', value: 'pending' }

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



        { name: 'termsAccepted', label: 'I accept the terms and conditions', type: 'checkbox', required: true },



        {
            name: 'masterId',
            label: 'Select Master',
            type: 'dynamic-select',
            entity: 'master',
            required: true,
            placeholder: 'Choose a master record...',

        },



        {
            name: 'detailId',
            label: 'Select Detail',
            type: 'dynamic-select',
            entity: 'detail',
            required: true,
            placeholder: 'Choose a dependent detail...',

            dependsOn: {

                masterId: 'masterId'

            }

        }


    ]
};