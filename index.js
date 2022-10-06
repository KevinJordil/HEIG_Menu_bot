const config = require('./config.json')
const axios = require("axios")
const { Telegraf } = require('telegraf');


const url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
const bot = new Telegraf(config.BOT_TOKEN);

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'hello there! Welcome to my new telegram bot.', {
    })
})


bot.command('faim', ctx => {
    //console.log(ctx.from)
    axios.get(`https://apix.blacktree.io/top-chef/today2`)
        .then(response => {
            //console.log(response.data)

            let message = ``;

            response.data.menus.forEach((menu, index) => {
                if(menu.mainCourse[0] != undefined && menu.mainCourse[0] != ""){
                    message += `🍴 MENU ${index + 1}🍴\n\n${menu.starter}\n\n${menu.mainCourse[0]}\n${menu.mainCourse[1]}\n${menu.mainCourse[2]}\n\n${menu.dessert}\n\n`
                }
            })

            bot.telegram.sendMessage(ctx.chat.id, message, {})

        })
        .catch(function (error) {
            console.log("Cannot access URL");

            bot.telegram.sendMessage(ctx.chat.id, "Problème...", {})
        })
})


bot.launch()