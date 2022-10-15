//======================================================================================
// Boat Block for Admin
//======================================================================================
var request = require('request')
/**
 * 
 * Render boat list page for admin
 * @returns 
 */
module.exports.renderBoatPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.boats = result
        res.render('./oa/boat.html', {
            result: result,
            admin: req.session.admin
        })
    });
}

/**
 * 
 * Render boat edit page for admin
 * @returns 
 */
module.exports.renderBoatEditPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var boatid = parseInt(req.query.id);
    var boats = req.session.boats;
    var found = boats.find(element => element.id == boatid);
    req.session.BoatSingle = found;
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.categories = result
        res.render('./oa/boatEdit.html', {
            admin: req.session.admin,
            categories: req.session.categories,
            BoatSingle: req.session.BoatSingle
        })
    });
}

/**
 * 
 * Render new boat page for admin
 * @returns 
 */
module.exports.renderNewBoatPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.categories = result
        res.render('./oa/newBoat.html', {
            admin: req.session.admin,
            categories: req.session.categories,
        })
    });
}

/**
 * 
 * The function to delete boat
 * @returns 
 */
module.exports.deleteBoat = (req, response) => {
    var boatid = req.query.id;
    request.delete({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats/' + boatid,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }, (err, res, data) => {
        var result = res.body
        req.session.boats = result
        response.redirect('/oa/boats')
    })

}

/**
 * 
 * The function to edit boat
 * @returns 
 */
module.exports.editBoat = (req, response, next) => {
    var formData = req.body;
    var boatSingle = req.session.BoatSingle;
    var boatid = parseInt(boatSingle.id);
    formData.id = boatid;
    var categoryId = parseInt(formData.categoryId);
    formData.categoryId = categoryId;
    request.put({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats/' + boatid,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.boats = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}

/**
 * 
 * The function to add new boat
 * @returns 
 */
module.exports.addNewBoat = (req, response, next) => {
    var formData = req.body;
    var categoryId = parseInt(req.body.categoryId)
    var modelYear = formData.modelYear;
    formData.categoryId = categoryId
    formData.category = null
    formData.items = null
    request.post({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.boats = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}