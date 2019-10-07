const wd = require('wd');
const config = require('../config.js');
const ActioniOS = require('./testUtility/actioniOS.js');
const ActionAndroid = require('./testUtility/actionAndroid.js');

class BaseFlow {
    constructor(capability, flowname, report, platform) {
        this._name = flowname;
        this._ui_test_err = null;
        this._language = capability.language;
        this._devicename = capability.deviceName;
        this._capability = capability;
        this._appversion = capability.app;
        this._realdevice = (capability.udid !== undefined);
        this._report = report;
        this._platform = platform;
        this.setup();
    }

    setup() {
        this._driver = wd.promiseChainRemote({
            host: config.appium_host,
            port: config.appium_port,
        });
        if (this._platform === 'iOS') {
            this._action = new ActioniOS(
                this._driver, this._language, this._devicename, this._appversion,
                this._report, this._name, this._realdevice,
            );
        } else if (this._platform === 'android') {
            this._action = new ActionAndroid(
                this._driver, this._language, this._devicename, this._appversion,
                this._report, this._name, this._realdevice,
            );
        } else {
            throw Error('platform not exists');
        }
    }

    get name() { return this._name; }

    get deviceName() { return this._devicename; }

    get language() { return this._language; }

    get realdevice() { return this._realdevice; }

    cancel() {
        this._action.cancel();
    }

    // eslint-disable-next-line
    async execUIFlow() {
        // override this function to test UI Flow
    }

    async main() {
        try {
            await this._driver.init(this._capability);
            await this._driver.unlock();
        } catch (error) {
            this._report.addAction(
                this._name, this._devicename, this._language,
                error.toString(), 'AppiumErrorImage', true, this._realdevice,
            );
            await this.tearDown();
            return;
        }
        try {
            await this.execUIFlow();
        } catch (error) {
            if (error.message === 'cancel flow') {
                throw error;
            } else {
                console.log(error);
                await this._action.saveScreenshot('Error', true);
            }
        }
        await this.tearDown();
    }

    async tearDown() {
        try {
            await this._driver.quit();
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = BaseFlow;
