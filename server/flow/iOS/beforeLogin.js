async function execUIFlow(driver, action) {
    await action.sleep(3000);
    await action.saveScreenshot('Launch the app');
    await action.sleep(3000);
    await action.swipeLeft();
    await action.saveScreenshot('Swipe left1');
    await action.swipeLeft();
    await action.saveScreenshot('Swipe left2');
    await action.swipeLeft();
    await action.saveScreenshot('Swipe left3');
    await action.swipeLeft();
    await action.saveScreenshot('Swipe left4');
    await action.click('p2_button_start');
    await action.saveScreenshot('click on the CTA');
    await action.click('p3_button_camera');
    await action.saveScreenshot('click on the camera image');
    await action.click('p3_button_viewer');
    await action.saveScreenshot('click on the viewer image');
    await action.sleep(1000);
    await action.click('p1_button_start');
    await action.saveScreenshot('click on the CTA');
    await action.sleep(2000);
}

exports.execUIFlow = execUIFlow;
