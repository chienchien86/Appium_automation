const Report = require('../models/Report.js');
const ErrorHandleController = require('../controllers/ErrorHandleController.js');

module.exports = {

    async getReportsOverview(req, res) {
        const versionNameQuery = req.query.version_name || '';
        let errorQuery;
        try {
            errorQuery = JSON.parse(req.query.error);
            if (typeof (errorQuery) !== typeof (true)) {
                res.status(400).send({ status: false, error: 'error should be boolean type' });
                return;
            }
        } catch (error) {
            res.status(400).send({ status: false, error: 'error should be boolean type' });
            return;
        }
        const result = await Report.findReportOverview(versionNameQuery, errorQuery);
        res.status(200).send({ status: true, reports: result });
    },

    async getDevicesLanguages(req, res) {
        let time;
        if (!req.query.time) {
            res.status(400).send({ status: false, error: 'time should be given' });
            return;
        }
        try {
            time = new Date(req.query.time);
            if (time.toString() === 'Invalid Date') {
                res.status(400).send({ status: false, error: 'time Invalid' });
                return;
            }
            const result = await Report.findDevicesAndLanguageByTime(time);
            res.status(200).send({ status: true, devices_languages: result });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, error: error.toString() });
        }
    },

    async getFlows(req, res) {
        let time;
        if (!req.query.time) {
            res.status(400).send({ status: false, error: 'time should be given' });
            return;
        }
        try {
            time = new Date(req.query.time);
            if (time.toString() === 'Invalid Date') {
                res.status(400).send({ status: false, error: 'time Invalid' });
                return;
            }
            const result = await Report.findFlowsByDeviceLanguage(
                time, req.query.device, req.query.language,
            );
            res.status(200).send({ status: true, flows: result });
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 500, error: error.toString() });
        }
    },

    async updateFlowError(req, res) {
        const time = new Date(req.body.time);
        const manualError = req.body.manual_error;
        const flowName = req.body.flow_name;
        const deviceName = req.body.device_name;
        const { language } = req.body;
        await Report.upsertManualError(time, flowName, deviceName, language, manualError);
        res.status(200).send({ status: true });
    },

    async deleteReport(req, res) {
        if (ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'timestamp')) {
            return;
        }
        const time = new Date(parseInt(req.body.timestamp, 10));
        try {
            await Report.deleteReport(time);
        } catch (error) {
            console.log(error);
            res.status(500).send({ status: false, error: error.toString() });
            return;
        }
        res.status(200).send({ status: true });
    },
};
