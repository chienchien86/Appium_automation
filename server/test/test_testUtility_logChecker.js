const chai = require('chai');

const { expect } = chai;
const LogChecker = require('../flow/iOS/logChecker.js');

class MockDriver {
    // eslint-disable-next-line class-methods-use-this
    log() {
        const nowTimestamp = Date.now();
        return [
            {
                timestamp: nowTimestamp - 21 * 1000,
                level: 'ALL',
                message: 'abc',
            },
            {
                timestamp: nowTimestamp - 20,
                level: 'ALL',
                message: 'def',
            },
            {
                timestamp: nowTimestamp - 10,
                level: 'ALL',
                message: 'ghi',
            },
        ];
    }
}

describe('LogChecker', () => {
    it('#checkIsLogExist', async () => {
        const driver = new MockDriver();
        const logchecker = new LogChecker(driver);
        const yesabc = await logchecker.checkIsLogExist('abc');
        const yesdef = await logchecker.checkIsLogExist('def');
        const yesghi = await logchecker.checkIsLogExist('ghi');
        expect(yesabc).to.equal(false);
        expect(yesdef).to.equal(true);
        expect(yesghi).to.equal(true);
    });
});
