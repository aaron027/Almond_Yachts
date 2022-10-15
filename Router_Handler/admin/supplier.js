//======================================================================================
// Supplier Block for Admin
//======================================================================================
var request = require('request')

/**
 * 
 * Render supplier page for admin
 * @returns 
 */
module.exports.renderSupplierPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.suppliers = result;
        res.render('./oa/supplier.html', {
            result: result,
            admin: req.session.admin
        })
    });
}

/**
 * 
 * The function to delete supplier 
 * @returns 
 */
module.exports.deleteSupplier = (req, response) => {
    var supplierid = req.query.id;
    request.delete({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers/' + supplierid,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }, (err, res, data) => {
        var result = res.body
        req.session.suppliers = result
        response.redirect('/oa/supplier')
    })

}

/**
 * 
 * Render supplier edit page for admin
 * @returns 
 */
module.exports.renderSupplierEditPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var supplierid = parseInt(req.query.id);
    var suppliers = req.session.suppliers
    var found = suppliers.find(element => element.supplierId == supplierid);
    req.session.supplierSingle = found;
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.suppliers = result
        res.render('./oa/supplierEdit.html', {
            admin: req.session.admin,
            supplierSingle: req.session.supplierSingle
        })
    });
}

/**
 * 
 * The function to edit supplier
 * @returns 
 */
module.exports.editSupplier = (req, response, next) => {
    var formData = req.body;
    var supplierid = req.session.supplierSingle.supplierId;
    formData.supplierId = parseInt(formData.supplierId)
    formData.phone = parseInt(formData.phone)
    formData.item = null
    request.put({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers/' + supplierid,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.suppliers = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}


/**
 * 
 * Render new supplier page
 * @returns 
 */
module.exports.renderNewSupplierPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.supplierSingle = result
        res.render('./oa/newSupplier.html', {
            admin: req.session.admin,
            suppliers: req.session.suppliers,
            supplierSingle: req.session.supplierSingle
        })

    });

}

/**
 * 
 * The function to add new supplier
 * @returns 
 */
module.exports.addNewSupplier = (req, response, next) => {
    var formData = req.body;
    formData.phone = parseInt(formData.phone)
    formData.items = null
    request.post({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.suppliers = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}