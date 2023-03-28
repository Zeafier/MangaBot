let checkServerIfCanPost = require('./checkServerIfCanPost');
let getAllServers= require('../../database/server/getAllServers');
let removeInactiveServer = require('../../database/server/removeInactiveServer');

module.exports = async (client) => {
    try {
        let servers = await getAllServers();
        let posting_servers = [];
        let removed_servers = [];
        
        for(let i = 0; i<servers.length; i++){
            let server = servers[i];
            let checker = await checkServerIfCanPost(client, server._id)

            //bot can post in server
            if(checker) {
                posting_servers.push(server);
                continue;
            }

            //remove all information from db
            let is_removed = await removeInactiveServer(server._id);

            if(is_removed){
                removed_servers.push(server);
            }else{
                console.log('There was problem with removing one of the servers');
            }
        }

        //display which servers has been removed
        if(removed_servers.length > 0){
            console.log(`Removed: \n${removed_servers}`);
        }
        
        return posting_servers;
    } catch (error) {
        console.log(error)
    }

    
}