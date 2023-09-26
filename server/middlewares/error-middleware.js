const ApiError = require('../exceptions/api-error');

module.exports = function (err, req, res, next) {
    console.log(err);
    if(err instanceof ApiError){
        return res.staus(err.status),json({message: err.message, errors: err.errors});
    }
    return res.staus(500).json({message: "Unexpected error"});
}