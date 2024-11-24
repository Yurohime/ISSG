const crypto = require('crypto');

const targetHash = "578ed5a4eecf5a15803abdc49f6152d6";

function md5Hash(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

function bruteForcePIN() {
    for (let pin = 0; pin <= 9999; pin++) {
        const pinString = pin.toString().padStart(4, '0');
        
        const hash = md5Hash(pinString);

        if (hash === targetHash) {
            console.log(`Found PIN: ${pinString}`);
            return pinString;
        }
    }

    console.log("PIN not found.");
    return null;
}

bruteForcePIN();
