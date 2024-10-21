const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Crează clientul Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]
});

// Categoriile de locații
const locations = {
    "🌆": { name: "Cayo", civili: [], politie: [], medici: [] },
    "🏙️": { name: "Oraș", civili: [], politie: [], medici: [] },
    "🌄": { name: "Paleto", civili: [], politie: [], medici: [] },
};

// Evenimentul la conectarea botului
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Comanda de start
client.on('messageCreate', async (message) => {
    if (message.content === '!start') {
        const embed = new EmbedBuilder()
            .setTitle('Locații')
            .setDescription('Reacționează pentru a selecta o locație!')
            .addFields(
                { name: '🌆 Cayo', value: 'Reacționează pentru Cayo', inline: false },
                { name: '🏙️ Oraș', value: 'Reacționează pentru Oraș', inline: false },
                { name: '🌄 Paleto', value: 'Reacționează pentru Paleto', inline: false }
            );

        const embedMessage = await message.channel.send({ embeds: [embed] });
        for (const emoji in locations) {
            await embedMessage.react(emoji);
        }
    }
});

// Evenimentul pentru reacții
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;

    const emoji = reaction.emoji.name;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (locations[emoji]) {
        // Adaugă utilizatorul în funcție de rol
        if (member.roles.cache.some(role => role.name === 'Civil')) {
            locations[emoji].civili.push(user.username);
        } else if (member.roles.cache.some(role => role.name === 'Poliție')) {
            locations[emoji].politie.push(user.username);
        } else if (member.roles.cache.some(role => role.name === 'Medic')) {
            locations[emoji].medici.push(user.username);
        }
        await updateEmbed(reaction.message);
    }
});

// Funcția pentru actualizarea mesajului embed
async function updateEmbed(message) {
    const embed = new EmbedBuilder()
        .setTitle('Locații')
        .setDescription('Reacționează pentru a selecta o locație!');

    for (const emoji in locations) {
        const civili = locations[emoji].civili.join(', ') || 'Nimeni';
        const politie = locations[emoji].politie.join(', ') || 'Nimeni';
        const medici = locations[emoji].medici.join(', ') || 'Nimeni';
        
        embed.addFields(
            { name: `${emoji} ${locations[emoji].name}`, value: `**Civili:** ${civili}\n**Poliție:** ${politie}\n**Medici:** ${medici}`, inline: false }
        );
    }

    await message.edit({ embeds: [embed] });
}

// Conectează botul
client.login('MTI5Nzk5NzMwODUwNzQ1NTUyOQ.GAUnR9.H-WLu89WX6InyvlPmeshfd_wAiX9IjDbwx7hJ0');
