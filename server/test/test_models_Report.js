const chai = require('chai');
const chaiAsPromise = require('chai-as-promised');
const Report = require('../models/Report.js');
const config = require('../config.js');

const { expect } = chai;
chai.use(chaiAsPromise);


describe('models/Report.js', () => {
    it('#addAction / OK', () => {
        const time = new Date();
        const report = new Report(time, '2.2.2build1127', config.PLATFORM_IOS);
        report.addAction('flow_name1', 'device1', 'language1', 'action_name1', 'image_name1', false, false);
        report.addAction('flow_name1', 'device1', 'language1', 'action_name2', 'image_name2', false, false);
        report.addAction('flow_name1', 'device1', 'language1', 'action_name3', 'image_name3', true, false);
        report.addAction('flow_name2', 'device2', 'language2', 'action_name1', 'image_name4', false, false);
        report.addAction('flow_name3', 'device2', 'language2', 'action_name2', 'image_name5', false, false);
        expect(report.errorCount).to.equal(1);
        expect(report.flows).to.have.lengthOf(3);
        expect(report.flows[0].name).to.equal('flow_name1');
        expect(report.flows[1].name).to.equal('flow_name2');
        expect(report.flows[2].name).to.equal('flow_name3');
        expect(report.flows[0].device).to.equal('device1');
        expect(report.flows[1].device).to.equal('device2');
        expect(report.flows[2].device).to.equal('device2');
        expect(report.flows[0].language).to.equal('language1');
        expect(report.flows[1].language).to.equal('language2');
        expect(report.flows[2].language).to.equal('language2');
        expect(report.flows[0].real_device).to.equal(false);
        expect(report.flows[0].real_device).to.equal(false);
        expect(report.flows[0].real_device).to.equal(false);
        expect(report.flows[0].actions).to.have.lengthOf(3);
        expect(report.flows[1].actions).to.have.lengthOf(1);
        expect(report.flows[2].actions).to.have.lengthOf(1);
    });

    it('#findOne / OK', async () => {
        const time = new Date();
        const report = new Report(time, '2.2.2build1127', config.PLATFORM_IOS);
        report.addAction('flow_name1', 'device1', 'language1', 'action_name1', 'image_name1', false, false);
        report.addAction('flow_name1', 'device1', 'language1', 'action_name2', 'image_name2', false, false);
        report.addAction('flow_name1', 'device1', 'language1', 'action_name3', 'image_name3', true, false);
        await report.save();
        const result = await Report.findOne(time);
        expect(result.version_name).to.equal('2.2.2build1127');
        expect(result.flows).to.have.lengthOf(1);
        expect(result.flows[0].actions).to.have.lengthOf(3);
        expect(result.time.valueOf()).to.equal(time.valueOf());
    });

    it('#findFlowsByDeviceLanguage / OK', async () => {
        const time = new Date();
        const report = new Report(time, '2.2.2build1127', config.PLATFORM_IOS);
        report.addAction('flow_name1', 'device1', 'language1', 'action_name1', 'image_name1', false, false);
        report.addAction('flow_name1', 'device1', 'language1', 'action_name2', 'image_name2', false, false);
        report.addAction('flow_name2', 'device1', 'language1', 'action_name3', 'image_name3', true, false);
        await report.save();
        const result = await Report.findFlowsByDeviceLanguage(time, 'device1', 'language1');
        expect(result).to.have.lengthOf(2);
        expect(result[0].name).to.equal('flow_name1');
        expect(result[1].name).to.equal('flow_name2');
        expect(result[0].real_device).to.equal(false);
        expect(result[1].real_device).to.equal(false);
        expect(result[0].actions).to.have.lengthOf(2);
        expect(result[1].actions).to.have.lengthOf(1);
        expect(result[0].actions[0].name).to.equal('action_name1');
        expect(result[0].actions[1].name).to.equal('action_name2');
        expect(result[1].actions[0].name).to.equal('action_name3');
    });
});
