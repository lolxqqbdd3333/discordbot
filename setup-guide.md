# Discord Bot Setup Guide

## 🤖 **Discord Posts Bot Ready!**

Your Discord bot is fully configured and ready to use! Here's how to set it up:

## 📋 **Quick Setup Steps**

### 1. **Create Discord Bot**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Enter name: `Posts Bot`
3. Go to "Bot" → Click "Add Bot"
4. **Copy the Bot Token** (keep this secret!)
5. Go to "General Information" → **Copy Application ID**

### 2. **Get Server/Guild ID**
1. In Discord, right-click your server name
2. Click "Copy Server ID" (enable Developer Mode if needed)

### 3. **Configure Environment**
Create a `.env` file in the `discordpost` folder:
```
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_application_id_here  
DISCORD_GUILD_ID=your_server_id_here
```

### 4. **Invite Bot to Server**
1. In Developer Portal → "OAuth2" → "URL Generator"
2. Select scopes: `bot` + `applications.commands`
3. Select permissions: `Send Messages` + `Use Slash Commands`
4. Copy generated URL and invite bot to your server

### 5. **Start the Bot**
```bash
cd discordpost
npm start
```

## ⚡ **Available Commands**

### `/post <message>`
- **Purpose**: Post a message to the website
- **Example**: `/post Hello from Discord!`
- **Result**: Message appears on https://simple-posts-app.netlify.app
- **Format**: `[YourUsername]: Your message`

### `/getposts [count]`
- **Purpose**: Get latest posts from website
- **Example**: `/getposts 10`
- **Default**: Shows 5 posts if no count specified
- **Range**: 1-20 posts maximum

### `/deleteallposts`
- **Purpose**: ⚠️ **DELETE ALL POSTS** (Admin only)
- **Restriction**: Only user ID `1195808542628774001` can use this
- **Action**: Permanently removes all posts from website
- **Response**: Private (ephemeral) confirmation

## 🔧 **Technical Details**

- **API Integration**: Points to `https://simple-posts-app.netlify.app/posts`
- **Database**: Supabase with public access enabled
- **Commands**: Registered instantly in your server (via GUILD_ID)
- **Security**: Delete command restricted to specific user ID
- **Error Handling**: Comprehensive error messages and logging

## 🎯 **Usage Examples**

```
User: /post Check out this cool feature!
Bot: ✅ Message posted successfully!
     ```Check out this cool feature!```
     🔗 View at: https://simple-posts-app.netlify.app

User: /getposts 3
Bot: 📋 Latest 3 posts:
     
     **8/16/2025** - [YourUsername]: Check out this cool feature!
     **8/16/2025** - [System]: API integration working
     **8/16/2025** - [Demo]: Ready for Discord commands!
     
     🔗 View all posts: https://simple-posts-app.netlify.app

Admin: /deleteallposts
Bot: 🗑️ All posts deleted! All posts deleted successfully
     (Only visible to admin)
```

## 🚀 **Ready to Use!**

Once configured, your Discord bot will:
1. ✅ Connect to Discord servers
2. ✅ Register slash commands instantly  
3. ✅ Post messages to the website
4. ✅ Retrieve and display posts
5. ✅ Allow admin to delete all posts
6. ✅ Handle errors gracefully

Perfect integration between Discord and your Simple Posts website! 🎉
