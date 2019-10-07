/* eslint-disable no-await-in-loop */
const singleton = Symbol('singleton');
const singletonEnforcer = Symbol('singletonEnforcer');
const _ = require('lodash');
const AlarmSlack = require('./AlarmSlack.js');

class AppiumScheduler {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw new Error('Cannot construct singleton AppiumScheduler');
        }
        this._isAppiunRunning = false;
        this._workingQueue = [];
        this._finishQueue = [];
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new AppiumScheduler(singletonEnforcer);
        }
        return this[singleton];
    }

    addNewJob(report, versioName, flowList) {
        const timestamp = Date.now();
        flowList.forEach((flow) => {
            this._workingQueue.push({
                timestamp,
                report,
                flow,
                version_name: versioName,
            });
            if (!this._isAppiunRunning) {
                this.working();
            }
        });
    }

    cancelJob(timestamp) {
        const resultWorkingQueue = [];
        for (let i = 0; i < this._workingQueue.length; i += 1) {
            if (this._workingQueue[i].timestamp !== timestamp) {
                resultWorkingQueue.push(this._workingQueue[i]);
            } else {
                this._workingQueue[i].flow.cancel();
            }
        }
        _.remove(this._finishQueue, { timestamp });
        this._workingQueue = resultWorkingQueue;
    }

    async working() {
        this._isAppiunRunning = true;
        while (this._workingQueue.length !== 0) {
            try {
                await this._workingQueue[0].flow.main();
            } catch (error) {
                if (error.message !== 'cancel flow') {
                    throw error;
                }
            }
            const work = this._workingQueue.shift();
            if (work !== undefined) {
                this._finishQueue.push(work);
            }
            if (work !== undefined
                && _.find(this._workingQueue, { timestamp: work.timestamp }) === undefined) {
                _.remove(this._finishQueue, { timestamp: work.timestamp });
                await work.report.save();
                if (work.report.errorCount === 0) {
                    await AlarmSlack.success(work.report, work.flow.realdevice);
                } else {
                    await AlarmSlack.fail(work.report, work.flow.realdevice);
                }
            }
        }
        this._isAppiunRunning = false;
    }

    get jobs() {
        const result = [];
        this._finishQueue.forEach((item) => {
            const job = _.find(result, { timestamp: item.timestamp });
            if (job !== undefined) {
                job.flows.push({
                    name: item.flow.name,
                    device_name: item.flow.deviceName,
                    language: item.flow.language,
                    state: 'finish',
                });
            } else {
                result.push({
                    timestamp: item.timestamp,
                    version_name: item.version_name,
                    flows: [{
                        name: item.flow.name,
                        device_name: item.flow.deviceName,
                        language: item.flow.language,
                        state: 'finish',
                    }],
                });
            }
        });
        for (let i = 0; i < this._workingQueue.length; i += 1) {
            const item = this._workingQueue[i];
            const job = _.find(result, { timestamp: item.timestamp });
            if (job !== undefined && i === 0) {
                job.flows.push({
                    name: item.flow.name,
                    device_name: item.flow.deviceName,
                    language: item.flow.language,
                    state: 'running',
                });
            } else if (job !== undefined) {
                job.flows.push({
                    name: item.flow.name,
                    device_name: item.flow.deviceName,
                    language: item.flow.language,
                    state: 'waiting',
                });
            } else if (job === undefined && i === 0) {
                result.push({
                    timestamp: item.timestamp,
                    version_name: item.version_name,
                    flows: [{
                        name: item.flow.name,
                        device_name: item.flow.deviceName,
                        language: item.flow.language,
                        state: 'running',
                    }],
                });
            } else {
                result.push({
                    timestamp: item.timestamp,
                    version_name: item.version_name,
                    flows: [{
                        name: item.flow.name,
                        device_name: item.flow.deviceName,
                        language: item.flow.language,
                        state: 'waiting',
                    }],
                });
            }
        }
        return result;
    }
}

module.exports = AppiumScheduler;
