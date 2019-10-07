const axios = require('axios');

const config = require('../config.js');

class AlarmSlack {
    static fail(report, realDevice) {
        if (process.env.NODE_ENV !== 'production') {
            return;
        }
        axios.post(config.slack_bot_url, {
            username: 'Appium auto test',
            text: ' ',
            attachments: [{
                title: 'Appium AutoTest Running Fail',
                text: `Time : ${report.time.toLocaleString()}\nVersion : ${report.versionName}\nReal Device : ${realDevice}\nFail Count : ${report.errorCount}\nTotal : ${report.flows.length}`,
                color: '#ed0000',
            }],
        });
    }

    static success(report, realDevice) {
        if (process.env.NODE_ENV !== 'production') {
            return;
        }
        axios.post(config.slack_bot_url, {
            username: 'Appium auto test',
            text: ' ',
            attachments: [{
                title: 'Appium AutoTest Running Success',
                text: `Time : ${report.time.toLocaleString()}\nVersion : ${report.versionName}\nReal Device : ${realDevice}\nTotal : ${report.flows.length}`,
                color: '#2bce64',
            }],
        });
    }
}

module.exports = AlarmSlack;
