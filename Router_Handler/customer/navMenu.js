//======================================================================================
// My Account Block
//======================================================================================
var request = require('request')

//Render Index page
module.exports.indexPage = (req, res, next) => {
    res.render('index.html', {
        user: req.session.user
    })
}

//Render about page
module.exports.aboutPage = (req, res, next) => {
    res.render('about.html', {
        user: req.session.user
    })
}

//Render contact page
module.exports.contactPage = (req, res, next) => {
    res.render('contact.html', {
        user: req.session.user
    })
}

//Render customization page
module.exports.customPage = (req, res4, next) => {
    var categoryresult;
    var BoatsResult;
    var sectionsResult;
    var ItemsResult;
    var id = req.query.id;
    var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
        'headers': {
            'Content-Type': 'application/json'
        }
    };
    request(options, function (error, res, next) {
        if (error) return error;
        categoryresult = JSON.parse(res.body);
        request(options, function (err, response, data) {
            request.get({
                url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, (err, res1, data) => {
                BoatsResult = JSON.parse(res1.body);
                BoatsResult.forEach(element => element.category = categoryresult[element.categoryId - 1]);
                var found = BoatsResult.find(element => element.id == id);
                request(options, function (err, res, data) {
                    request.get({
                        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }, (err, res2, data) => {
                        sectionsResult = JSON.parse(res2.body);
                        request(options, function (err, res, data) {
                            request.get({
                                url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }, (err, res3, data) => {
                                ItemsResult = JSON.parse(res3.body);
                                var finalResult = [];
                                var itemArr = [];
                                // ItemsResult.forEach((element1, index) => { var found = sectionsResult.find(element => element.sectionId == element1.sectionId); element1.section = found });
                                sectionsResult.forEach((item, index) => {
                                    finalResult.push(item);
                                    finalResult[index].info = [];
                                    finalResult[index].type = 'radio';

                                    ItemsResult.forEach((item2, index2) => {
                                        itemArr.push(item2)
                                        if (finalResult[index].sectionId == itemArr[index2].sectionId) {
                                            finalResult[index].info.push(itemArr[index2])
                                        }
                                    })
                                    if (finalResult[index].sectionName == 'Additional Service') {
                                        finalResult[index].type = 'checkbox';
                                    }
                                    if (finalResult[index].sectionName == 'Sails Selection') {
                                        finalResult[index].type = 'checkbox';
                                    }
                                    if (finalResult[index].sectionName == 'Interior Design') {
                                        finalResult[index].type = 'checkbox';
                                    }
                                });

                                res4.render('customization.html', {
                                    sectionsResult: sectionsResult,
                                    ItemsResult: ItemsResult,
                                    finalResult: finalResult,
                                    found: found,
                                    user: req.session.user
                                })
                            })
                        })
                    })
                })
            })
        })
    });
}