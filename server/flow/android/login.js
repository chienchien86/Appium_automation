async function execUIFlow(driver, action) {
    await action.click('com.ivuu:id/google_signin_btn');
    await action.saveScreenshot('Signin process');
    await driver.sleep(7000);

    // TODO: need to improved (now identify index of account)
    await action.clickByXpath('/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ListView/android.widget.LinearLayout[1]');
    await driver.sleep(5000);
}

exports.execUIFlow = execUIFlow;
