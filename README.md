# Discord Posts Bot

A Discord bot that allows users to post messages to the Simple Posts website using slash commands.

## Features

- `/post` - Post a message to the website
- `/getposts` - Get the latest posts from the website
- `/deleteallposts` - Delete all posts (restricted to authorized user only)

## Setup

### 1. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" section and click "Add Bot"
4. Copy the bot token
5. Copy the Application ID (Client ID) from "General Information"

### 2. Bot Permissions

Your bot needs these permissions:
- `applications.commands` (for slash commands)
- `Send Messages`
- `Use Slash Commands`

### 3. Invite Bot to Server

1. Go to "OAuth2" > "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Select permissions: `Send Messages`, `Use Slash Commands`
4. Copy the generated URL and invite the bot to your server

### 4. Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your Discord bot credentials:
   ```
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_GUILD_ID=your_guild_id_here
   ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Bot

```bash
npm start
```

## Commands

### `/post <message>`
Posts a message to the Simple Posts website. The message will be prefixed with your Discord username.

Example: `/post Hello from Discord!`

### `/getposts [count]`
Retrieves the latest posts from the website. Optionally specify how many posts to retrieve (1-20, default: 5).

Example: `/getposts 10`

### `/deleteallposts`
**⚠️ ADMIN ONLY** - Deletes all posts from the website. This command is restricted to user ID: `1195808542628774001`

## Configuration

- **Authorized User**: The user ID `1195808542628774001` is hardcoded for the delete command
- **Posts API**: Points to `https://simple-posts-app.netlify.app/posts`
- **Command Registration**: Set `DISCORD_GUILD_ID` for faster command updates, or leave empty for global commands

## API Integration

The bot integrates with the Simple Posts API:
- **GET** `/posts` - Retrieve posts
- **POST** `/posts` - Create new posts
- **DELETE** operations - Handled through direct database access

## Security

- Delete command is restricted to a specific user ID
- Error handling prevents sensitive information leakage
- Commands can be made ephemeral (private responses) when needed
