const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
    let localCommands = [];
    
    const commandCategories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true
    );

    for (const commandCategory of commandCategories) {
        const commandFiles = getAllFiles(commandCategory);

        for (const commandFile of commandFiles) {
            const commandObject = require(commandFile);
            //continue loop if there is exception
            if (exceptions.includes(commandObject.name)) {
                continue;
            }
            
            //push commands
            localCommands.push(commandObject);
        }
    }

    return localCommands
}