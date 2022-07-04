// Steam
const steam = require('steam-user');
const readline = require('readline');
const games = require('./steam-games.json');

const user = new steam();
const readInterface = readline.createInterface({input: process.stdin, output: process.stdout});

class SteamBoost {
    constructor() {
        this.dataAccount = [];
        this.init();
    };

    init() {
        this.initDataAccount();
    };

    initDataAccount() {
        readInterface.question('Enter your login Steam account: ', login => {
            this.dataAccount.push(login);

            readInterface.question('Enter your password Steam account: ', password => {
                this.dataAccount.push(password);
                this.SteamInitConnect();
            });
        });
    };

    SteamInitConnect() {
        console.log('Logging in...');

        if (this.dataAccount[0] == '' || this.dataAccount[1] == '') {
            console.log('Login or password is empty.');
            process.exit();
        };

        user.logOn({accountName: this.dataAccount[0], password: this.dataAccount[1]});
        user.on('steamGuard', (domain, callback) => {
            domain == null ? console.log('Find Steam Guard Code in Mobile App.') : console.log(`Find Steam Guard Code in mail (${domain}).`);

            readInterface.question('Enter Steam Guard Code: ', code => {
                callback(code);
                readInterface.close();
            });
        });

        user.on('loggedOn', _ => {
            console.log('Logged in.');

            user.setPersona(steam.EPersonaState.Online);
            user.gamesPlayed(games['app-id']);

            console.log('Game(-s) running.');
        });

        user.on('error', e => {
            console.log(`Error logging: ${e.message}`);
            console.log(`Script will be closed. Please, try again.`);
            
            process.exit();
        });
    };
};

module.exports = SteamBoost;