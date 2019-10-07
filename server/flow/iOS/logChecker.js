const CHECK_INTERVAL = 20 * 1000;

class LogChecker {
    constructor(driver) {
        this._driver = driver;
    }

    async checkIsLogExist(logInformation) {
        let isExist = false;
        const nowTimestamp = Date.now();
        const syslogs = await this._driver.log('syslog');
        for (let i = syslogs.length - 1; i > 0; i -= 1) {
            if (new RegExp(`${logInformation}`, 'i').test(syslogs[i].message)) {
                isExist = true;
                break;
            }
            if (syslogs[i].timestamp < nowTimestamp - CHECK_INTERVAL) {
                break;
            }
        }
        return isExist;
    }
}

module.exports = LogChecker;
