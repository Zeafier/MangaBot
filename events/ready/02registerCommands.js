const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommmads');
const getLocalCommands = require('../../utils/getLocalCommands');
const checkIfCanPost = require('../../cron/checkServerIfCanPost');
const getServerSettings = require('../../database/server/getAllServers');

const createCommands = async (client, guildId) => {
  const localCommands = getLocalCommands();
  const applicationCommands = await getApplicationCommands(
    client,
    guildId
  );

  for (const localCommand of localCommands) {
    const { name, description, options } = localCommand;

    const existingCommand = await applicationCommands.cache.find(
      (cmd) => cmd.name === name
    );

    if (existingCommand) {
      if (localCommand.deleted) {
        await applicationCommands.delete(existingCommand.id);
        console.log(`🗑 Deleted command "${name}".`);
        continue;
      }

      if (areCommandsDifferent(existingCommand, localCommand)) {
        await applicationCommands.edit(existingCommand.id, {
          description,
          options,
        });

        console.log(`🔁 Edited command "${name}".`);
      }
    } else {
      if (localCommand.deleted) {
        console.log(
          `⏩ Skipping registering command "${name}" as it's set to delete.`
        );
        continue;
      }

      await applicationCommands.create({
        name,
        description,
        options,
      });

      console.log(`👍 Registered command "${name}."`);
    }
  }
}

module.exports = async (client, arg, ID = 'NaN') => {
  
  try {

    if(ID !== 'NaN') {
      await createCommands(client, ID);
    } else {
      // get all servers settings
      const serverSettings = await getServerSettings();

      //finish if no server
      if(serverSettings.length <= 0) {
        return console.log('There are currently no servers');
      }

      for(const server of serverSettings) {
        const guildId = server._id;

        let res = await checkIfCanPost(client, guildId);
        
        //Check if bot can post
        if(!res){
          console.log(`skipping ${guildId}`);
          continue;
        }

        await createCommands(client, guildId)
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};