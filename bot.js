const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const token = '6665225787:AAHk7YHyQjHqORIdoEJ6WFDLzGRXNd0qTRI';
const chatId = '1764251980';




const bot = new TelegramBot(token, { polling: true });

function monitorTemplate(filePath) {
    // let lastModifiedTime = fs.statSync(filePath).mtimeMs;

    setInterval(() => {
        // const stats = fs.statSync(filePath);
        // if (stats.mtimeMs !== lastModifiedTime) {
        // lastModifiedTime = stats.mtimeMs;
        bot.sendMessage(chatId, `Template has changed at `);
        // }
    }, 5000);
}

monitorTemplate('path/to/your/template/file.html');
