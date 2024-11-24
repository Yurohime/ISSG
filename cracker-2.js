const crypto = require('crypto');
const https = require('https');
const readline = require('readline');

const targetHash = "578ed5a4eecf5a15803abdc49f6152d6";

const wordlistURL = "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/500-worst-passwords.txt";

function md5Hash(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

function dictionaryAttack(url) {
    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`Failed to fetch wordlist: ${response.statusCode}`);
            return;
        }

        const rl = readline.createInterface({
            input: response,
            crlfDelay: Infinity,
        });

        rl.on('line', (line) => {
            const password = line.trim(); 
            const hash = md5Hash(password);

            if (hash === targetHash) {
                console.log(`Found password: ${password}`);
                rl.close();
                response.destroy(); 
            }
        });

        rl.on('close', () => {
            console.log("Finished processing the wordlist.");
        });
    }).on('error', (err) => {
        console.error(`Error fetching wordlist: ${err.message}`);
    });
}

dictionaryAttack(wordlistURL);
