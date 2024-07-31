const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { count } = require('console');
const express = require('express');

const token  = '6665225787:AAHk7YHyQjHqORIdoEJ6WFDLzGRXNd0qTRI';
const chatId = '1764251980';
const url    = 'https://trouverunlogement.lescrous.fr/tools/36/search?bounds=5.2286902_43.3910329_5.5324758_43.1696205'
const words = ["BALUSTRES", "CHATENOUD" ];
var current_number = 0;
var counter = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function monitorTemplate() {
    // let lastModifiedTime = fs.statSync(filePath).mtimeMs;

        const bot = new TelegramBot(token, { polling: true });
    
        // setInterval(async () => {
        while(true){    

            
            try{
                const { data } = await axios.get(url);
                const $ = cheerio.load(data);
                counter +=1;
                
                list_of_carts = $('ul.fr-grid-row.fr-grid-row--gutters.svelte-11sc5my')
                if(current_number < list_of_carts.length) {
                    list_of_carts.each((index, element) => {
                        const $ = cheerio.load(element);
                        let adresse = $('p.fr-card__desc').text();
                        let prix    = $('p.fr-badge').text();
                        let surface = $('p.fr-card__detail').text().split('m²')[0].trim();
                        let link = $('h3.fr-card__title > a').attr('href');
                        let title  = $('h3.fr-card__title > a').text();
                        const message = `Adresse : ${adresse}\n\nPrix : ${prix}\n\nSurface : ${surface}\n\nLink : https://trouverunlogement.lescrous.fr${link}\n\nTitle : ${title}`
                        bot.sendMessage(chatId, message);
                        // console.log(message)
                    })
    
                    for(let i = 0; i < 50; i++) {
                         // Wait 10 seconds
                        await sleep(2000)
                        bot.sendMessage(chatId, "Wake up !");
    
    
                    }
    
                }
    
                current_number = list_of_carts.length

                if(counter % 200 == 0) {
                    bot.sendMessage(chatId, "Still Working",{disable_notification: true});
                }
    
    
               
            }
            catch(err) {
                console.log(err);
            }

            await sleep(20000);

            // console.log("20sec later,new turn end")
        // }, 30000);
        }

   
}

// checkWebsite(url, 'h1');




const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
  monitorTemplate();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
