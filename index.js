const Discord = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');

const { createCanvas } = require('canvas');
const { token, prefix, welcomeChannel, backgroundWelcomeImageName, developer, developerImage, botColor } = require('./config.json');

const client = new Discord.Client();
const canvas = createCanvas(500, 500);
const ctx = canvas.getContext('2d');

client.once('ready', () => {
  console.log(`Захожу как: ${client.user.tag}!`);
  client.user.setActivity(`${prefix}help`);
});

client.on('message', async message => {
  var now = new Date();

  try {
    if (!fs.existsSync(`./logs/${message.guild.name}/`)) {
      fs.mkdirSync(`./logs/${message.guild.name}/`)
    }

    console.log(`${now}, ${message.guild.name}, ${message.author.username}: ${message.content}`);
    fs.appendFile(`./logs/${message.guild.name}/logs.log`, `${now}, ${message.author.username}: ${message.content}\n`, function (error) {
      if (error) console.log(error);
    });
  } catch {
    console.log(`${message.author.username}: ${message.content}`);
  }

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    const Embed = new Discord.MessageEmbed()
      .setColor(botColor)
      .setTitle(`Помощь`)
      .setURL()
      .setDescription(`Помощь: ${message.guild.name}`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: `${prefix}help`, value: 'Выводит это сообщение' },
        { name: `${prefix}help`, value: 'Выводит это сообщение' }
      )
      .setFooter(`От ${developer}`, developerImage);
    message.channel.send(Embed);
  } else if (command === 'password') {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0, n = charset.length; i < 16; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    message.channel.send(`Пароль: ||${password}|| :keyboard:`);
  }
});

client.on('guildMemberAdd', async member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === welcomeChannel);
  if (!channel) return;

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage(backgroundWelcomeImageName);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.font = '35px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Привет,', canvas.width / 2.5, canvas.height / 3.5);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

  channel.send(attachment);
});

client.on('guildMemberRemove', async member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === welcomeChannel);
  if (!channel) return;

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage(backgroundWelcomeImageName);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.font = '35px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Пока,', canvas.width / 2.5, canvas.height / 3.5);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

  channel.send(attachment);
});

client.once('reconnecting', () => {
  console.log(`Перезашёл как: ${client.user.tag}!`);
  client.user.setActivity(`${prefix}help - help`);
  client.generateInvite(["ADMINISTRATOR"]).then(link => {
    inviteUrl = link;
  });
});

client.once('disconnect', () => {
  console.log(`Отключился как ${client.user.tag}!`);
});

client.on('guildMemberBoost', (member) => {
  console.log(`${member.user.tag} сделал "буст" серверу ${member.guild.name}!`);
});

client.login(token);