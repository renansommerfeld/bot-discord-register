const { SlashCommandBuilder, MessageEmbed, User } = require('discord.js');

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
      option.setName('contratante')
        .setDescription('Quem contratou a pessoa')
        .setRequired(true)
    ),

  async execute(interaction) {
    const nome = interaction.options.getString('nome');
    const id = interaction.options.getString('id');
    const contratante = interaction.options.getUser('contratante');
    const tagRoleId = '1128025823425871992'; // ID do cargo da tag
    const responseChannelId = '1128308534044528652'; // ID do canal para a resposta

    const tagRole = interaction.guild.roles.cache.get(tagRoleId);

    if (!tagRole) {
      return interaction.reply('O ID do cargo da tag é inválido.');
    }

    // Verificar se o ID contém apenas números
    if (!/^\d+$/.test(id)) {
      return interaction.reply('O ID deve conter apenas números.');
    }

    await interaction.member.setNickname(`${id} | ${nome}`);

    // Adicionar a tag
    await interaction.member.roles.add(tagRole);
    console.log(`Tag "${tagRole.name}" adicionada para o usuário ${interaction.member.user.tag}`);

    interaction.reply(`Nome atualizado para ${id} | ${nome}`).then(reply => {
      setTimeout(() => {
        reply.delete().catch(console.error);
      }, 10000); // 10 segundos (em milissegundos)
    });

    // Obter o canal de destino para o registro
    const responseChannel = interaction.guild.channels.cache.get(responseChannelId);

    if (!responseChannel) {
      return interaction.reply('O ID do canal de resposta é inválido.');
    }

    responseChannel.send(`Usuário ${interaction.member.user.tag} atualizou o nome para ${id} | ${nome}. Contratante: ${contratante}`);
  },
};
