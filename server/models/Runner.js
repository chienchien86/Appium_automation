const Report = require('./Report.js');
const Capability = require('./Capability.js');
const AppiumScheduler = require('./AppiumScheduler.js');
const FlowManager = require('./FlowManager.js');

class Runner {
    constructor(versionName, realDevice, platform) {
        this._tasks = []; // {capability: {} , flow_name: ''}
        this._report = new Report(new Date(), versionName, platform);
        this._version_name = versionName;
        this._real_device = realDevice;
        this._platform = platform;
    }

    addOne(deviceName, language, flowName) {
        const capability = Capability.getOne(
            deviceName, language, this._version_name, this._real_device, this._platform,
        );
        this._tasks.push(JSON.parse(JSON.stringify({ // deep copy
            capability,
            flow_name: flowName,
        })));
    }

    addAll() {
        let caps;
        if (this._real_device === true) {
            caps = Capability.getRealDeviceAll(this._version_name, this._platform);
        } else {
            caps = Capability.getEmulatorAll(this._version_name, this._platform);
        }
        const flowNames = FlowManager.getAllFlowNames(this._platform);
        caps.forEach((cap) => {
            flowNames.forEach((flowName) => {
                this._tasks.push({
                    capability: cap,
                    flow_name: flowName,
                });
            });
        });
    }

    get tasks() { return this._tasks; }

    async run() {
        const flowList = [];
        this._tasks.forEach((task) => {
            const flowPath = `${__dirname}/../flow/${this._platform}/${task.flow_name}.js`;
            // eslint-disable-next-line
            const Flow = require(flowPath);
            const flow = new Flow(task.capability, task.flow_name, this._report, this._platform);
            flowList.push(flow);
        });
        const appiumScheduler = AppiumScheduler.instance;
        appiumScheduler.addNewJob(this._report, this._version_name, flowList);
    }
}

module.exports = Runner;
