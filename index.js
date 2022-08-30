//環境変数
require("dotenv").config()
const ENV = process.env

//discord関連
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//関数系
const functions_get = require("./functions/functions.js")
const functions = functions_get(
  MessageEmbed,
  client
);

//コマンドデータ
const fs = require("fs")
const path = require("path")
const command_folder = "./commands/"
let commands = []
let command_functions = {}
const files = fs.readdirSync(command_folder)
  .filter((file) => {
      return path.extname(file).toLowerCase() === ".js";
  })
for(const file of files){
  const command_file_setup = require(`${command_folder}${file}`)
  const command_file = command_file_setup()
  commands.push(command_file.data)
  command_functions[command_file.data.name] = command_file.command
}
console.log(command_functions);

//コマンドセットアップ
const commandSetUp = require("./functions/cmd_setup.js")
commandSetUp(client, ENV, commands);

//コマンドとか
client.on('interactionCreate', async interaction => { //メッセージを受け取ったら
  if (!interaction.isCommand()) return; //コマンド以外は無視

  const { commandName } = interaction;
  const channelID = interaction.channel.id;

  command_functions[commandName](
    interaction
  )
});

client.login(ENV.TOKEN);