const mongoose = require('mongoose'); 
const controller = require('./controller');
const checker = require('./checker');
const Element = mongoose.model('Element');

const errors = require('../commons/errors.js');

exports.get = async (req, res) => { 
    const restriction = await checker.whatCanRead(req, res);
    return await controller.getResourceList(req, res, '{ "timestamp": "desc" }', '{}', Element, restriction); 
};

exports.getone = async (req, res) => { 
    let result = await checker.isAvailable(req, res, Element); if (result != true) return result;
    result = await checker.isOwner(req, res); if (result != true) return result;
    return res.status(200).json(req.resource);
};

exports.post = async (req, res) => {
    return await controller.postResource(req, res, Element);
};

exports.put = async (req, res) => { 
    const fields = ['tags', 'content'];
    let result = await checker.isAvailable(req, res, Element); if (result != true) return result;
    result = await checker.isFilled(req, res, fields); if (result != true) return result;
    result = await checker.canModify(req, res); if (result != true) return result;
    return await controller.updateResource(req, res, fields, Element);
}; 

exports.delete = async (req, res) => {
    let result = await checker.isAvailable(req, res, Element); if (result != true) return result;
    result = await checker.canDelete(req, res); if (result != true) return result;
    return await controller.deleteResource(req, res, Element);
};
