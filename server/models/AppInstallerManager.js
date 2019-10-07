const fs = require('fs');
const util = require('util');

const exec = util.promisify(require('child_process').exec);
const { PLATFORM_IOS, PLATFORM_ANDROID } = require('../config');

class AppInstallerManager {
    static getAvailableVersions() {
        const fileNames = fs.readdirSync(`${__dirname}/../appbinary/`);
        const versions = [];
        fileNames.forEach((fileName) => {
            if (fileName !== '.DS_Store' && fileName !== '.gitignore') {
                if (fileName.substring(fileName.length - 4, fileName.length) === '.app') {
                    versions.push({
                        name: fileName.substring(0, fileName.length - 4),
                        type: 'emulator',
                        platform: PLATFORM_IOS,
                    });
                } else if (fileName.substring(fileName.length - 4, fileName.length) === '.ipa') {
                    versions.push({
                        name: fileName.substring(0, fileName.length - 4),
                        type: 'real device',
                        platform: PLATFORM_IOS,
                    });
                } else if (fileName.substring(fileName.length - 4, fileName.length) === '.apk') {
                    versions.push({
                        name: fileName.substring(0, fileName.length - 4),
                        type: 'emulator',
                        platform: PLATFORM_ANDROID,
                    });
                    versions.push({
                        name: fileName.substring(0, fileName.length - 4),
                        type: 'real device',
                        platform: PLATFORM_ANDROID,
                    });
                }
            }
        });
        return versions;
    }

    static isVersionExist(versionName, realDevice, platform) {
        if (realDevice === true && platform === PLATFORM_IOS) {
            return fs.existsSync(`${__dirname}/../appbinary/${versionName}.ipa`);
        }
        if (realDevice === false && platform === PLATFORM_IOS) {
            return fs.existsSync(`${__dirname}/../appbinary/${versionName}.app`);
        }
        if (platform === PLATFORM_ANDROID) {
            return fs.existsSync(`${__dirname}/../appbinary/${versionName}.apk`);
        }
        return false;
    }

    static async deleteIfExist(versionName, realDevice, platform) {
        if (realDevice && platform === PLATFORM_IOS && fs.existsSync(`${__dirname}/../appbinary/${versionName}.ipa`)) {
            await exec(`rm -r ${__dirname}/../appbinary/${versionName}.ipa`, { maxBuffer: 1024 * 500 });
        } else if (!realDevice && platform === PLATFORM_IOS && fs.existsSync(`${__dirname}/../appbinary/${versionName}.app`)) {
            await exec(`rm -r ${__dirname}/../appbinary/${versionName}.app`, { maxBuffer: 1024 * 500 });
        } else if (platform === PLATFORM_ANDROID && fs.existsSync(`${__dirname}/../appbinary/${versionName}.apk`)) {
            await exec(`rm -r ${__dirname}/../appbinary/${versionName}.apk`, { maxBuffer: 1024 * 500 });
        }
    }
}

module.exports = AppInstallerManager;
