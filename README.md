# 📃 Ticket Bot


## ticket discord bot [Features](#features).

---
### Note: Node.js 16.6.0 or newer is required.
---

## Installation

```sh
npm install
```
---

### You need to rename example.env file to `.env` and fill the info.
### Slash commands not showing in your server? fill `.env` info, and run `slash.js` file.

- .env
```sh
TOKEN=
BOTID=
SERVERID=
HOST=
USER=
DATABASE=
PORT=3306
OWNERS=["596227913209217024"]
```

### Features:
- Send message to ticket after user left the server.
- Send message and add user to the ticket after user rejoined the server.
- Ability to set staff, managers role for ticket channel and changed the embed text, and alot more ...
- Ability to add / remove user to the ticket with `/add`, `/remove` commands.
- Ability to close / open ticket with `/close`, `/open` commands.
- Ability to show all ticket list, and filtered them by `user tickets`, `opened tickets`, `closed tickets` tickets.
- Ability to rename the ticket with `/rename` command.
- Ability to use variables in ticket content.