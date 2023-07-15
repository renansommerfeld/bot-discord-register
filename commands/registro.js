const { SlashCommandBuilder, MessageEmbed, User } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

// Objeto para armazenar as menções dos recrutadores
const mentions = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registro')
    .setDescription('Registrar usuário')
    .addStringOption(option =>
      option.setName('nome')
        .setDescription('Nome do usuário')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('id')
        .setDescription('ID do usuário (somente números)')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('recrutador')
        .setDescription('Quem contratou a pessoa')
        .setRequired(true)
    ),

  async execute(interaction) {
    const nome = interaction.options.getString('nome');
    const id = interaction.options.getString('id');
    const recrutador = interaction.options.getUser('recrutador');
    const tagRoleId = process.env.TAG_ROLE_ID; // ID do cargo da tag
    const responseChannelId = process.env.RESPONSE_CHANNEL_ID; // ID do canal para a resposta
    const allowedChannelId = process.env.ALLOWED_CHANNEL_ID; // ID do canal permitido

    if (interaction.channelId !== allowedChannelId) {
      const allowedChannel = interaction.guild.channels.cache.get(allowedChannelId);
      return interaction.reply(`A safadinho, esse comando só pode ser executado no canal ${allowedChannel}`).catch(console.error);
    }

    const tagRole = interaction.guild.roles.cache.get(tagRoleId);

    if (!tagRole) {
      return interaction.reply('O ID do cargo da tag é inválido.');
    }

    // Verificar se o ID contém apenas números
    if (!/^\d+$/.test(id)) {
      return interaction.reply('O ID deve conter apenas números.');
    }

    await interaction.member.setNickname(`[M] ${nome} | ${id}`);

    // Adicionar a tag
    await interaction.member.roles.add(tagRole);
    console.log(`A Tag "${tagRole.name}" foi adicionada para o usuário ${interaction.member.user.tag}`);

    interaction.reply(`**Seja Bem-Vindo à Mafia ${nome}!**\n\nLeia nossas regras e respeite a hierarquia. Divirta-se e tenha um bom jogo, seu RANDOLAAAAAA!!!`).then(reply => {
      setTimeout(() => {
        reply.delete().catch(console.error);
      }, 20000); // 20 segundos (em milissegundos)
    });


    // Obter o canal de destino para o registro
    const responseChannel = interaction.guild.channels.cache.get(responseChannelId);

    if (!responseChannel) {
      return interaction.reply('O ID do canal de resposta é inválido.');
    }

    const mentionedNome = interaction.member.toString(); // Menção ao nome do usuário

    // Incrementa o contador de menções do recrutador
    if (!mentions[recrutador.tag]) {
      mentions[recrutador.tag] = 1;
    } else {
      mentions[recrutador.tag]++;
    }

    // Obtém o número de menções do recrutador
    const numMensoes = mentions[recrutador.tag];

    responseChannel.send(`**Nome:** ${mentionedNome}\n**ID:** ${id}\n**Recrutador:** ${recrutador}\n**Recrutamentos:** ${numMensoes}`);
  },
};
