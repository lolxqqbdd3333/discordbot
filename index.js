require('dotenv').config();


const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Discord bot configuration
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID; // Optional: for guild-specific commands

// Posts API configuration
const POSTS_API_URL = 'https://simple-posts-app.netlify.app/posts';

// Authorized user ID for delete command
const AUTHORIZED_USER_ID = '1195808542628774001';

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

// Slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('post')
        .setDescription('Post a message to the website')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to post')
                .setRequired(true)
                .setMaxLength(1000)
        ),
    new SlashCommandBuilder()
        .setName('getposts')
        .setDescription('Get the latest posts from the website')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of posts to retrieve (default: 5)')
                .setMinValue(1)
                .setMaxValue(20)
        ),
    new SlashCommandBuilder()
        .setName('deleteallposts')
        .setDescription('⚠️ Delete ALL posts from the website (Admin only)')
];

// Register slash commands
async function registerCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

        if (GUILD_ID) {
            // Register guild-specific commands (faster)
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands }
            );
            console.log('Successfully reloaded guild application (/) commands.');
        } else {
            // Register global commands (takes up to 1 hour)
            await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                { body: commands }
            );
            console.log('Successfully reloaded global application (/) commands.');
        }
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

// API Functions
async function createPost(content) {
    try {
        const response = await fetch(POSTS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

async function getPosts() {
    try {
        const response = await fetch(POSTS_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

async function deleteAllPosts() {
    try {
        const deleteResponse = await fetch(POSTS_API_URL, {
            method: 'DELETE'
        });
        
        if (!deleteResponse.ok) {
            throw new Error(`HTTP error! status: ${deleteResponse.status}`);
        }

        const result = await deleteResponse.json();
        return result;
    } catch (error) {
        console.error('Error deleting posts:', error);
        throw error;
    }
}

// Bot event handlers
client.once('ready', () => {
    console.log(`✅ Discord bot is ready! Logged in as ${client.user.tag}`);
    console.log(`🔗 Connected to Posts API: ${POSTS_API_URL}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    try {
        if (commandName === 'post') {
            await interaction.deferReply();

            const message = interaction.options.getString('message');
            const username = interaction.user.username;
            const postContent = `[${username}]: ${message}`;

            const newPost = await createPost(postContent);

            await interaction.editReply({
                content: `✅ **Message posted successfully!**\n\`\`\`${message}\`\`\`\n🔗 View at: ${POSTS_API_URL.replace('/posts', '')}`,
                ephemeral: false
            });

        } else if (commandName === 'getposts') {
            await interaction.deferReply();

            const count = interaction.options.getInteger('count') || 5;
            const posts = await getPosts();
            
            if (posts.length === 0) {
                await interaction.editReply('📭 No posts found on the website.');
                return;
            }

            const latestPosts = posts.slice(0, count);
            let response = `📋 **Latest ${latestPosts.length} posts:**\n\n`;

            for (const post of latestPosts) {
                const date = new Date(post.created_at).toLocaleDateString();
                const preview = post.content.length > 100 
                    ? post.content.substring(0, 100) + '...' 
                    : post.content;
                response += `**${date}** - ${preview}\n\n`;
            }

            response += `🔗 View all posts: ${POSTS_API_URL.replace('/posts', '')}`;

            await interaction.editReply(response);

        } else if (commandName === 'deleteallposts') {
            // Check if user is authorized
            if (interaction.user.id !== AUTHORIZED_USER_ID) {
                await interaction.reply({
                    content: '❌ **Access Denied!** You are not authorized to use this command.',
                    ephemeral: true
                });
                return;
            }

            await interaction.deferReply({ ephemeral: true });

            const result = await deleteAllPosts();

            await interaction.editReply({
                content: `🗑️ **All posts deleted!** ${result.message}`,
                ephemeral: true
            });
        }

    } catch (error) {
        console.error('Error handling command:', error);
        
        const errorMessage = `❌ **Error:** ${error.message}`;
        
        if (interaction.deferred) {
            await interaction.editReply(errorMessage);
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Start the bot
async function startBot() {
    if (!BOT_TOKEN || !CLIENT_ID) {
        console.error('❌ Missing required environment variables: DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID');
        console.log('📋 Please set these environment variables:');
        console.log('   - DISCORD_BOT_TOKEN: Your bot token from Discord Developer Portal');
        console.log('   - DISCORD_CLIENT_ID: Your bot\'s client ID');
        console.log('   - DISCORD_GUILD_ID: (Optional) Guild ID for faster command registration');
        process.exit(1);
    }

    try {
        await registerCommands();
        await client.login(BOT_TOKEN);
    } catch (error) {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    }
}

startBot();
