const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('This is a test command!'),
    async execute(interaction) {
        await interaction.reply('Test command works!');
    }
}