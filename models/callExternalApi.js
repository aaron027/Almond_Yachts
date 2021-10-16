var request = require('request')


var callExternalAPI = (callback) => {
    request({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)

    }, (err, res, data) => {
        if (err) {
            return callback(err)
        }
        return callback(data)
    })
}

module.exports.callApi = callExternalAPI

