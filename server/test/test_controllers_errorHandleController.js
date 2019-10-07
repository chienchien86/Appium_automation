const chai = require('chai');
const chaiAsPromise = require('chai-as-promised');
const httpMocks = require('node-mocks-http');
const ErrorHandleController = require('../controllers/ErrorHandleController.js');

const { expect } = chai;
chai.use(chaiAsPromise);

describe('ErrorHandleController', () => {
    it('#checkPostBodyExistAndSendError / OK', () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        req.body = {
            fieldName: 'exist',
        };
        const result = ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'fieldName');
        expect(result).to.equal(false);
    });

    it('#checkPostBodyExistAndSendError / post body not exist', () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        req.body = {};
        const result = ErrorHandleController.checkPostBodyExistAndSendError(req, res, 'fieldName');
        expect(result).to.equal(true);
        expect(res.statusCode).to.equal(400);
        expect(res._getData()).to.deep.equal({ status: false, error: "post body field 'fieldName' should be given" });
    });

    it('#checkQueryExistAndSendError / OK', () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        req.query = {
            fieldName: 'exist',
        };
        const result = ErrorHandleController.checkQueryExistAndSendError(req, res, 'fieldName');
        expect(result).to.equal(false);
    });
});
