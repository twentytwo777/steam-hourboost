const steam = require('node-steam');
const steamUser = require('steam-user');
const readline = require('readline');
const process = require('process');
const steamGames = require('./steam-games.json');

const steamClient = new steam.SteamClient();
const steamClientUser = new steamUser(steamClient);
const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class SteamBoost {
    constructor() {
        this.dataAccount = [];
        this.init();
    };

    async init() {
        process.title = 'Steam HoursBoost by twentytwo777';
        this.initDataAccount();
    };

    initDataAccount() {
        readInterface.question(`Enter your login Steam account: `, login => {
            this.dataAccount.push(login.trim());

            readInterface.question(`Enter your password Steam account: `, password => {
                this.dataAccount.push(password.trim());
                this.SteamInitConnect();
            });
        });
    };

    SteamInitConnect() {
        console.log('Connecting to Steam...');

        steamClient.connect();
        steamClient.on('connected', _ => {
            console.log('Connected to Steam.');
            console.log('Logging in...');

            if (this.dataAccount[0] === '' || this.dataAccount[1] === '') {
                console.log('Login or password is empty.');
                process.exit();
            };

            steamClientUser.logOn({
                accountName: this.dataAccount[0],
                password: this.dataAccount[1]
            });
        });

        steamClientUser.on('steamGuard', (domain, callback) => {
            domain == null ? console.log('Find Steam Guard Code in Mobile App.') : console.log(`Find Steam Guard Code in mail (${domain}).`);

            readInterface.question(`Enter Steam Guard Code: `, code => {
                callback(code.trim());
                readInterface.close();
            });
        });

        steamClientUser.on('loggedOn', response => {
            if (response.eresult === steam.EResult.OK) {
                console.log('Logged in.');

                console.log('Set status on online...');
                steamClientUser.setPersona(steam.EPersonaState.Online);

                console.log('Running game...');
                console.log('Game running.');
                
                return steamClientUser.gamesPlayed(steamGames['app-id']);
            };

            return console.log('Error logging in.');
        });

        steamClient.on('error', e => console.log(`${e}`));
        steamClientUser.on('error', e => {
            console.log(`${e}`);
            process.exit();
        });
    };
};

module.exports = SteamBoost;