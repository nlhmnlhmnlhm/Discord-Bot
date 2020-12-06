const discord = require(`discord.js`);

var client = new discord.Client();

const token = "";

client.on ("ready", () => {
    console.log("ready")

    client.user.setActivity ("Whatever you want is not what you seek.");

});

const fsp = require('fs').promises;
const quiz = require('./quiz.json');
const item = quiz[Math.floor(Math.random() * quiz.length)];
const filter = response => {
	return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
};

async function updateBoxInFilePlus(number_box) {
    try {
        let data = await fsp.readFile('quiz.json');
        let obj = JSON.parse(data);
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].question === item.question) {
                obj[i].box = number_box + 1;
            }
          }
        

        await fsp.writeFile('quiz.json', JSON.stringify(obj));
     } catch(e) {
        console.log(e);
        message.channel.send('error sending message');
        throw e;      
     }
}

async function updateBoxInFileMinus(number_box) {
    try {
        let data = await fsp.readFile('quiz.json');
        let obj = JSON.parse(data);
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].question === item.question) {
                obj[i].box = 1;
            }
          }
        

        await fsp.writeFile('quiz.json', JSON.stringify(obj));
     } catch(e) {
        console.log(e);
        message.channel.send('error sending message');
        throw e;      
     }
}

const prefix = "1031";
client.on ("message", (message) => {

    if (message.author.bot) return;
    
    if (message.content.startsWith (prefix + " quiz")) {
        message.channel.send(item.question).then(() => {
        message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                message.channel.send(`${collected.first().author} a la bonne réponse!`);

                if (item.box < 6) {

                    updateBoxInFilePlus(item.box)
                    message.channel.send(`La nouvelle boîte est ${item.box + 1}.`)
                    };

                if (item.box === 6) {
                    message.channel.send('La boîte reste 6.')
                }
            })
            .catch(collected => {
                message.channel.send('On dirait que personne n\'a la bonne réponse cette fois.');
                message.channel.send(item.answers)

                if (item.box > 1) {

                    updateBoxInFileMinus(item.box)
                    message.channel.send(`La nouvelle boîte est 1.`)
                    };

                if (item.box === 1) {
                    message.channel.send('La boîte reste 1.')
                }
            });
    });
    }

});

client.login(token);
