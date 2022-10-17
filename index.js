const config = require('./config.json')
const axios = require("axios")
const { Telegraf } = require('telegraf');

const now = new Date();
const days = {
    'LUNDI':0,
    'MARDI':1,
    'MERCREDI':2,
    'JEUDI':3,
    'VENDREDI':4
}
const months = ['', 'janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
const url = "https://top-chef-intra-api.blacktree.io/weeks/current";
const bot = new Telegraf(config.BOT_TOKEN);

bot.command('start', ctx => {
    //console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Hello, pour voir le menu du jour envoie /menu. Pour voir un autre jour spécifie le, par exemple /menu Jeudi', {
    })
})


bot.command('menu', ctx => {
    // Display data of user request
    //console.log(ctx.from)

    axios.get(url, {
        headers: {
            "Content-type" : "application/json",
            "x-api-key" : config.API_TOKEN
        }
    })
        .then(response => {
            // Display data of response
            //console.log(response.data)

            // Get the day specified in the message
            let user_day = ctx.update.message.text.split(' ')[1]
            let display_day = ""
            let day_number
            
            // If user specify a day
            if(user_day != undefined){
                // Get the day number
                day_number = days[user_day.toUpperCase()]
                // Try to get the day name by the number
                display_day = Object.keys(days)[day_number]          
            }

            // If user doesn't specify a day or if the day is not valid
            if(day_number == undefined){
                let current_day = now.getDay() - 1

                // If it's saturday or sunday, display monday
                if(current_day == -1 || current_day == 5){
                    current_day = 0
                }                
                // After 15pm, display the menu of the next day
                else if(now.getHours() >= 15){
                    current_day += 1
                }


                day_number = current_day
                display_day = Object.keys(days)[current_day]
            }

            // Uppercase the first letter of the day and lowercase the rest
            display_day = display_day.charAt(0).toUpperCase() + display_day.slice(1).toLowerCase();

            // Get the month of the desired menu
            let menu_month = months[response.data.days[day_number].day.split('T')[0].split('-')[1]]
            // Get the day of the desired menu
            let menu_day = response.data.days[day_number].day.split('T')[0].split('-')[2]

            // Set date as title
            let message = `📅 ${display_day} ${menu_day} ${menu_month}\n\n`;

            // Get the menu of the desired day and format it
            response.data.days[day_number].menus.forEach((menu, index) => {
                if(menu.mainCourse[0] != undefined && menu.mainCourse[0] != ""){
                    if(index == 0){
                        message += `🍴 MENU ${index + 1} 🐷🍴\n\n`
                    } else if (index == 1){
                        message += `🍴 MENU ${index + 1} 🥦🍴\n\n`
                    } else if (index == 2){
                        message += `🍴 MENU ${index + 1} 🐟🍴\n\n`
                    } else {
                        message += `🍴 MENU ${index + 1} 🍴\n\n`
                    }
                    message += menu.starter + "\n\n"
                    message = menu.mainCourse[0] != "" ? message + menu.mainCourse[0] + "\n" : message
                    message = menu.mainCourse[1] != "" ? message + menu.mainCourse[1] + "\n" : message
                    if(menu.mainCourse[2] != undefined && menu.mainCourse[2] != ""){
                        message = menu.mainCourse[2] != "" ? message + menu.mainCourse[2] + "\n" : message
                    }
                    message += "\n" + menu.dessert  + "\n\n"
                }
            })

            // Send the message
            bot.telegram.sendMessage(ctx.chat.id, message, {})
            

        })
        .catch(function (error) {
            console.log("Cannot access URL");

            bot.telegram.sendMessage(ctx.chat.id, "Il n'y a rien à manger aujourd'hui", {})
        })
})


bot.launch()