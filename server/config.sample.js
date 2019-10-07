const config = {
    // Server & DB config
    API_SERVER_PORT: 3000,
    MONGO_URL: '',
    MONGO_DATABASE_NAME: 'appium-autotest',
    COLLECTION_NAME_REPORT: 'report',

    // Appium Config
    PLATFORM_IOS: 'iOS',
    PLATFORM_ANDROID: 'android',
    appium_host: 'localhost',
    appium_port: 4723,
    languageLocaleList: [
        { language: 'ko', androidLocale: 'KR' },
        { language: 'en', androidLocale: 'US' },
        { language: 'pt', androidLocale: 'PT' },
        { language: 'es', androidLocale: 'ES' },
        { language: 'ja', androidLocale: 'JP' },
    ],
    iOSEmulatorList: [{ name: 'iPhone 6s' }, { name: 'iPhone X' }, { name: 'iPhone 6s Plus' }],
    androidEmulatorList: [{ name: 'Pixel_2_XL_API_28', platformVersion: '9' }],
    androidRealDeviceList: [
        { name: 'oppa', udid: '', platformVersion: '8' },
        { name: 'Samsung SM-N9208', udid: '', platformVersion: '7' },
    ],
    iOSRealDeviceList: [
        { name: '', udid: '' },
    ],
    appiumiOSCapability: {
        xcodeOrgId: 'XX5TS5R8N7',
        xcodeSigningId: 'iPhone Developer',
        platformName: 'iOS',
        platformVersion: '12.2',
        automationName: 'XCUITest',
        useNewWDA: true,
        updatedWDABundleId: 'XX5TS5R8N7.webdriverproxy',
        waitForQuiescence: false,
        startIWDP: true,
        clearSystemFiles: true,
    },

    appiumAndroidCapability: {
        platformName: 'Android',
        automationName: 'Uiautomator2',
        uiautomator2ServerInstallTimeout: 60000,
        newCommandTimeout: 60,
        adbExecTimeout: 60000,
        appWaitActivity: 'ViewpagerActivity', // the tutorial page, because waiting from Branding Activity is not stable
        clearSystemFiles: true,
        noReset: false,
        fullReset: true,
    },

    login_name: 'Q34 Lin',
    login_email: '',
    login_password: '',
    slack_bot_url: '',
};

if (process.env.NODE_ENV === 'development') {
    config.MONGO_URL = 'mongodb://localhost:27017/appium-autotest';
}

module.exports = config;
