module.exports = [
    {
        name: "role",
        description: "Role to view ticket channel",
        type: 8,
        required: true
    },
    {
        name: "category",
        description: "Category to ticket create in",
        type: 7,
        channel_types: [4],
        required: true
    },
    {
        name: "embed_color",
        description: "The hex color for embed color",
        type: 3
    },
    {
        name: "error_color",
        description: "The hex color for error embed color",
        type: 3
    },
    {
        name: "embed_content",
        description: "The content for the embed",
        type: 3
    },
    {
        name: "limit_per_user",
        description: "The Limit per user for creating tickets",
        type: 4
    }
]