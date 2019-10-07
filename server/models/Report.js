const _ = require('lodash');
const fs = require('fs');

const database = require('../database/database.js');
const config = require('../config.js');

class Report {
    constructor(time, versionName, platform) {
        this._time = time; // Date object
        this._version_name = versionName;
        this._flows = [];
        this._error_count = 0;
        this._platform = platform;
    }

    addAction(flowName, device, language, actionName, imageName, error, realDevice) {
        if (error) {
            this._error_count += 1;
        }
        let isAdd = false;
        this._flows.forEach((flow) => {
            if (flow.name === flowName && flow.device === device && flow.language === language) {
                flow.actions.push({ name: actionName, image_name: imageName, error });
                isAdd = true;
            }
        });
        if (!isAdd) {
            this._flows.push({
                name: flowName,
                device,
                language,
                real_device: realDevice,
                manual_error: false,
                actions: [
                    { name: actionName, image_name: imageName, error },
                ],
            });
        }
    }

    get time() { return this._time; }

    get flows() { return this._flows; }

    get versionName() { return this._version_name; }

    get errorCount() { return this._error_count; }

    get platform() { return this._platform; }

    async save() {
        const collection = await database.getCollection(config.COLLECTION_NAME_REPORT);
        await collection.insertOne({
            time: this._time,
            platform: this._platform,
            version_name: this._version_name,
            flows: this._flows,
            error: this._error_count,
        });
    }

    static async findOne(time) {
        const collection = await database.getCollection(config.COLLECTION_NAME_REPORT);
        try {
            const result = (await collection.find({ time }).toArray())[0];
            return result;
        } catch (error) {
            return null;
        }
    }

    static async findFlowsByDeviceLanguage(time, device, language) {
        const collection = await database.getCollection(config.COLLECTION_NAME_REPORT);
        const result = (await collection.find({ time }).toArray())[0];
        const { flows } = result;
        const data = [];
        flows.forEach((flow) => {
            if (flow.device === device && flow.language === language) {
                data.push({
                    name: flow.name,
                    actions: flow.actions,
                    manual_error: flow.manual_error,
                    real_device: flow.real_device,
                });
            }
        });
        return data;
    }

    static async findReportOverview(versionNameQuery, errorQuery = false) {
        const collection = await database.getCollection(config.COLLECTION_NAME_REPORT);
        let result;
        if (errorQuery === true) {
            result = await collection
                .find({ version_name: { $regex: `.*${versionNameQuery}.*` }, error: { $gte: 1 } })
                .project({
                    time: 1, version_name: 1, error: 1, platform: 1, _id: false,
                })
                .sort({ time: -1 }).toArray();
        } else {
            result = await collection
                .find({ version_name: { $regex: `.*${versionNameQuery}.*` } })
                .project({
                    time: 1, version_name: 1, error: 1, platform: 1, _id: false,
                })
                .sort({ time: -1 })
                .toArray();
        }
        return result;
    }

    static async findDevicesAndLanguageByTime(time) {
        const collection = await database.getCollection(config.COLLECTION_NAME_REPORT);
        const result = await collection
            .find({ time }).project({ time: 1, flows: 1, _id: false }).limit(1).next();
        const data = [];
        result.flows.forEach((flow) => {
            const device = _.find(data, { name: flow.device });
            let error = false;
            flow.actions.forEach((action) => {
                if (action.error) {
                    error = true;
                }
            });
            if (flow.manual_error === true) {
                error = true;
            }
            if (device && !_.find(device.languages, { language: flow.language })) {
                device.languages.push({ language: flow.language, error });
            } else if (device && _.find(device.languages, { language: flow.language })) {
                _.find(device.languages, { language: flow.language }).error = error;
            } else if (!device) {
                data.push({
                    name: flow.device,
                    real_device: flow.real_device || false,
                    languages: [{ language: flow.language, error }],
                });
            }
        });
        return data;
    }

    static async upsertManualError(time, flowName, deviceName, language, manualError) {
        const collection = await database.getCollection(config.COLLECTION_NAME_REPORT);
        await collection.updateOne(
            { time, flows: { $elemMatch: { name: flowName, device: deviceName, language } } },
            { $set: { 'flows.$.manual_error': manualError } },
            { upsert: true },
        );
        const report = await collection.find({ time }).limit(1).next();
        let errorCount = 0;
        report.flows.forEach((flow) => {
            if (flow.manual_error === true) {
                errorCount += 1;
            } else {
                flow.actions.forEach((action) => {
                    if (action.error === true) {
                        errorCount += 1;
                    }
                });
            }
        });
        await collection.updateOne(
            { time },
            { $set: { error: errorCount } },
        );
    }

    static async deleteReport(time) {
        const collection = await database.getCollection(config.COLLECTION_NAME_REPORT);
        const reportDocument = await collection.find({ time }).limit(1).next();
        if (reportDocument === null) {
            return;
        }
        reportDocument.flows.forEach((flow) => {
            flow.actions.forEach((action) => {
                if (!(action.image_name === 'AppiumErrorImage')) {
                    try {
                        fs.unlinkSync(`${__dirname}/../images/${action.image_name}.png`);
                    // eslint-disable-next-line no-empty
                    } catch (error) {}
                }
            });
        });
        await collection.deleteMany({ time });
    }
}

module.exports = Report;
