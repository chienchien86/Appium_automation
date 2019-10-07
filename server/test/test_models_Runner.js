const chai = require('chai');
const chaiAsPromise = require('chai-as-promised');
const config = require('../config.js');
const Runner = require('../models/Runner.js');
const FlowManager = require('../models/FlowManager.js');

const { expect } = chai;
chai.use(chaiAsPromise);
const versionName = '2.2.2 build 1120';
const { iOSEmulatorList, languageLocaleList, iOSRealDeviceList } = config;

describe('models/Runner.js', () => {
    it('#addAll / emulator iOS / OK', () => {
        const runner = new Runner(versionName, false, 'iOS');
        runner.addAll();
        const flowNames = FlowManager.getAllFlowNames('iOS');
        expect(runner.tasks).to.have.lengthOf(
            iOSEmulatorList.length * languageLocaleList.length * flowNames.length,
        );
    });

    it('#addAll / real device iOS / OK', () => {
        const runner = new Runner(versionName, true, 'iOS');
        runner.addAll();
        const flowNames = FlowManager.getAllFlowNames('iOS');
        expect(runner.tasks).to.have.lengthOf(
            iOSRealDeviceList.length * languageLocaleList.length * flowNames.length,
        );
    });

    it('#addOne / language did not exist', () => {
        const runner = new Runner(versionName, false, 'iOS');
        const flowNames = FlowManager.getAllFlowNames('iOS');
        expect(() => { runner.addOne('iPhone 6s', 'er', flowNames[0]); }).to.throw(Error);
    });

    it('#addOne / emulator iOS , device name did not exist', () => {
        const runner = new Runner(versionName, false, 'iOS');
        const flowNames = FlowManager.getAllFlowNames('iOS');
        expect(() => { runner.addOne('iPhone 5', 'en', flowNames[0]); }).to.throw(Error);
    });

    it('#addOne / real device iOS , name did not exist', () => {
        const runner = new Runner(versionName, true, 'iOS');
        const flowNames = FlowManager.getAllFlowNames('iOS');
        expect(() => { runner.addOne('iPhone 6s', 'en', flowNames[0]); }).to.throw(Error);
    });

    it('#addOne / emulator iOS / OK', () => {
        const runner = new Runner(versionName, false, 'iOS');
        const flowNames = FlowManager.getAllFlowNames('iOS');
        runner.addOne('iPhone 6s', 'en', flowNames[0]);
        const { tasks } = runner;
        expect(tasks).to.have.lengthOf(1);
        expect(tasks[0].flow_name).to.equal(flowNames[0]);
        expect(tasks[0].capability.deviceName).to.equal('iPhone 6s');
        expect(tasks[0].capability.language).to.equal('en');
    });
});
