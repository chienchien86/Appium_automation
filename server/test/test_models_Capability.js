const chai = require('chai');
const chaiAsPromise = require('chai-as-promised');
const config = require('../config.js');
const Capability = require('../models/Capability.js');

const { expect } = chai;
chai.use(chaiAsPromise);


const { iOSEmulatorList, languageLocaleList, iOSRealDeviceList } = config;
const { appiumiOSCapability } = config;
const versionName = '2.2.0 build 1120';


describe('models/Capability.js', () => {
    it('#getOne / emulator iOS / device did not exist', () => {
        expect(() => Capability.getOne('iPhone 7', 'cs', versionName, false, 'iOS')).to.throw(Error);
    });

    it('#getOne / emulator iOS / language did not exist', () => {
        expect(() => Capability.getOne('iPhone 6s', 'ca', versionName, false, 'iOS')).to.throw(Error);
    });

    it('#getOne / real device iOS / device did not exist', () => {
        expect(() => Capability.getOne('iPhone 6s', 'en', versionName, true, 'iOS')).to.throw(Error);
    });

    it('#getOne / real device iOS / language did not exist', () => {
        expect(() => Capability.getOne('Alfred\'s 6s plus', 'ca', versionName, true, 'iOS')).to.throw(Error);
    });

    it('#getOne / OK , emulator iOS', () => {
        const result = Capability.getOne('iPhone 6s', 'en', versionName, false, 'iOS');
        expect(result.platformName).to.equal(appiumiOSCapability.platformName);
        expect(result.deviceName).to.equal('iPhone 6s');
        expect(result.language).to.equal('en');
        expect(result.app).to.equal(`${process.cwd()}/models/../appbinary/${versionName}.app`);
    });

    it('#getOne / OK , real_device iOS', () => {
        const result = Capability.getOne('Alfred\'s 6s plus', 'ja', versionName, true, 'iOS');
        expect(result.platformName).to.equal(appiumiOSCapability.platformName);
        expect(result.deviceName).to.equal('Alfred\'s 6s plus');
        expect(result.udid).to.equal('d3e85afde3ec5baa70ac7a9999a3b060bc922e0f');
        expect(result.language).to.equal('ja');
        expect(result.app).to.equal(`${process.cwd()}/models/../appbinary/${versionName}.ipa`);
    });

    it('#getOneiOSRealDevice / OK', () => {
        const result = Capability.getOneiOSRealDevice('Alfred\'s 6s plus', 'ja', versionName);
        expect(result.platformName).to.equal(appiumiOSCapability.platformName);
        expect(result.deviceName).to.equal('Alfred\'s 6s plus');
        expect(result.udid).to.equal('d3e85afde3ec5baa70ac7a9999a3b060bc922e0f');
        expect(result.language).to.equal('ja');
        expect(result.app).to.equal(`${process.cwd()}/models/../appbinary/${versionName}.ipa`);
    });

    it('#getOneiOSEmulator / OK', () => {
        const result = Capability.getOneiOSEmulator('iPhone X', 'en', versionName);
        expect(result.platformName).to.equal(appiumiOSCapability.platformName);
        expect(result.deviceName).to.equal('iPhone X');
        expect(result.language).to.equal('en');
        expect(result.app).to.equal(`${process.cwd()}/models/../appbinary/${versionName}.app`);
    });

    it('#getOneAndroidRealDevice / OK', () => {
        // TODO:
    });

    it('#getOneAndroidEmulator / OK', () => {
        // TODO:
    });

    it('#getEmulatorAll / iOS / OK', () => {
        const result = Capability.getEmulatorAll(versionName, 'iOS');
        expect(result).to.have.lengthOf(iOSEmulatorList.length * languageLocaleList.length);
        for (let i = 0; i < result.length; i += 1) {
            expect(result[i].deviceName).to.equal(
                iOSEmulatorList[Math.floor((i) / languageLocaleList.length)].name,
            );
            expect(result[i].language).to.equal(
                languageLocaleList[i % languageLocaleList.length].language,
            );
        }
    });

    it('#getRealDeviceAll / iOS / OK', () => {
        const result = Capability.getRealDeviceAll(versionName, 'iOS');
        expect(result).to.have.lengthOf(iOSRealDeviceList.length * languageLocaleList.length);
        for (let i = 0; i < result.length; i += 1) {
            expect(result[i].deviceName).to.equal(
                iOSRealDeviceList[Math.floor((i) / languageLocaleList.length)].name,
            );
            expect(result[i].language).to.equal(
                languageLocaleList[i % languageLocaleList.length].language,
            );
            expect(result[i].udid).to.equal(
                iOSRealDeviceList[Math.floor((i) / languageLocaleList.length)].udid,
            );
        }
    });
});
