//======================================================================================
// Category Block for Admin
//======================================================================================
var request = require('request')
/**
 * 
 * Render category list page for admin
 * @returns 
 */
module.exports.renderCategoryPage = (req, res) => {
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
        res.render('./oa/category.html', {
            result: result,
            admin: req.session.admin
        })
    });
}

/**
 * 
 * Render category edit page for admin
 * @returns 
 */
module.exports.renderCategoryEditPage = (req, res) => {

    if (!req.session.admin) {
        return res.redirect('/oa/login')
    }
    var categoryid = parseInt(req.query.id);
    var categories = req.session.categories;
    var found = categories.find(element => element.categoryId == categoryid);

    req.session.categorySingle = found;
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
        res.render('./oa/categoryEdit.html', {
            admin: req.session.admin,
            categorySingle: req.session.categorySingle
        })
    });
}


/**
 * 
 * Render new category page for admin
 * @returns 
 */
module.exports.renderNewCategoryPage = (req, res) => {
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
        req.session.categorySingle = result
        res.render('./oa/newCategory.html', {
            admin: req.session.admin,
            categories: req.session.categories,
            categorySingle: req.session.categorySingle
        })
    });
}

/**
 * 
 * The function edit category
 * @returns 
 */
module.exports.editCategory = (req, response, next) => {

    var formData = req.body;
    var categoryid = formData.categoryId;
    formData.categoryId = parseInt(formData.categoryId)
    formData.boats = null
    request.put({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories/' + categoryid,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.categories = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}

/**
 * 
 * The function to add new category
 * @returns 
 */
module.exports.addNewCategory = (req, response, next) => {

    var formData = req.body;
    formData.boats = null
    request.post({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }, (err, res, data) => {
        var result = res.body
        req.session.categories = result
        response.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}

/**
 * 
 * The function to delete category
 * @returns 
 */
module.exports.deleteCategory = (req, response) => {

    var sectionid = req.query.id;
    request.delete({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories/' + sectionid,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }, (err, res, data) => {
        var result = res.body
        req.session.categories = result
        response.redirect('/oa/categories')
    })

}

