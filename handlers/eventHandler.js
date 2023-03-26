const getAllFiles = require("../utils/getAllFiles");
const path = require('path');

//export event handler
module.exports = (client) => {
    //get all folders with events
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    //loop through folders
    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b)

        //replace name of events
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
        
        //get events name
        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);

                await eventFunction(client, arg)
            }
        })
    }
}