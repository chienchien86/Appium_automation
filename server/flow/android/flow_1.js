const BaseFlow = require('../BaseFlow.js');
const beforLogin = require('./beforeLogin.js');
const login = require('./login.js');

// eslint-disable-next-line camelcase
class Flow_1 extends BaseFlow {
    async execUIFlow() {
        await beforLogin.execUIFlow(this._driver, this._action);
        await login.execUIFlow(this._driver, this._action);

        await this._action.saveScreenshot('Finish sign in');
        await this._action.swipeDown();
        await this._action.swipeDown();
        await this._action.saveScreenshot('Slide to the bottom');
        await this._action.swipeUp();
        await this._action.swipeUp();

        await this._action.clickByAccessibilityId('nav_icon');
        await this._action.saveScreenshot('Swipe out the menu drawer');

        await this._action.clickMenuElement(4);
        await this._action.saveScreenshot('Click on "Moments"');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        await this._action.clickByAccessibilityId('nav_icon');
        await this._action.saveScreenshot('Swipe out the menu drawer');

        await this._action.clickMenuElement(10);
        await this._action.saveScreenshot('Click on "About"');

        await this._action.sleep(2000);
        await this._action.clickByXpath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v7.widget.RecyclerView/android.widget.LinearLayout[2]/android.widget.LinearLayout/android.widget.LinearLayout');
        await this._action.saveScreenshot('Click on "Upgrade to Premium"');

        await this._action.clickByXpath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.RelativeLayout/android.webkit.WebView/android.webkit.WebView/android.view.View[5]/android.view.View[1]/android.widget.ListView/android.view.View[1]/android.view.View');
        await this._action.saveScreenshot('Click on "1 month"');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        await this._action.clickByAccessibilityId('nav_icon');
        await this._action.saveScreenshot('Swipe out the menu drawer');

        await this._action.clickMenuElement(1);
        await this._action.saveScreenshot('Click on "Get HD Quality"');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        await this._action.click('com.ivuu:id/text_view');
        await this._action.saveScreenshot('Click on "UPGRADE" on the top bar');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        await this._action.clickByAccessibilityId('nav_icon');
        await this._action.saveScreenshot('Swipe out the menu drawer');

        await this._action.clickMenuElement(2);
        await this._action.saveScreenshot('Click on "Ad-free for Life"');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key on the upper left corner');

        await this._action.click('com.ivuu:id/motion_detection');
        await this._action.saveScreenshot('Enter the Empty Event Book');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key');

        await this._action.click('com.ivuu:id/camera_setting');
        await this._action.saveScreenshot('Enter the Camera setting page');

        await this._action.clickByXpath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v7.widget.RecyclerView/android.widget.LinearLayout[4]/android.widget.LinearLayout');
        await this._action.sleep(3000);
        await this._action.saveScreenshot('Click on "Camera Health Check"');

        await this._action.swipeDown();
        await this._action.swipeDown();
        await this._action.saveScreenshot('Slide to the bottom');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key');

        await this._action.clickByXpath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v7.widget.RecyclerView/android.widget.LinearLayout[5]/android.widget.LinearLayout');
        await this._action.saveScreenshot('Click on "Trust Circle"');

        await this._action.click('com.ivuu:id/layout_trust_circle');
        await this._action.saveScreenshot('Click on "Add account"');

        await this._action.click('android:id/button2');
        await this._action.saveScreenshot('Click on "CANCEL"');

        await this._action.clickBackArrow();
        await this._action.saveScreenshot('Click on the back key');

        await this._action.swipeDown();
        await this._action.clickByXpath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.support.v7.widget.RecyclerView/android.widget.LinearLayout[7]/android.widget.LinearLayout/android.widget.RelativeLayout/android.widget.TextView[2]');
        await this._action.saveScreenshot('Click on "Schedule"');

        await this._action.clickByXpath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout[1]');
        await this._action.saveScreenshot('Click on "Apply the schedule to"');

        await this._action.click('android:id/button1');
        await this._action.saveScreenshot('Click on "UPGRADE"');
    }
}

// eslint-disable-next-line camelcase
module.exports = Flow_1;
