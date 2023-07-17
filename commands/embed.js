const { SlashCommandBuilder, MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const embedJSON = {
  "content": "",
  "tts": false,
  "embeds": [
    {
      "id": 146439687,
      "description": "***Para realizar o cadastro é bem simples, basta executar o comando abaixo e preencher as informações***\n\n`/registro`\n\n***Ou, pode copiar e colar ;)***",
      "fields": [],
      "thumbnail": {
        "url": "https://media0.giphy.com/media/3NwOtkEa3GzCJNTplM/giphy.gif?cid=790b7611jl50ft42peuxosxbc0tzbc295i26t7streylhhxf&ep=v1_gifs_search&rid=giphy.gif&ct=g"
      },
      "footer": {
        "text": "Mafia",
        "icon_url": "https://media0.giphy.com/media/3NwOtkEa3GzCJNTplM/giphy.gif?cid=790b7611jl50ft42peuxosxbc0tzbc295i26t7streylhhxf&ep=v1_gifs_search&rid=giphy.gif&ct=g"
      },
      "color": 1523182,
      "title": "**Bem-Vindo a MAFIA**"
    }
  ],
  "components": [],
  "actions": {}
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emb')
    .setDescription('Enviar um embed'),

  async execute(interaction) {
    const channelId = process.env.ALLOWED_CHANNEL_ID;
    const adminRoleName = `𝗠.𝗙・𝗕𝗼𝘁'𝘀`; // Substitua pelo nome correto do cargo de administrador

    if (interaction.channelId !== channelId) {
      const allowedChannel = interaction.guild.channels.cache.get(channelId);
      return interaction.reply(`Este comando só pode ser executado no canal ${allowedChannel}`).catch(console.error);
    }

    const adminRole = interaction.guild.roles.cache.find(role => role.name === adminRoleName);

    if (!adminRole || !interaction.member.roles.cache.has(adminRole.id)) {
      return interaction.reply('Este comando requer permissão de administrador.').catch(console.error);
    }

    const embedData = {
      embeds: [embedJSON.embeds[0]]
    };

    interaction.reply(embedData)
      .then(() => {
        console.log('Embed enviado com sucesso.');
      })
      .catch(error => {
        console.error('Erro ao enviar o embed:', error);
        interaction.reply('Houve um erro ao enviar o embed.');
      });
  },
};
