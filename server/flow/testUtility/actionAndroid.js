const wd = require('wd');

const { TouchAction } = wd;

class ActionAndroid {
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

    async sleep(num) {
        this.checkIsCancel();
        await this._driver.sleep(num);
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

    async clickByAccessibilityId(accessibilityId) {
        this.checkIsCancel();
        const element = await this._driver.elementByAccessibilityId(accessibilityId, 5000);
        const size = await element.getSize();
        const tapAction = new TouchAction().tap({
            el: element, x: size.width / 2, y: size.height / 2,
        });
        await this._driver.performTouchAction(tapAction);
        await this._driver.sleep(800);
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

    async clickMenuElement(num) {
        this.checkIsCancel();
        await this.clickByXpath(`/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v4.widget.DrawerLayout/android.widget.FrameLayout/android.support.v7.widget.RecyclerView/android.support.v7.widget.LinearLayoutCompat[${num}]`);
    }

    async clickBackArrow() {
        this.checkIsCancel();
        const tapAction = new TouchAction().tap({ x: 25, y: 70 });
        await this._driver.performTouchAction(tapAction);
        await this._driver.sleep(800);
    }

    async waitElementDisplay(elementId) {
        this.checkIsCancel();
        await this._driver.waitForElementsById(elementId, 5000);
    }

    async waitElementDisplayXpath(elementId) {
        this.checkIsCancel();
        await this._driver.waitForElementsByXPath(elementId, 5000);
    }

    async swipeLeft() {
        this.checkIsCancel();
        const swipeAction = new TouchAction(this._driver);
        await swipeAction
            .press({ x: 1000, y: 330 })
            .wait(200)
            .moveTo({ x: 0, y: 330 })
            .release()
            .perform();
        await this._driver.sleep(1200);
    }

    async swipeDown() {
        this.checkIsCancel();
        const swipeAction = new TouchAction(this._driver);
        await swipeAction.press({ x: 200, y: 640 });
        await swipeAction.wait(500);
        await swipeAction.moveTo({ x: 200, y: 200 });
        await swipeAction.release();
        await swipeAction.perform();
        await this._driver.sleep(1200);
    }

    async swipeUp() {
        this.checkIsCancel();
        const swipeAction = new TouchAction(this._driver);
        await swipeAction.press({ x: 200, y: 350 });
        await swipeAction.wait(500);
        await swipeAction.moveTo({ x: 200, y: 840 });
        await swipeAction.release();
        await swipeAction.perform();
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
}

module.exports = ActionAndroid;
