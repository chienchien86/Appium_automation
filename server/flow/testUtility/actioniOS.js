const wd = require('wd');

const { TouchAction } = wd;

module.exports = class Action {
    constructor(driver, language, devicename, appversion, report, name, realdevice) {
        this._driver = driver;
        this._language = language;
        this._devicename = devicename;
        this._appversion = appversion;
        this._realdevice = realdevice;
        this._report = report;
        this._name = name;
        this._cancel = false;
    }

    cancel() {
        this._cancel = true;
    }

    checkIsCancel() {
        if (this._cancel) {
            throw new Error('cancel flow');
        }
    }

    async click(elementId) {
        this.checkIsCancel();
        const element = await this._driver.waitForElementById(elementId, 5000);
        const size = await element.getSize();
        const tapAction = new TouchAction().tap({
            el: element, x: size.width / 2, y: size.height / 2,
        });
        await this._driver.performTouchAction(tapAction);
        await this._driver.sleep(800);
    }

    async clickBackArrow() {
        this.checkIsCancel();
        const tapAction = new TouchAction().tap({ x: 20, y: 53 });
        await this._driver.performTouchAction(tapAction);
        await this._driver.sleep(800);
    }

    async clickMenuElement(elementId, num) {
        this.checkIsCancel();
        const element = await this._driver.waitForElementsById(elementId, 5000);
        element[num].click();
    }

    async clickByXpath(xpath) {
        this.checkIsCancel();
        const element = await this._driver.elementByXPath(xpath);
        const size = await element.getSize();
        const tapAction = new TouchAction().tap({
            el: element, x: size.width / 2, y: size.height / 2,
        });
        await this._driver.performTouchAction(tapAction);
        await this._driver.sleep(800);
    }

    async sendKeys(elementId, keys) {
        this.checkIsCancel();
        const element = await this._driver.elementById(elementId);
        await element.sendKeys(keys);
        await this._driver.sleep(800);
    }

    async sendKeysByXpath(xpath, keys) {
        this.checkIsCancel();
        const element = await this._driver.elementByXPath(xpath);
        await element.sendKeys(keys);
        await this._driver.sleep(800);
    }

    async swipeLeft() {
        this.checkIsCancel();
        const swipeAction = new TouchAction(this._driver);
        await swipeAction
            .press({ x: 330, y: 330 })
            .wait(300)
            .moveTo({ x: 100, y: 330 })
            .release()
            .perform();
        await this._driver.sleep(1200);
    }

    async swipeRight() {
        this.checkIsCancel();
        const swipeAction = new TouchAction(this._driver);
        await swipeAction
            .press({ x: 10, y: 330 })
            .wait(300)
            .moveTo({ x: 200, y: 330 })
            .release()
            .perform();
        await this._driver.sleep(1200);
    }

    async saveScreenshot(actionName, error = false) {
        this.checkIsCancel();
        const timestamp = Date.now();
        await this._driver.saveScreenshot(`images/${timestamp}.png`);
        await this._report.addAction(
            this._name,
            this._devicename,
            this._language,
            actionName,
            timestamp,
            error,
            this._realdevice,
        );
        await this._driver.sleep(300);
    }

    async waitElementdisplay(elementId) {
        this.checkIsCancel();
        await this._driver.waitForElementsById(elementId, 5000);
    }

    async sleep(num) {
        this.checkIsCancel();
        await this._driver.sleep(num);
    }

    async execute(direction) {
        this.checkIsCancel();
        await this._driver.execute('mobile: scroll', { direction });
    }

    async acceptAlert() {
        this.checkIsCancel();
        await this._driver.acceptAlert();
    }
};
