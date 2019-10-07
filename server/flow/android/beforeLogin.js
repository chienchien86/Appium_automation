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
    await action.click('com.ivuu:id/btn_try_it_out');
    await action.saveScreenshot('click on the CTA');
    await action.click('com.ivuu:id/cameraBtn');
    await action.saveScreenshot('click on the camera image');
    await action.click('com.ivuu:id/viewerBtn');
    await action.saveScreenshot('click on the viewer image');
    await action.sleep(1000);
    await action.click('com.ivuu:id/next');
    await action.saveScreenshot('click on the CTA');
    await action.sleep(2000);
}

exports.execUIFlow = execUIFlow;
