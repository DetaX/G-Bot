require('dotenv').config();

const tmi = require('tmi.js');

const items = ["Spirit Box","Livre d'écriture fantomatique","Lecteur EMF","Lampe UV","Caméra vidéo","Projecteur D.O.T.S.","Bougie","Crucifix","Bâton lumineux","Détecteur de mouvement","Microphone parabolique","Sel","Pilules calmantes","Bâton d'encens","Capteur sonore","Thermomètre","Trépied"]

let itemsRemaining = [];
let currentItems = [];
const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },

    identity: {
        username: `${process.env.TWITCH_USERNAME}`,
        password: `oauth:${process.env.TWITCH_OAUTH}`
    },
    channels: [`${process.env.TWITCH_CHANNEL}`]
});


client.connect().catch(console.error);

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

client.on('message', (channel, tags, message, self) => {
    if (self) return;

if (tags.vip || tags.mod || (tags.badges&&tags.badges.broadcaster)) {
    switch (message.toLowerCase()) {
        case '!newgame':
            client.say(channel, 'Une nouvelle partie de Photo surprise a été lancée');
            itemsRemaining = items.slice(0);
            currentItems = [];
            break;
        case '!objet':
            if (itemsRemaining.length == 0) {
                client.say(channel, 'La liste des items restants est vide, faites !newgame pour lancer une nouvelle partie de Photo surprise');
            }
            else {
                shuffleArray(itemsRemaining);
                let item = itemsRemaining.pop();
                currentItems.push(item);
                client.say(channel, 'Le nouvel objet est : ' + item);
            }
            break;
        case '!recap':
            if (currentItems.length > 0) client.say(channel, 'Les objets disponibles sont : ' + currentItems.join(', '));
            else client.say(channel, 'Aucun objet n\'est disponible pour le moment');
            break;
        default:
            break;
    }
}

});