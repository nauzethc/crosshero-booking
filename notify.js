const TelegramBot = require('node-telegram-bot-api')
const { telegram } = require('./config')

const bot = telegram.enabled
  ? new TelegramBot(telegram.token)
  : { sendMessage: (_, message) => console.log(message) }

/*
 * Edit this function to create your own notification system
 * based on your personal preference (email, Telegram...)
 */
async function notify (message) {
  return bot.sendMessage(telegram.chatId, message)
}

module.exports = notify
