//======================================================================================
// Section Block for Admin
//======================================================================================
var request = require('request')

/**
 * 
 * Render section list page for admin
 * @returns 
 */
module.exports.renderSectionPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.sections = result
        res.render('./oa/section.html', {
            result: result,
            admin: req.session.admin
        })
    });
}

/**
 * 
 * Render section edit page for admin
 * @returns 
 */
module.exports.renderSectionEditPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var sectionid = parseInt(req.query.id);
    var sections = req.session.sections
    var found = sections.find(element => element.sectionId == sectionid);
    req.session.sectionSingle = found;
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.sections = result
        res.render('./oa/sectionEdit.html', {
            admin: req.session.admin,
            sectionSingle: req.session.sectionSingle
        })
    });
}

/**
 * 
 * Render new section page for admin
 * @returns 
 */
module.exports.renderNewSectionPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.supplierSingle = result
        res.render('./oa/newSection.html', {
            admin: req.session.admin,
            sections: req.session.sections,
            sectionSingle: req.session.sectionSingle
        })

    });

}

/**
 * 
 * The function to edit section
 * @returns 
 */
module.exports.editSection = (req, response, next) => {
    var formData = req.body;
    var sectionid = formData.sectionId;
    formData.sectionId = parseInt(formData.sectionId)
    formData.items = null
    request.put({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections/' + sectionid,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.sections = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}

/**
 * 
 * The function to delete section
 * @returns 
 */
module.exports.deleteSection = (req, response) => {
    var sectionid = req.query.id;
    request.delete({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections/' + sectionid,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }, (err, res, data) => {
        var result = res.body
        req.session.sections = result
        response.redirect('/oa/sections')
    })

}


/**
 * 
 * The function to add new section
 * @returns 
 */
module.exports.addNewSection = (req, response, next) => {
    var formData = req.body;
    formData.items = null
    request.post({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.sections = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}