const fs = require('fs');
const _ = require('lodash');
const database = require('./database/database.js');

(
    async () => {
        const imagesNames = fs.readdirSync('./images/');
        const collection = await database.getCollection('report');
        const reports = await collection.find({}).toArray();
        console.log('Waiting For Prepareing list of images to be delete...');
        reports.forEach((report) => {
            if (report.flows) {
                report.flows.forEach((flow) => {
                    if (flow.actions) {
                        flow.actions.forEach((action) => {
                            _.remove(imagesNames, ele => ele === `${action.image_name}.png` || /.png/.test(ele) === false);
                        });
                    }
                });
            }
        });
        console.log(`Deleting ${imagesNames.length} image ...`);
        imagesNames.forEach((image) => {
            fs.unlinkSync(`${__dirname}/images/${image}`);
        });
        await database.closeDB();
    }
)();
