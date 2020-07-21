const Discord = require('discord.js');
var fs = require('fs');
const bot = new Discord.Client();
const token = process.env.token;
const client_id = '735191172070375474';

//const timezones = ["-12","-11","-10","-9","-8","-7","-6","-5","-4","-3","-2","-1","UTC","+1","+2","+3","+4","+5","+6","+7","+8","+9","+10","+11","+12"];

//This bot is small so im using a shitty system

bot.on('message', (message) =>{
    if (message.author != client_id){
        var command = message.content.split(" ");
        if (command[0] == "!timezone"){
            //Load timezone data
            var user_timezones = fs.readFileSync('user_timezones.json');
            user_timezones = JSON.parse(user_timezones);

            switch (command[1]){
              case "list":
                list_timezones(message.channel,user_timezones);
                break;

              case "user":
                get_user_timezone(message.channel,command,user_timezones,message.author);
                break;

              case "set":
                set_user_timezone(message.channel,message.author,command,user_timezones);
                break;

              case "remove":
                remove_user_timezone(message.channel,message.author,user_timezones);
                break;

              case "help":
                help(message.channel);

            }
        }



    }




})

function list_timezones(channel,t){
  //Create the string
  var string = "";
  var len = Object.keys(t).length;
  var timedata = [[],[],[],[],
                  [],[],[],[],
                  [],[],[],[],
                  [],[],[],[],
                  [],[],[],[],
                  [],[],[],[],
                  [],
];

//Put peoples timezones into array. Slight optomization. Changes time form O(n^2) O(2n)
  for (var i = 0; i<len; i++){
    timedata[parseInt(t[Object.keys(t)[i]],10)+12].push(Object.keys(t)[i]);
  }

  for (var i = -11; i<=12; ++i){
    //Left
    string+='\n'
    string += 'UTC'
    if (i>=0) string+="+";
    string += i.toString()+"\t";
    //Add names
    if (timedata[i+12]){
      for (var j = 0; j<timedata[i+12].length; j++)
        string += timedata[i+12][j];
    }
  }



  const timezoneEmbed = new Discord.MessageEmbed().setTitle('Timezones');
  timezoneEmbed.setColor('#7289da');
  timezoneEmbed.description = string;
  channel.send(timezoneEmbed);


}
function get_user_timezone(channel, command,t,a){
  var user = command[2];
  var timezone = t["<@"+user.slice(3)];
  if (timezone){
    var str = user.toString()+"'s timezone is "+timezone.toString()+".";
    if (t[a]){
      str+=" This is ";
      if (t[a]-timezone < 0){
        str += Math.abs(t[a]-timezone).toString() + " hours behind you!"
      }else if(t[a]-timezone > 0){
        str += Math.abs(t[a]-timezone).toString() + " ahead of you!"

      }else{
        str += "the same timezone as yours!"

      }

    }
    channel.send(str);

  }else{
    channel.send(user.toString()+" has not set thier timezone.");
  }

}
function set_user_timezone(channel, author, command,t){
  //This is where people set thier timezones
  if (command[2]>=-12 && command[2]<=12){
    if (command[2] = -12) command[2] = 12;

    t[author] = command[2];
    fs.writeFile('user_timezones.json',JSON.stringify(t),finished)

    function finished(err){
      channel.send("Your timezone has been set.")
    }

  }else{
    channel.send("Your timezone is not valid. Your timezone must be a number between -12 and 12.")

  }
}
function remove_user_timezone(channel, author, t){
  //This is where remove set thier timezones
  delete t[author];
  fs.writeFile('user_timezones.json',JSON.stringify(t),finished);
  function finished(err){
    channel.send("Your timezone has been removed.")
  }
}
function help(channel){
  const timezoneEmbed = new Discord.MessageEmbed().setTitle('Help');
  timezoneEmbed.setColor('#7289da');
  timezoneEmbed.description = "!timezone set <time>\n!timezone list\n!timezone user <user mention>\n!timezone remove";
  channel.send(timezoneEmbed);

}


bot.login(token);
