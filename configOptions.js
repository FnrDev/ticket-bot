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
            },
            {
                name: "content",
                description: "content will be appeared above embed message, use /variables command to see all available variables.",
                type: 3
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
    },
    {
        name: "limit",
        description: "Configuration the limit for each user to create ticket",
        type: 1,
        options: [
            {
                name: "limit",
                description: "The limit for each user to create ticket",
                type: 4,
                required: true
            }
        ]
    },
    {
        name: "name",
        description: "Configuration the default ticket name",
        type: 1,
        options: [
            {
                name: "name",
                description: "The default ticket name. use variable. {username} to show username of the user",
                type: 3,
                required: true
            }
        ]
    },
    {
        name: "log", 
        description: "Configuration the log channel for (creating / delete) tickets",
        type: 1,
        options: [
            {
                name: "channel",
                description: "Select log channel",
                type: 7,
                channel_types: [0],
                required: true
            }
        ]
    },
    {
        name: "show",
        description: "Show your configurations in this server",
        type: 1
    }
]