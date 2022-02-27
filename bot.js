
const ow = require('overwatch-stats-api');

var Discord = require('discord.io');

var logger = require('winston');

// var auth = require('./auth.json');

require("dotenv").config();

// Configure logger settings

logger.remove(logger.transports.Console);

logger.add(new logger.transports.Console, {

colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot

var bot = new Discord.Client({

token: process.env.BOT_TOKEN,

autorun: true,

id: 942943031999496192

});

bot.on('ready', function (evt) {

logger.info('Connected');

logger.info('Logged in as: ');

logger.info(bot.username + ' - (' + bot.id + ')');
});

class owUser{
    
    constructor(user){
        this.user = user;
        let status = false;
        let hero = 'overall';
    }
    getUser(){
        return this.user;
    }
    setUser(owUser){
        this.user = owUser
    }
    getStatus(){
        return this.status;
    }
    setStatus(currStatus){
        this.status = currStatus;
    }
    getHero(){
        return this.hero;
    }
    setStatus(currHero){
        this.hero = currHero;
    }
}
const platform = 'pc';
var currUser;

bot.on('message', function (user, userID, channelID, message, evt) {

// Our bot needs to know if it will execute a command

// It will listen for messages that will start with `!`

if (message.substring(0, 1) == '!') {

    var args = message.substring(1).split(' ');

    var cmd = args[0];
    

    args = args.splice(1);

var usernameSet = false;


    switch(cmd) {

        // convert to ifs (will let us match for any hero and stat category)

        case 'OW':
        case 'ow':
        case 'Ow':
        case 'oW':

        bot.sendMessage({

            to: channelID,
            message:  "Hello! Enter your username beginning with a !. Be sure to include the dash and 4 digits. Wait about 10 seconds and then enter any of the following commands\n"+
            "Type !lvl to see level\n"+
            "Type ! then role name (support, tanks, dps) to see sr\n" +
            "Type !endorselvl to see endorsement level\n"

        
        })
        break;
        
        case 'lvl':
            if(currUser.getStatus()){

                bot.sendMessage({
                    to: channelID,
                    message: currUser.getUser() + "'s Level: " + stats['prestige'] + stats['level']
                })
            }
            break;

            case 'support':
                if(currUser.getStatus() && stats['rank']['support']['sr'] !== undefined){
   
                    bot.sendMessage({
                        to: channelID,
                        message: currUser.getUser() + "'s Support SR: " + stats['rank']['support']['sr']
                    })
                }
                else{
                    bot.sendMessage({
                        to: channelID,
                        message: "Unranked in role"
                    })
                }
                break;

            case 'tank':
                if(currUser.getStatus() && stats['rank']['tank']['sr'] !== undefined){

                    bot.sendMessage({
                        to: channelID,
                        message: currUser.getUser() + "'s Tank SR: " + stats['rank']['tank']['sr']
                    })
                }
                else{
                    bot.sendMessage({
                        to: channelID,
                        message: "Unranked in role"
                    })
                }
                break;

                case 'dps':
                    if(currUser.getStatus() && stats['rank']['damage']['sr'] !== undefined){

                        bot.sendMessage({
                            to: channelID,
                            message: currUser.getUser() + "'s Damage SR: " + stats['rank']['damage']['sr']
                        })
                    }
                    else{
                        bot.sendMessage({
                            to: channelID,
                            message: "Unranked in role"
                        })
                    }
                break;

                case 'endorselvl':
                    if(currUser.getStatus()){

                        bot.sendMessage({
                            to: channelID,
                            message: currUser.getUser() + "'s Endorsement Level: " + stats["endorsementLevel"]
                        })
                    }
                    
                break;

                case 'border':
                    if(currUser.getStatus()){

                        bot.sendMessage({
                            to: channelID,
                            message: stats['borderURL']
                        })
                        bot.sendMessage({
                            to: channelID,
                            message: stats['starsURL']
                        })
                    }
                break;

                case "test":
                    if(currUser.getStatus()){
                        const keys = Object.keys(stats['heroStats']['quickplay'][hero]['match_awards']);
                        console.log(keys);

                        let outputStr = "";

                        keys.forEach((key, index) => {
                            console.log(`${key}: ${stats['heroStats']['quickplay']['overall']['match_awards'][key]}`);
                            outputStr += `${key}: ${stats['heroStats']['quickplay']['overall']['match_awards'][key]}` + "\n"
                        });

                        bot.sendMessage({
                            to: channelID,
                            message: outputStr
                        })
                    }
                    
                break;

                case 'hero':

                break;
    


        default:

        currUser = new owUser(cmd);
        currUser.setStatus(true);
        (async () => {
            stats = await ow.getAllStats(currUser.getUser(), platform);
            console.log(stats);
          })();



        break;

        
        }
            
        // Just add any case commands if you want to..

     }




});

