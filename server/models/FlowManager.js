/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');

class FlowManager {
    static getAllFlowClass(platform) {
        if (platform === 'iOS' || platform === 'android') {
            const flowBasePath = `${__dirname}/../flow/${platform}`;
            const flowNames = fs.readdirSync(flowBasePath);
            const flowClass = [];
            flowNames.forEach((flowName) => {
                flowClass.push(require(`${flowBasePath}/${flowName}`));
            });
            return flowClass;
        }
        return [];
    }

    static getAllFlowNames(platform) {
        if (platform === 'iOS' || platform === 'android') {
            const flowBasePath = `${__dirname}/../flow/${platform}`;
            const flowFolderFileNames = fs.readdirSync(flowBasePath);
            const flowFileNames = flowFolderFileNames.filter(e => /^flow*/.test(e));
            const flowNames = flowFileNames.map(e => e.split('.')[0]);
            return flowNames;
        }
        return [];
    }
}

module.exports = FlowManager;
