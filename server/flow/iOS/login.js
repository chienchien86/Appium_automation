const config = require('../../config.js');


async function execUIFlow(driver, action) {
    await action.click('p3_button_googleSign');
    await action.saveScreenshot('click on googlesign button');
    await driver.sleep(2000);
    await driver.acceptAlert();
    await action.saveScreenshot('click on Continue button');
    await driver.sleep(5000);
    await action.execute('down');
    await action.click(`${config.login_name} ${config.login_email}`);
    await action.saveScreenshot(`click ${config.login_name} ${config.login_email}`);
    await driver.sleep(5000);
    await driver.acceptAlert();
    await action.saveScreenshot('click allow');
}

exports.execUIFlow = execUIFlow;
