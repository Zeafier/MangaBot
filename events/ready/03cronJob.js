let cron = require('node-cron');
let cron_settins = require('../../cron/settings');

module.exports = (client) => {
    console.log('Cronjob has been set up');

    cron.schedule('01 24 * * * *', async () => {
        cron_settins(client);
    });
}