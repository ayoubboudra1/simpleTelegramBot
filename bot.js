const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const token  = '6665225787:AAHk7YHyQjHqORIdoEJ6WFDLzGRXNd0qTRI';
const chatId = '1764251980';
const url    = 'https://trouverunlogement.lescrous.fr/tools/36/search?bounds=5.2286902_43.3910329_5.5324758_43.1696205'


const words = ["BALUSTRES", "CHATENOUD" ];

const bot = new TelegramBot(token, { polling: true });



function monitorTemplate() {
    // let lastModifiedTime = fs.statSync(filePath).mtimeMs;

    setInterval(async () => {

        try{
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            var numberOfMessage = 50;
            let adresse = $('p.fr-card__desc').text();
            let prix    = $('p.fr-badge').text();
            let surface = $('p.fr-card__detail').text().split('m²')[0].trim();
            let link = $('h3.fr-card__title > a').attr('href');
            let title  = $('h3.fr-card__title > a').text();


            const message = `Adresse : ${adresse}\n\nPrix : ${prix}\n\nSurface : ${surface}\n\nLink : https://trouverunlogement.lescrous.fr${link}\n\nTitle : ${title}`

            bot.sendMessage(chatId, message);
            

            const containsWord = words.some(word => title.includes(word));

            if(!containsWord) {
                numberOfMessage = 2
            }
            for(let i = 0; i < numberOfMessage; i++) {
                setTimeout(() => {
                    bot.sendMessage(chatId, message);
                }, 1000);
            }
           
        }
        catch(err) {
            console.log(err);
        }

    }, 5000);
}

// checkWebsite(url, 'h1');
monitorTemplate();
