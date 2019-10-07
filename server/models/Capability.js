const _ = require('lodash');
const config = require('../config.js');

const { languageLocaleList } = config;
const { iOSEmulatorList, iOSRealDeviceList } = config;
const { androidEmulatorList, androidRealDeviceList } = config;
const { PLATFORM_IOS, PLATFORM_ANDROID } = config;

class Capability {
    static getOne(deviceName, language, versionName, realDevice, platform) {
        Capability.checkIsLanguageExist(language);
        Capability.checkIsPlatformLegal(platform);
        if (realDevice === false && platform === PLATFORM_IOS) {
            return Capability.getOneiOSEmulator(deviceName, language, versionName);
        }
        if (realDevice === true && platform === PLATFORM_IOS) {
            return Capability.getOneiOSRealDevice(deviceName, language, versionName);
        }
        if (realDevice === false && platform === PLATFORM_ANDROID) {
            return Capability.getOneAndroidEmulator(deviceName, language, versionName);
        }
        if (realDevice === true && platform === PLATFORM_ANDROID) {
            return Capability.getOneAndroidRealDevice(deviceName, language, versionName);
        }
        throw Error('platform or real device flag given not legal');
    }

    static getOneiOSRealDevice(deviceName, language, versionName) {
        const device = Capability.getDevice(deviceName, true, PLATFORM_IOS);
        const capability = JSON.parse(JSON.stringify(config.appiumiOSCapability));
        capability.app = `${__dirname}/../appbinary/${versionName}.ipa`;
        capability.deviceName = deviceName;
        capability.language = language;
        capability.udid = device.udid;
        return capability;
    }

    static getOneiOSEmulator(deviceName, language, versionName) {
        const device = Capability.getDevice(deviceName, false, PLATFORM_IOS);
        const capability = JSON.parse(JSON.stringify(config.appiumiOSCapability));
        delete capability.waitForQuiescence;
        delete capability.startIWDP;
        delete capability.xcodeOrgId;
        delete capability.xcodeSigningId;
        delete capability.updatedWDABundleId;
        capability.app = `${__dirname}/../appbinary/${versionName}.app`;
        capability.deviceName = device.name;
        capability.language = language;
        return capability;
    }

    static getOneAndroidRealDevice(deviceName, language, versionName) {
        const device = Capability.getDevice(deviceName, true, PLATFORM_ANDROID);
        const capability = JSON.parse(JSON.stringify(config.appiumAndroidCapability));
        capability.app = `${__dirname}/../appbinary/${versionName}.apk`;
        capability.deviceName = device.name;
        capability.platformVersion = device.platformVersion;
        capability.udid = device.udid;
        capability.language = language;
        capability.locale = _.find(languageLocaleList, { language }).androidLocale;
        return capability;
    }

    static getOneAndroidEmulator(deviceName, language, versionName) {
        const device = Capability.getDevice(deviceName, false, PLATFORM_ANDROID);
        const capability = JSON.parse(JSON.stringify(config.appiumAndroidCapability));
        capability.app = `${__dirname}/../appbinary/${versionName}.apk`;
        capability.deviceName = device.name; // cannot delete, because the report will catch this
        capability.avd = device.name; // only for android emulator
        capability.platformVersion = device.platformVersion;
        capability.language = language;
        capability.locale = _.find(languageLocaleList, { language }).androidLocale;
        return capability;
    }

    static checkIsLanguageExist(language) {
        if (!_.find(languageLocaleList, { language })) {
            throw new Error('language is not legal');
        }
    }

    static checkIsPlatformLegal(platform) {
        if (platform !== PLATFORM_IOS && platform !== PLATFORM_ANDROID) {
            throw new Error('platform not legal');
        }
    }

    static getDevice(deviceName, realDevice, platform) {
        Capability.checkIsPlatformLegal(platform);
        let deviceList;
        if (realDevice === true && platform === PLATFORM_ANDROID) {
            deviceList = androidRealDeviceList;
        } else if (realDevice === false && platform === PLATFORM_ANDROID) {
            deviceList = androidEmulatorList;
        } else if (realDevice === true && platform === PLATFORM_IOS) {
            deviceList = iOSRealDeviceList;
        } else if (realDevice === false && platform === PLATFORM_IOS) {
            deviceList = iOSEmulatorList;
        }
        const device = _.find(deviceList, { name: deviceName });
        if (device === undefined) {
            throw new Error(`device name "${deviceName}" is not legal`);
        }
        return device;
    }

    static getEmulatorAll(versionName, platform) {
        Capability.checkIsPlatformLegal(platform);
        let emulatorList;
        if (platform === PLATFORM_IOS) {
            emulatorList = iOSEmulatorList;
        } else if (platform === PLATFORM_ANDROID) {
            emulatorList = androidEmulatorList;
        }
        const result = [];
        emulatorList.forEach((emulator) => {
            languageLocaleList.forEach((languageLocale) => {
                result.push(
                    Capability.getOne(
                        emulator.name, languageLocale.language, versionName, false, PLATFORM_IOS,
                    ),
                );
            });
        });
        return result;
    }

    static getRealDeviceAll(versionName, platform) {
        Capability.checkIsPlatformLegal(platform);
        let realDeviceList;
        if (platform === PLATFORM_IOS) {
            realDeviceList = iOSRealDeviceList;
        } else if (platform === PLATFORM_ANDROID) {
            realDeviceList = androidRealDeviceList;
        }
        const result = [];
        realDeviceList.forEach((realdevice) => {
            languageLocaleList.forEach((languageLocale) => {
                result.push(
                    Capability.getOne(
                        realdevice.name, languageLocale.language, versionName, true, PLATFORM_IOS,
                    ),
                );
            });
        });
        return result;
    }
}
module.exports = Capability;
