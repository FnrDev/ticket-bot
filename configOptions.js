module.exports = [
    {
        name: "message",
        description: "Configuration your ticket message",
        type: 1,
        options: [
            {
                name: "message",
                description: "The message to sent in ticket",
                type: 3,
                required: true
            }
        ]
    },
    {
        name: "category",
        description: "Configuration your ticket category.",
        type: 1,
        options: [
            {
                name: "category",
                description: "Select category to create ticket in",
                type: 7,
                channel_types: [4],
                required: true
            }
        ]
    },
    {
        name: "color",
        description: "Configuration your embed color",
        type: 1,
        options: [
            {
                name: "success",
                description: "The success embed hex color",
                type: 3,
                required: true
            },
            {
                name: "error",
                description: "The error embed hex color",
                type: 3,
                required: true
            }
        ]
    },
    {
        name: "role",
        description: "Configuration your staff role to view tickets",
        type: 1,
        options: [
            {
                name: "staff",
                description: "The staff role to (view ticket / send messages)",
                type: 8,
                required: true
            },
            {
                name: "managers",
                description: "The managers role to (view ticket / send messages / manage channels / manage messages)",
                type: 8,
                required: true
            }
        ]
    }
]