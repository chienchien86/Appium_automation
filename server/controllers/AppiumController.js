const childProcess = require('child_process');
const util = require('util');
const fs = require('fs');
const config = require('../config.js');

const Runner = require('../models/Runner.js');
const Report = require('../models/Report.js');
const ErrorHandleController = require('../controllers/ErrorHandleController.js');
const AppInstallerManager = require('../models/AppInstallerManager.js');
const AppiumScheduler = require('../models/AppiumScheduler.js');
const FlowManager = require('../models/FlowManager.js');

const exec = util.promisify(childProcess.exec);
const { iOSEmulatorList, iOSRealDeviceList, languageLocaleList } = config;
const { androidEmulatorList, androidRealDeviceList } = config;

module.exports = {

    getRunningJobs(req, res) {
        const appiumScheduler = AppiumScheduler.instance;
        res.status(200).send({ status: true, jobs: appiumScheduler.jobs });
    },

    getAvailable(req, res) {
        const result = {
            ios_emulators: iOSEmulatorList.map(e => e.name),
            android_emulators: androidEmulatorList.map(e => e.name),
            ios_real_devices: iOSRealDeviceList.map(e => e.name),
            android_real_devices: androidRealDeviceList.map(e => e.name),
            languages: languageLocaleList.map(ele => ele.language),
        };
        result.versions = AppInstallerManager.getAvailableVersions();
        result.ios_flow_names = FlowManager.getAllFlowNames('iOS');
        result.android_flow_names = FlowManager.getAllFlowNames('android');
        res.status(200).send({ status: true, available: result });
    },

    async deleteVersion(req, res) {
        if (ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'version_name')
            || ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'real_device')
            || ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'platform')
            || ErrorHandleController.checkPostBodyIsBooleanAndSendError(req, res, 'real_device')) {
            return;
        }
        const versionName = req.body.version_name;
        const { platform } = req.body;
        const realDevice = JSON.parse(req.body.real_device);
        await AppInstallerManager.deleteIfExist(versionName, realDevice, platform);
        res.status(200).send({ status: true });
    },

    async cancelRun(req, res) {
        if (ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'timestamp')) {
            return;
        }
        await AppiumScheduler.instance.cancelJob(parseInt(req.body.timestamp, 10));
        res.status(200).send({ status: true });
    },

    async runAllDeviceLanguageByAbsolutePath(req, res) {
        if (ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'version_name')
            || ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'real_device')
            || ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'file_path')
            || ErrorHandleController.checkPostBodyIsBooleanAndSendError(req, res, 'real_device')
            || ErrorHandleController.checkPostBodyFilePathExistAndSendError(req, res, 'file_path')
            || ErrorHandleController.checkPostBodyFilePathDoNotHaveSpaceChar(req, res, 'file_path')) {
            return;
        }
        const versionName = req.body.version_name;
        const realDevice = JSON.parse(req.body.real_device);
        const filePath = req.body.file_path;
        const startTime = Date.now();

        try {
            await AppInstallerManager.deleteIfExist(versionName, realDevice);
            const tmpDirPath = `${__dirname}/../appbinary/tmp${startTime}`;
            fs.copyFileSync(filePath, `${__dirname}/../appbinary/${startTime}.zip`);
            await exec(`mkdir -p ${tmpDirPath}`, { maxBuffer: 1024 * 500 });
            await exec(`unzip ${__dirname}/../appbinary/${startTime}.zip -d ${tmpDirPath}`, { maxBuffer: 1024 * 500 });
            const binaryFileName = fs.readdirSync(`${__dirname}/../appbinary/tmp${startTime}`)[0];
            if (!realDevice) {
                await exec(`mv ${tmpDirPath}/${binaryFileName} ${__dirname}/../appbinary/${versionName}.app`, { maxBuffer: 1024 * 500 });
            } else {
                await exec(`mv ${tmpDirPath}/${binaryFileName} ${__dirname}/../appbinary/${versionName}-realdevice.app`, { maxBuffer: 1024 * 500 });
                await exec(`rm -rf ${__dirname}/../appbinary/Payload`, { maxBuffer: 1024 * 500 });
                await exec(`mkdir ${__dirname}/../appbinary/Payload`, { maxBuffer: 1024 * 500 });
                await exec(`mv ${__dirname}/../appbinary/${versionName}-realdevice.app ${__dirname}/../appbinary/Payload/${versionName}-realdevice.app`, { maxBuffer: 1024 * 500 });
                await exec(`cd appbinary && zip -r ${versionName}.ipa ./Payload`, { maxBuffer: 1024 * 500 });
            }
            await exec(`rm -rf ${tmpDirPath}`, { maxBuffer: 1024 * 500 });
            await exec(`rm -rf ${__dirname}/../appbinary/${startTime}.zip`, { maxBuffer: 1024 * 500 });
            await exec(`rm -rf ${__dirname}/../appbinary/Payload`, { maxBuffer: 1024 * 500 });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: true, error: `something error, file should be an .zip format : ${error.toString()}` });
            return;
        }
        const runner = new Runner(versionName, realDevice);
        runner.addAll();
        runner.run();
        res.status(200).send({ status: true });
    },

    async runSpecific(req, res) {
        if (ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'jobs')
            || ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'version_name')
            || ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'real_device')
            || ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'platform')
            || ErrorHandleController.checkPostBodyIsArrayAndSendError(req, res, 'jobs')) {
            return;
        }
        if (req.body.jobs.length === 0) {
            res.status(400).send({ status: false, error: 'post body field jobs canot be empty array' });
            return;
        }
        for (let i = 0; i < req.body.jobs.length; i += 1) {
            if (req.body.jobs[i].flow_name === undefined
                || req.body.jobs[i].language === undefined
                || req.body.jobs[i].device_name === undefined) {
                res.status(400).send({ status: false, error: "post body field 'jobs' format error" });
                return;
            }
        }
        const realDevice = JSON.parse(req.body.real_device);
        const runner = new Runner(req.body.version_name, realDevice, req.body.platform);
        try {
            req.body.jobs.forEach((job) => {
                runner.addOne(job.device_name, job.language, job.flow_name);
            });
        } catch (error) {
            res.status(400).send({ status: false, error: error.toString() });
            return;
        }
        runner.run();
        res.status(200).send({ status: true });
    },

    async runFailDeviceLanguage(req, res) {
        const versionName = req.body.version_name;
        const { time } = req.body;
        const realDevice = req.body.real_device;
        if (ErrorHandleController.checkPostBodyDateTypeValid(req, res, 'time')
            || ErrorHandleController.checkPostBodyIsBooleanAndSendError(req, res, 'real_device')) {
            return;
        }

        const report = await Report.findOne(new Date(time));
        if (!report) {
            res.status(400).send({ status: false, error: 'cannot find this report' });
            return;
        }
        if (!AppInstallerManager.isVersionExist(versionName, realDevice, report.platform)) {
            res.status(400).send({ status: false, error: 'version_name did not exist, may choose wrong platform or real_device' });
            return;
        }
        const runner = new Runner(versionName, JSON.parse(realDevice), report.platform);
        try {
            report.flows.forEach((flow) => {
                if (flow.manual_error === true) {
                    runner.addOne(flow.device, flow.language, flow.name);
                } else {
                    for (let i = 0; i < flow.actions.length; i += 1) {
                        if (flow.actions[i].error === true) {
                            runner.addOne(flow.device, flow.language, flow.name);
                            break;
                        }
                    }
                }
            });
        } catch (error) {
            res.status(400).send({ status: false, error: error.toString() });
            return;
        }
        if (runner.tasks.length === 0) {
            res.status(200).send({ status: false, error: 'this report did not have any fail case' });
            return;
        }
        runner.run();
        res.status(200).send({ status: true });
    },

    async uploadBinary(req, res) {
        if (ErrorHandleController.checkQueryExistAndSendError(req, res, 'version_name')
        || ErrorHandleController.checkQueryExistAndSendError(req, res, 'real_device')
        || ErrorHandleController.checkQueryExistAndSendError(req, res, 'platform')
        || ErrorHandleController.checkQueryIsBooleanAndSendError(req, res, 'real_device')) {
            return;
        }
        const fileContent = req.file.buffer;
        const versionName = req.query.version_name;
        const realDevice = JSON.parse(req.query.real_device);
        const { platform } = req.query;
        try {
            if (platform === 'iOS' && realDevice === true) {
                fs.writeFileSync(`${__dirname}/../appbinary/${versionName}.ipa`, fileContent);
            } else if (platform === 'iOS' && realDevice === false) {
                fs.writeFileSync(`${__dirname}/../appbinary/${versionName}.zip`, fileContent);
                const startTime = Date.now();
                const tmpDirPath = `${__dirname}/../appbinary/tmp${startTime}`;
                await exec(`mkdir -p ${tmpDirPath}`, { maxBuffer: 1024 * 500 });
                await exec(`unzip ${__dirname}/../appbinary/${versionName}.zip -d ${tmpDirPath}`, { maxBuffer: 1024 * 500 });
                const binaryFileName = fs.readdirSync(`${__dirname}/../appbinary/tmp${startTime}`)[0];
                await exec(`mv ${tmpDirPath}/${binaryFileName} ${__dirname}/../appbinary/${versionName}.app`, { maxBuffer: 1024 * 500 });
                await exec(`rm -rf ${tmpDirPath}`, { maxBuffer: 1024 * 500 });
                await exec(`rm -rf ${__dirname}/../appbinary/${versionName}.zip`, { maxBuffer: 1024 * 500 });
            } else if (platform === 'android') {
                fs.writeFileSync(`${__dirname}/../appbinary/${versionName}.apk`, fileContent);
            } else {
                res.status(400).send({ status: false, error: 'platform should be "iOS" or "android", real_device should be boolean type' });
            }
            res.status(200).send({ status: true });
        } catch (error) {
            res.status(500).send({ status: false, error: `something error, file should be .zip file and can not contain space:${error.toString()}` });
        }
    },
};
