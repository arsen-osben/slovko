const TelegramBot = require('node-telegram-bot-api');

// Токен твого бота, який ти отримав від BotFather
const token = '7646966927:AAEVr90fdsRL9zSahG10vQ_bVDGt4VBqPOc';
const bot = new TelegramBot(token, {polling: true});

// Коли користувач пише команду /play
bot.onText(/\/play/, (msg) => {
  const chatId = msg.chat.id;

  // Кнопка з посиланням на твою гру
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Play game',  // Текст на кнопці
            url: 'https://arsen-osben.github.io/slovko/'  // Твоя гра
          }
        ]
      ]
    }
  };

  // Відправка повідомлення з кнопкою
  bot.sendMessage(chatId, 'Click below to play the game!', options);
});
