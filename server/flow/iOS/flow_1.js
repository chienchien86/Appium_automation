const BaseFlow = require('../BaseFlow.js');
const beforeLogin = require('../iOS/beforeLogin.js');
const login = require('../iOS/login.js');

// eslint-disable-next-line camelcase
class Flow_1 extends BaseFlow {
    async execUIFlow() {
        await beforeLogin.execUIFlow(this._driver, this._action);
        await login.execUIFlow(this._driver, this._action);
        await this._action.saveScreenshot('Finish login');

        // slide to the bottom
        await this._action.execute('down');
        await this._action.saveScreenshot('Smart cells');
        await this._action.execute('up');

        // swipe to the menu drawer
        // click on "Moments"
        // click on the back key on the upper left coner
        await this._action.click('cameraList_page_menuBtn');
        await this._action.saveScreenshot('Swipe out the menu drawer');

        await this._action.clickMenuElement('menu_cell', '2');
        await this._action.waitElementdisplay('ic_empty_moment');
        await this._action.saveScreenshot('Click on "Moments"');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');
        // swipe out the menu drawer
        // click on "About"
        // click on "upgrade to premium"
        // click on "1 month"
        // slide to the buttton
        // slide to the top
        // click on the back key on the upper left coner
        await this._action.click('cameraList_page_menuBtn');
        await this._action.saveScreenshot('Swipe out the menu drawer');

        await this._action.clickMenuElement('menu_cell', '7');
        await this._action.waitElementdisplay('about_page_promotion_cell');
        await this._action.saveScreenshot('Click on "About"');

        await this._action.click('about_page_promotion_cell');
        await this._action.saveScreenshot('Click on "Upgrade to Premium"');

        await this._action.waitElementdisplay('12');
        await this._action.click('1');
        await this._action.saveScreenshot('Click on "1 month"');

        await this._action.execute('down');
        await this._action.saveScreenshot('Slide to the bottom');

        await this._action.execute('up');
        await this._action.saveScreenshot('Slide to the top');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        // swipe out the menu drawer
        // click on "Get HD Quality"
        // click on the back key on the upper left coner
        await this._action.click('cameraList_page_menuBtn');
        await this._action.saveScreenshot('Swipe out the menu drawer');

        await this._action.clickMenuElement('menu_cell_new', '0');

        await this._action.waitElementdisplay('12');
        await this._action.saveScreenshot('Click on "Get HD Quality"');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        // click on "UPGRADE" on the top bar
        // click on the back key on the upper left coner

        await this._action.click('cameraList_page_upgradeBtn');
        await this._action.waitElementdisplay('12');
        await this._action.saveScreenshot('Click on "UPGRADE" on the top bar');
        // await this._action.sleep(1000);
        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');


        // swipe out the menu drawer
        // click on "Ad-free for life"
        // click on the back key on the upper left coner
        await this._action.click('cameraList_page_menuBtn');
        await this._action.saveScreenshot('Swipe out the menu drawer');

        await this._action.clickMenuElement('menu_cell', '0');
        await this._action.saveScreenshot('Click on "Ad-free for Life"');
        // await this._action.waitElementdisplay(`ic_signin_valid`)
        await this._action.sleep(2000);
        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        // Enter the Empty Event Book
        // click on the back key on the upper left coner
        await this._action.click('md viewer icon');
        await this._action.sleep(2000);
        await this._action.saveScreenshot('Enter the Empty Event Book');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key');

        // Enter the Camera setting page
        // click on "Camera Health Check"
        // slide to the button
        // click on the back key on the upper left coner
        // click on "Trust Circle"
        // click on "Add account"
        // click on the back key
        // click on the back key
        // click on the "Schedule"

        await this._action.click('cameraList_btn_gear');
        await this._action.saveScreenshot('Enter the Camera setting page');

        await this._action.click('p7_cell_health');
        await this._action.sleep(5000);
        await this._action.saveScreenshot('Click on "Camera Health Check"');

        await this._action.execute('down');
        await this._action.saveScreenshot('Slide to the bottom');

        await this._action.execute('up');
        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key');

        await this._action.click('p7_cell_trust');
        await this._action.saveScreenshot('Click on "Trust Circle"');

        await this._action.click('cell_add_account');
        await this._action.saveScreenshot('Click on "Add account"');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key');

        await this._action.execute('down');
        await this._action.sleep(2000);
        try {
            await this._action.click('p7_cell_schedule');
            await this._action.click('p7_cell_schedule');
            await this._action.saveScreenshot('Click on "Schedule"');
        } catch (e) {
            await this._action.saveScreenshot('Click on "Schedule"');
        }

        await this._action.click('p8_cell_scheduleTo');
        await this._action.saveScreenshot('Click on "Apply the schedule to"');

        await this._action.acceptAlert();
        await this._action.waitElementdisplay('12');
        await this._action.saveScreenshot('Click on "UPGRADE"');
    }
}

// eslint-disable-next-line camelcase
module.exports = Flow_1;
