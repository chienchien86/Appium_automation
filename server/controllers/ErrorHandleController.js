const fs = require('fs');

module.exports = {

    checkPostBodyExistAndSendError(req, res, field) {
        if (req.body[field] === undefined) {
            res.status(400).send({ status: false, error: `post body field '${field}' should be given` });
            return true;
        }
        return false;
    },

    checkQueryExistAndSendError(req, res, field) {
        if (req.query[field] === undefined) {
            res.status(400).send({ status: false, error: `query field '${field}' should be given` });
            return true;
        }
        return false;
    },

    checkPostBodyIsNumberAndSendError(req, res, field) {
        if (Number.isNaN(parseFloat((req.body[field])))) {
            res.status(400).send({ status: false, error: `post body field '${field}' should be number` });
            return true;
        }
        return false;
    },

    checkQueryIsBooleanAndSendError(req, res, field) {
        try {
            const boolean = JSON.parse(req.query[field]);
            if (boolean !== true && boolean !== false) {
                throw Error('release should be true or false');
            }
            return false;
        } catch (error) {
            res.status(400).send({ status: false, error: `post query field '${field}' should be boolean` });
            return true;
        }
    },

    checkPostBodyIsBooleanAndSendError(req, res, field) {
        try {
            const boolean = JSON.parse(req.body[field]);
            if (boolean !== true && boolean !== false) {
                throw Error('release should be true or false');
            }
            return false;
        } catch (error) {
            res.status(400).send({ status: false, error: `post body field '${field}' should be boolean` });
            return true;
        }
    },

    checkPostBodyIsArrayAndSendError(req, res, field) {
        if (!(req.body[field] instanceof Array)) {
            res.status(400).send({ status: false, error: `post body field '${field}' should be array'` });
            return true;
        }
        return false;
    },

    checkPostBodyFilePathExistAndSendError(req, res, field) {
        if (!fs.existsSync(req.body[field])) {
            res.status(400).send({ status: false, error: `post body field '${field}' file path does not exist` });
            return true;
        }
        return false;
    },

    checkPostBodyFilePathDoNotHaveSpaceChar(req, res, field) {
        if (req.body[field].includes(' ')) {
            res.status(400).send({ status: false, error: `post body field '${field}' cannot have space character` });
            return true;
        }
        return false;
    },

    checkPostBodyDateTypeValid(req, res, field) {
        if (new Date(req.body[field]).toString() === 'Invalid Date') {
            res.status(400).send({ status: true, error: 'Invalid Date' });
            return true;
        }
        return false;
    },
};
