const multer = require('multer');
const ReportController = require('./controllers/ReportController.js');
const AppiumController = require('./controllers/AppiumController.js');

module.exports = (app) => {
    app.get('/api/report/overview', ReportController.getReportsOverview);
    app.get('/api/report/flows', ReportController.getFlows);
    app.get('/api/report', ReportController.getDevicesLanguages);
    app.put('/api/report/flow/error', ReportController.updateFlowError);
    app.delete('/api/report', ReportController.deleteReport);

    app.get('/api/appium/available', AppiumController.getAvailable);
    app.get('/api/appium/jobs', AppiumController.getRunningJobs);

    app.delete('/api/appium/version', AppiumController.deleteVersion);
    app.delete('/api/appium/cancel', AppiumController.cancelRun);
    app.post('/api/appium/fail', AppiumController.runFailDeviceLanguage);
    app.post('/api/appium/all', AppiumController.runAllDeviceLanguageByAbsolutePath);
    app.post('/api/appium/specific', AppiumController.runSpecific);
    app.post('/api/appium/upload/binary',
        multer().single('file'), AppiumController.uploadBinary);
};
