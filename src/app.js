import tmi from 'tmi.js';
import { CHANNEL_NAME , OAUT , BOT_NAME } from './constants';

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: CHANNEL_NAME,
		password: OAUT
	},
	channels: [ CHANNEL_NAME ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    if (self) return;
    if (message.substring(0, 6).toLowerCase() === '!rps @') {
        var player1 = tags.username;
        var player2 = message.substring(6, message.length)
		client.say(channel, `@${tags.username} challenges @${player2} to a game of rock paper scissors!`)
		client.say(channel, `@${tags.username} and @${player2}, whisper me your choices!`)
		start_game(channel, player1, player2)
    }
});

function start_game(channel, player1, player2){
	var x
	var y
	// todo: THIS CAN'T BE HERE. ASYNC METHOD CAN'T SIT HERE. NEED TO FIX.
    client.on("whisper", (from, userstate, message, self) => {
		// Don't listen to my own messages..
		if (self) return;

		// Do your stuff.
		if(from == ('#'+player1) && (typeof x == 'undefined')){
			x = verify(channel, from, message)
			console.log(`player1: (${from}) = ${x}`)
		}
		if(from == ('#'+player2) && (typeof y == 'undefined')){
			y = verify(channel, from, message)
			console.log(`player2: (${from}) = ${y}`)
		}
		if((typeof x != 'undefined') && (typeof y != 'undefined')){
			client.say(channel, rock_paper_scissors(channel, x, y, player1, player2))
		}
	});
}

function rock_paper_scissors(channel, x, y, player1, player2) {
	var results = x + y;
	console.log(results)
    switch (results) {
        case "rockrock":
			return `Rock to Rock! @${player1} and @${player2} tied!`
        case "rockpaper":
			return `Paper covers Rock! @${player2} wins!`
        case "rockscissors":
			return `Rock breaks Scissors! @${player1} wins!`
        case "paperrock":
			return  `Paper covers Rock! @${player1} wins!`
        case "paperpaper":
			return `Paper to Paper! @${player1} and @${player2} tied!`
        case "paperscissors":
			return `Scissors cut Paper! @${player2} wins!`
        case "scissorsrock":
			return `Rock breaks Scissors! @${player2} wins!`
        case "scissorspaper":
			return `Scissors cut Paper! @${player1} wins!`
        case "scissorsscissors":
			return `Scissors to Scissors! @${player1} and @${player2} tied!`
        default:
			client.say(channel, `Uh oh! Something went wrong! Try again!`)
			break
    }
}

function verify(channel, from, message){
	switch(message){
		case "rock":
			client.say(channel, `Locking in, @${from.substring(1)}!`)
			return "rock"
		case "paper":
			client.say(channel, `Locking in, @${from.substring(1)}!`)
			return "paper"
		case "scissors":
			client.say(channel, `Locking in, @${from.substring(1)}!`)
			return "scissors"
		default:
			client.say(channel, `Sorry @${from.substring(1)}, that wasn't a valid input. Try again!`)
	}
}
