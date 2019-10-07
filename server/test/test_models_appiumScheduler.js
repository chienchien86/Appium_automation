const chai = require('chai');
const chaiAsPromise = require('chai-as-promised');
const AppiumScheduler = require('../models/AppiumScheduler.js');

const { expect } = chai;
chai.use(chaiAsPromise);

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}


class MockFlow {
    constructor(name, recorder) {
        this.name = name;
        this.recorder = recorder;
        this.isCancel = false;
    }

    async main() {
        await wait(100);
        if (this.isCancel) throw new Error('cancel flow');
        this.recorder.record(this.name);
    }

    cancel() {
        this.isCancel = true;
        this.recorder.record(`${this.name} cancel`);
    }
}

class MockReport {
    constructor(recorder) {
        this.name = 'report';
        this.recorder = recorder;
    }

    save() {
        this.recorder.record(this.name);
    }
}

class Recorder {
    constructor() {
        this.sequence = [];
    }

    record(name) {
        this.sequence.push(name);
    }
}

describe('AppiumScheduler', () => {
    it('#addNewJob', async () => {
        const flowList = [];
        const versionName = '2.2.2build1127';
        const recorder = new Recorder();
        const report = new MockReport(recorder);
        flowList.push(new MockFlow('flow_1', recorder));
        flowList.push(new MockFlow('flow_2', recorder));
        flowList.push(new MockFlow('flow_3', recorder));
        flowList.push(new MockFlow('flow_4', recorder));
        const appiumScheduler = AppiumScheduler.instance;
        appiumScheduler.addNewJob(report, versionName, flowList);
        await wait(500);
        expect(recorder.sequence[0]).to.equal('flow_1');
        expect(recorder.sequence[1]).to.equal('flow_2');
        expect(recorder.sequence[2]).to.equal('flow_3');
        expect(recorder.sequence[3]).to.equal('flow_4');
        expect(recorder.sequence[4]).to.equal('report');
        expect(appiumScheduler.jobs).to.have.lengthOf(0);
    });

    it('#cancelJob', async () => {
        const flowList = [];
        const versionName = '2.2.2build1127';
        const recorder = new Recorder();
        const report = new MockReport(recorder);
        flowList.push(new MockFlow('flow_1', recorder));
        flowList.push(new MockFlow('flow_2', recorder));
        flowList.push(new MockFlow('flow_3', recorder));
        flowList.push(new MockFlow('flow_4', recorder));
        const appiumScheduler = AppiumScheduler.instance;
        appiumScheduler.addNewJob(report, versionName, flowList);
        const { timestamp } = appiumScheduler.jobs[0];
        await wait(150);
        expect(recorder.sequence[0]).to.equal('flow_1');
        expect(recorder.sequence).to.have.lengthOf(1);
        expect(appiumScheduler.jobs).to.have.lengthOf(1);
        expect(appiumScheduler.jobs[0].flows).to.have.lengthOf(4);

        expect(appiumScheduler.jobs[0].flows[0].state).to.equal('finish');
        expect(appiumScheduler.jobs[0].flows[1].state).to.equal('running');
        expect(appiumScheduler.jobs[0].flows[2].state).to.equal('waiting');
        expect(appiumScheduler.jobs[0].flows[3].state).to.equal('waiting');
        appiumScheduler.cancelJob(timestamp);
        expect(appiumScheduler.jobs).to.have.lengthOf(0);
        expect(recorder.sequence).to.have.lengthOf(4);
        expect(recorder.sequence[1]).to.equal('flow_2 cancel');
        expect(recorder.sequence[2]).to.equal('flow_3 cancel');
        expect(recorder.sequence[3]).to.equal('flow_4 cancel');
    });
});
