//======================================================================================
// Item Block for Admin
//======================================================================================
var request = require('request')
/**
 * 
 * Render item page for admin
 * @returns 
 */
module.exports.renderItemPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, response) {
        if (error) return error;
        var items = JSON.parse(response.body);
        req.session.items = items
        var options = {
            'method': 'GET',
            'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, res2) {
            if (error) return error;
            var sections = JSON.parse(res2.body);
            var sectionArr = []
            for (var i in items) {
                for (var j in sections) {
                    if (items[i].sectionId == sections[j].sectionId) {
                        sectionArr.push(sections[j])
                    }
                }
            }
            res.render('./oa/Item.html', {
                items: items,
                admin: req.session.admin,
                sectionArr: sectionArr
            })
        });
    });
}

/**
 * 
 * Render item page for admin
 * @returns 
 */
module.exports.renderEditItemPage = (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var itemid = parseInt(req.query.id);
    var items = req.session.items;
    var found = items.find(element => element.itemId == itemid);
    req.session.itemSingle = found;
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
        var options = {
            'method': 'GET',
            'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, res2) {
            if (error) return error;
            var sectionResult = JSON.parse(res2.body);
            req.session.sections = sectionResult
            res.render('./oa/itemEdit.html', {
                admin: req.session.admin,
                suppliers: req.session.suppliers,
                sections: req.session.sections,
                itemSingle: req.session.itemSingle
            })
        });

    });
}

/**
 * 
 * Render new item page for admin
 * @returns 
 */
module.exports.renderNewItemPage = (req, res) => {
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
        req.session.suppliers = result
        var options = {
            'method': 'GET',
            'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, res2) {
            if (error) return error;
            var sectionResult = JSON.parse(res2.body);
            req.session.sections = sectionResult
            res.render('./oa/newItem.html', {
                admin: req.session.admin,
                suppliers: req.session.suppliers,
                sections: req.session.sections,
                itemSingle: req.session.itemSingle
            })
        });

    });
}

/**
 * 
 * The function to delete item
 * @returns 
 */
module.exports.deleteItem = (req, response) => {
    var itemid = req.query.id;
    request.delete({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items/' + itemid,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }, (err, res, data) => {
        var result = res.body
        req.session.items = result
        response.redirect('/oa/Item')
    })

}

/**
 * 
 * The function to add new  item
 * @returns 
 */
module.exports.addNewItem = (req, response, next) => {
    var formData = req.body;
    formData.quantity = parseInt(formData.quantity)
    formData.quantityRemaining = parseInt(formData.quantityRemaining)
    formData.unitPrice = parseInt(formData.unitPrice)
    formData.weight = parseInt(formData.weight)
    formData.size = parseInt(formData.size)
    formData.supplierId = JSON.parse(formData.supplierId)
    formData.sectionId = JSON.parse(formData.sectionId)
    formData.section = null
    formData.section = null
    request.post({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.items = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}

/**
 * 
 * The function to edit item
 * @returns 
 */
module.exports.editItem = (req, response, next) => {
    var formData = req.body;
    var itemid = req.session.itemSingle.itemId;
    formData.itemId = parseInt(formData.itemId)
    formData.quantity = parseInt(formData.quantity)
    formData.quantityRemaining = parseInt(formData.quantityRemaining)
    formData.unitPrice = parseInt(formData.unitPrice)
    formData.weight = parseInt(formData.weight)
    formData.size = parseInt(formData.size)
    formData.supplierId = parseInt(formData.supplierId)
    formData.sectionId = parseInt(formData.sectionId)
    request.put({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items/' + itemid,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.items = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}