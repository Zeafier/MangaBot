let cron = require('node-cron');
let cron_settins = require('../../utils/cron/settings');

module.exports = (client) => {
    console.log('Cronjob has been set up');

    cron.schedule('0 0 */3 * * *', async () => {
        cron_settins(client);
    });
}