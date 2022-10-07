const config = require('./config.json')
const axios = require("axios")
const { Telegraf } = require('telegraf');


const url = "https://apix.blacktree.io/top-chef/today";
const bot = new Telegraf(config.BOT_TOKEN);

bot.command('start', ctx => {
    //console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Hello, pour voir le menu du jour envoie /menu', {
    })
})


bot.command('menu', ctx => {
    //console.log(ctx.from)
    axios.get(url)
        .then(response => {
            //console.log(response.data)

            let message = "";

            response.data.menus.forEach((menu, index) => {
                if(menu.mainCourse[0] != undefined && menu.mainCourse[0] != ""){
                    message += `🍴 MENU ${index + 1}🍴\n\n`
                    message += menu.starter + "\n\n"
                    message = menu.mainCourse[0] != "" ? message + menu.mainCourse[0] + "\n" : message
                    message = menu.mainCourse[1] != "" ? message + menu.mainCourse[1] + "\n" : message
                    message = menu.mainCourse[2] != "" ? message + menu.mainCourse[2] + "\n" : message
                    message += "\n" + menu.dessert  + "\n\n"
                }
            })

            if(message == ""){
                message = "Aucun menu n'est disponible pour aujourd'hui."
            }

            bot.telegram.sendMessage(ctx.chat.id, message, {})

        })
        .catch(function (error) {
            console.log("Cannot access URL");

            bot.telegram.sendMessage(ctx.chat.id, "Problème de connexion à l'API", {})
        })
})


bot.launch()