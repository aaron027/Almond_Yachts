var express = require('express')
// var User = require('./models/user')
var request = require('request')
var router = express.Router()
var nodeoutlook = require('nodejs-nodemailer-outlook')
var nodemailer = require("nodemailer");
const promisify = require("es6-promisify");

var apikey = "";
var adminapi = "";
var userid = "";
var adminid = "";

router.get('/', function (req, res, next) {
  res.render('index.html', {
    user: req.session.user
  })
})

//======================================================================================
// Model Block
//======================================================================================

router.get('/model', function (req, res, next) {
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
    'headers': {
      'Authentication': 'Bearer ' + apikey,
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, res1) {
    if (error) return error;
    var categoryresults = JSON.parse(res1.body);
    var options = {
      'method': 'GET',
      'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
      'headers': {
        'Authentication': 'Bearer ' + apikey,
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, res2) {
      if (error) return error;
      var result = JSON.parse(res2.body);
      result.forEach(element => element.category = categoryresults[element.categoryId - 1]);
      var lightShipCategory = result.filter(element => element.categoryId == 1)
      var CruisingCategory = result.filter(element => element.categoryId == 2)
      res.render('model.html', {
        result: result,
        user: req.session.user,
        categoryresults: categoryresults,
        lightShipCategory: lightShipCategory,
        CruisingCategory: CruisingCategory
      })
    });
  });

})

//======================================================================================
// Login Block
//======================================================================================

router.get('/login', function (req, res, next) {
  res.render('login.html')
})


router.post('/login', function (req, response, next) {
  var options = {
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  }
  request(options, function (err, res, data) {
    apikey = data;
    request.get({
      url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetCurrentUsers',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apikey
      }
    }, (err, res, data) => {
      if (res.body == "") {
        response.status(200).json({
          err_code: 1,
          message: 'Email or password is invalid.'
        })
      } else {
        var user = JSON.parse(res.body)
        req.session.user = user;
        userid = user.id;
        response.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      }
    })
  })
})
//======================================================================================
// Place order
//======================================================================================
router.post('/placeOrder', function (req, response, next) {
  var formData = req.body;
  var orderDate = new Date().toISOString()
  formData.orderDate = orderDate;
  formData.boatId = parseInt(formData.boatId)
  formData.categoryId = parseInt(formData.categoryId)
  var sumPrice = 0;
  var itemList = [];

  for (var item in formData) {
    if (item.indexOf("engine") != -1) {
      sumPrice += parseInt(JSON.stringify(formData[item]).split('_')[1])
      itemList.push(JSON.stringify(formData[item]).split('_')[0])
    } else {
    }
  }
  formData.price = sumPrice

  var valueDate = {
    customerId: formData.userid,
    boatId: formData.boatId,
    orderDate: formData.orderDate,
    estimatedDeliveryDate: formData.orderDate,
    price: formData.price,
    boats: [{
      id: formData.boatId,
      boatName: formData.boatName,
      categoryId: formData.categoryId,
      category: [
        {
          categoryId: formData.categoryId,
          categoryName: formData.categoryName
        }
      ]
    }],
    applicationUser: {
      id: formData.userid
    }
  }

  var firstName = formData.firstName;
  var lastName = formData.lastName;
  var email = formData.email;

  valueDate.boats.itemInfo = itemList


  // if (valueDate.customerId == '') {
  //   request.post({
  //     url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/Signup',
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: {
  //       firstName: firstName,
  //       lastName: lastName,
  //       email: email,
  //       password: 'Almond@123'
  //     }
  //   }, (err, res, data) => {
  //     var result = JSON.parse(res.body);

  //   })
  // }

  req.session.valueDate = valueDate
  request.post({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    },
    body: JSON.stringify(formData)
  }, (err, res, data) => {
    var result = res.body
    response.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

//======================================================================================
// Setting Block
//======================================================================================

router.get('/setting', function (req, res, next) {
  if (apikey === '') {
    return res.redirect('/login')
  }
  res.render('setting.html', {
    user: req.session.user
  })
})

//======================================================================================
// Change password Block
//======================================================================================
router.post('/changePwd', function (req, response, next) {
  var formData = req.body;
  var userid = formData.id;
  var newPwd = formData.newPwd
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/UpdatePassword',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    },
    body: JSON.stringify({
      id: userid,
      passwordHash: newPwd
    })
  }, (err, res, data) => {
    var result = res.body
    req.session.user = result
    response.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

//======================================================================================
// Change password Block
//======================================================================================

router.get('/forgetPwd', function (req, res, next) {
  res.render('forgetPwd.html', {
    user: req.session.user
  })
})

router.post('/forgetPwd', async (req, res) => {
  var formData = req.body;
  var email = formData.email
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetUserByEmail?email=' + email,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) return error;
    var result = JSON.parse(response.body);
    var username = result.email;
    var pwd = result.passwordHash
    var firstName = result.firstName
    const transporter = nodemailer.createTransport({
      host: 'smtp.live.com',
      port: 587,
      auth: {
        user: 'almondboats02@hotmail.com',
        pass: '20031105Ab'
      }
    });

    // send email
    transporter.sendMail({
      from: 'almondboats02@hotmail.com',
      to: result.email,
      subject: 'Almond Yachts Password Reset',
      text: 'Hi ' + firstName + ', ' + 'your username is: ' + username + ', password is : ' + pwd
    });
  });
})


//======================================================================================
// Setting order History Block
//======================================================================================
router.get('/order', function (req, res, next) {
  if (apikey === '') {
    return res.redirect('/login')
  }
  var userid = req.session.user.id;
  // var found = categories.find(element => element.categoryId == categoryid);
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders/GetOrdersByCustomerId?customerId=' + userid,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) return error;
    var result = JSON.parse(response.body);
    var options = {
      'method': 'GET',
      'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
      'headers': {
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, response) {
      if (error) return error;
      var BoatsResult = JSON.parse(response.body);

      var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders/GetOrdersByCustomerId?customerId=' + userid,
        'headers': {
          'Content-Type': 'application/json'
        }
      };
      request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        var options = {
          'method': 'GET',
          'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
          'headers': {
            'Content-Type': 'application/json'
          }
        };
        request(options, function (error, response) {
          if (error) return error;
          var CategoryResult = JSON.parse(response.body);

          BoatsResult.forEach((element1, index) => {
            result.forEach(element => {
              if (element1.id == element.boatId) {
                element.boats = element1
              }
            });
          });
          CategoryResult.forEach((element3, index) => {
            result.forEach(element => {
              if (element3.categoryId == element.boats.categoryId) {
                element.boats.category = element3
              }
            });
          });
          req.session.orderInfo = result
          res.render('order.html', {
            user: req.session.user,
            result: result
          })
        });
      });
    });
  });

})

router.get('/orderInfo', function (req, res, next) {
  if (apikey === '') {
    return res.redirect('/login')
  }
  var orderid = req.query.orderid;
  var orderInfo = req.session.orderInfo
  var found = null;
  orderInfo.forEach(element => {
    if (element.orderId == orderid) {
      found = element;
    }
  });
  res.render('orderInfo.html', {
    user: req.session.user,
    orderFound: found,
    valueDate: req.session.valueDate
  })
})
//======================================================================================
// Register Block
//======================================================================================

router.get('/register', function (req, res, next) {
  res.render('register.html')
})

router.post('/register', function (req, response, next) {
  request.post({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/Signup',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  }, (err, res, data) => {
    var result = JSON.parse(res.body);
    if (result.status === 401) {
      response.status(200).json({
        err_code: 1,
        message: 'The email exits!'
      })
    } else {
      var user = JSON.parse(res.body)
      req.session.user = user;
      const transporter = nodemailer.createTransport({
        host: 'smtp.live.com',
        port: 587,
        auth: {
          user: 'almondboats01@hotmail.com',
          pass: '20031105Ab'
        }
      });

      // send email
      transporter.sendMail({
        from: 'almondboats01@hotmail.com',
        to: user.email,
        subject: 'Registeration Information',
        text: 'Thank you for joining us! Your username is: ' + user.email
      });
      response.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    }
  })
})

//======================================================================================
// Logout Block
//======================================================================================

router.get('/logout', function (req, res, next) {
  req.session.user = null
  res.redirect('/login')
})


//======================================================================================
// Edit profile Block
//======================================================================================

router.get('/edit', function (req, res, next) {
  if (apikey === '') {
    return res.redirect('/login')
  }
  res.render('edit.html', {
    user: req.session.user
  })
})

router.post('/edit', function (req, response, next) {
  var formData = req.body;
  formData.id = userid;
  formData.zipCode = parseInt(formData.zipCode)
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/UpdateUsers',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apikey
    },
    body: JSON.stringify(formData)
  }, (err, res, data) => {
    var result = res.body
    req.session.user = req.body
    response.redirect('/account')
  })
})

//======================================================================================
// Customization Block
//======================================================================================

router.get('/custom', async (req, res4, next) => {
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



})

router.get('/about', function (req, res, next) {
  res.render('about.html', {
    user: req.session.user
  })
})

router.get('/account', function (req, res, next) {
  if (apikey === '') {
    return res.redirect('/login')
  }
  res.render('account.html', {
    user: req.session.user
  })
})

router.get('/contact', function (req, res, next) {
  res.render('contact.html', {
    user: req.session.user
  })
})

router.get('/orderResult', function (req, res, next) {
  res.render('orderResult.html', {
    user: req.session.user
  })
})
//=================================================================================
//  Index
//=================================================================================
router.get('/oa/index', function (req, res, next) {
  if (adminid === '') {
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
    var result = JSON.parse(response.body);
    var itemsize = result.length;
    var options = {
      'method': 'GET',
      'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
      'headers': {
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, res2) {
      if (error) return error;
      var orderresult = JSON.parse(res2.body);
      var sumtotal = 0;
      orderresult.forEach(element => sumtotal += element.price);
      var ordersize = orderresult.length
      var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetUsers',
        'headers': {
          'Content-Type': 'application/json'
        }
      };
      request(options, function (error, res3) {
        if (error) return error;
        var userresult = JSON.parse(res3.body);
        var usersize = userresult.length
        res.render('./oa/index.html', {
          admin: req.session.admin,
          itemsize: itemsize,
          ordersize: ordersize,
          usersize: usersize,
          sumtotal: sumtotal
        })
      });

    });

  });

})

//=================================================================================
//  Login
//=================================================================================
router.get('/oa/login', function (req, res, next) {
  res.render('./oa/login.html')
})

router.post('/oa/login', function (req, response, next) {
  var options = {
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  }
  request(options, function (err, res, data) {
    adminapi = data;
    var username = JSON.parse(options.body).email

    request.get({
      url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetCurrentUsers',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminapi
      }
    }, (err, res, data) => {
      if (res.body == "") {
        response.status(200).json({
          err_code: 1,
          message: 'Email or password is invalid.'
        })
      } else {
        if (username != 'admin@maalu.com') {
          return response.status(200).json({
            err_code: 2,
            message: 'No Authorization!'
          })
        }
        var admin = JSON.parse(res.body)
        req.session.admin = admin;
        adminid = admin.id;
        response.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      }
    })
  })
})

router.get('/oa/logout', function (req, res) {
  req.session.admin = null
  res.redirect('/oa/login')
})
//=================================================================================
//  Account
//=================================================================================
router.get('/oa/profile', function (req, res) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  res.render('./oa/profile.html', {
    admin: req.session.admin
  })
})

router.post('/oa/profile', function (req, response, next) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var formData = req.body;
  formData.id = adminid;
  formData.zipCode = parseInt(formData.zipCode)
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/UpdateUsers',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    },
    body: JSON.stringify(formData)
  }, (err, res, data) => {

    var result = res.body
    req.session.admin = req.body
    response.redirect('/oa/account')
  })
})

router.get('/oa/account', function (req, res) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  res.render('./oa/account.html', {
    admin: req.session.admin
  })
})



//=================================================================================
//  Items
//=================================================================================
router.get('/oa/Item', async (req, res) => {
  if (adminid === '') {
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
    var result = JSON.parse(response.body);
    req.session.items = result
    res.render('./oa/Item.html', {
      result: result,
      admin: req.session.admin
    })
  });
})

router.get('/oa/itemEdit', function (req, res) {
  if (adminid === '') {
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
})

router.get('/oa/newItem', function (req, res) {
  if (adminid === '') {
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
})

router.get('/oa/deleteItem', function (req, response) {
  var itemid = req.query.id;
  request.delete({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items/' + itemid,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    }
  }, (err, res, data) => {
    var result = res.body
    req.session.items = result
    response.redirect('/oa/Item')
  })

})

router.post('/oa/newItem', function (req, response, next) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
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
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})

router.post('/oa/itemEdit', function (req, response, next) {
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
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})
//=================================================================================
//  Suppliers
//=================================================================================

router.get('/oa/supplierEdit', function (req, res) {
  if (adminid === '') {
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
})

router.post('/oa/supplierEdit', function (req, response, next) {
  var formData = req.body;
  var supplierid = req.session.supplierSingle.supplierId;
  formData.supplierId = parseInt(formData.supplierId)
  formData.phone = parseInt(formData.phone)
  formData.item = null
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers/' + supplierid,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})

router.get('/oa/supplier', async (req, res) => {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers',
    'headers': {
      'Authentication': 'Bearer ' + adminid,
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
})

router.get('/oa/deleteSupplier', function (req, response) {
  var supplierid = req.query.id;
  request.delete({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers/' + supplierid,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    }
  }, (err, res, data) => {
    var result = res.body
    req.session.suppliers = result
    response.redirect('/oa/supplier')
  })

})

router.get('/oa/newSupplier', function (req, res) {
  if (adminid === '') {
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

})

router.post('/oa/newSupplier', function (req, response, next) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var formData = req.body;
  formData.phone = parseInt(formData.phone)
  formData.items = null
  request.post({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Suppliers',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})


//=================================================================================
//  Orders
//=================================================================================
router.get('/oa/order', function (req, res) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
    'headers': {
      'Authentication': 'Bearer ' + adminid,
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) return error;
    var result = JSON.parse(response.body);
    req.session.orders = result
    request.get({
      url: 'https://boatconfigure20210930164433.azurewebsites.net/api/boats',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminapi
      }
    }, (err, res2, data) => {
      if (error) return error;
      var boats = JSON.parse(res2.body);
      result.forEach(element => element.boats = boats[element.boatId - 1]);
      req.session.boats = boats;
      res.render('./oa/order.html', {
        result: result,
        boats: req.session.boats,
        admin: req.session.admin
      })
    })

  });
})

router.get('/oa/orderEdit', function (req, res) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var orderid = parseInt(req.query.id);
  var orders = req.session.orders
  var found = orders.find(element => element.orderId == orderid);
  req.session.orderSingle = found;
  res.render('./oa/orderEdit.html', {
    admin: req.session.admin,
    orderSingle: found
  })
})

router.post('/oa/orderEdit', function (req, response, next) {
  var formData = req.body;
  var orderid = formData.orderId;
  formData.orderId = parseInt(formData.orderId)
  formData.boatId = parseInt(formData.boatId)
  formData.price = parseInt(formData.price)
  formData.boats = null
  formData.applicationUser = null
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders/' + orderid,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    },
    body: JSON.stringify(formData)
  }, (err, res, data) => {
    var result = res.body
    req.session.orders = result
    response.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

router.get('/oa/deleteOrder', function (req, response) {
  var orderid = req.query.id;
  request.delete({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders/' + orderid,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    }
  }, (err, res, data) => {
    var result = res.body
    req.session.orders = result
    response.redirect('/oa/order')
  })

})

router.get('/oa/viewOrder', function (req, response) {
  var orderid = req.query.id;
  request.get({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders/' + orderid,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    }
  }, (err, res, data) => {
    var result = res.body
    req.session.singleOrder = result
  })

})

//=================================================================================
//  Boats
//=================================================================================
router.get('/oa/boats', async (req, res) => {
  if (adminid === '') {
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
})

router.get('/oa/boatEdit', function (req, res) {
  if (adminid === '') {
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
})

router.get('/oa/deleteBoat', function (req, response) {
  var boatid = req.query.id;
  request.delete({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats/' + boatid,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    }
  }, (err, res, data) => {
    var result = res.body
    req.session.boats = result
    response.redirect('/oa/boats')
  })

})

router.post('/oa/boatEdit', function (req, response, next) {
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
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})

router.get('/oa/newBoat', function (req, res) {
  if (adminid === '') {
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
})

router.post('/oa/newBoat', function (req, response, next) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
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
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})

//=================================================================================
//  Sections
//=================================================================================

router.get('/oa/sections', async (req, res) => {
  if (adminid === '') {
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
})

router.get('/oa/sectionEdit', function (req, res) {
  if (adminid === '') {
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
})

router.post('/oa/sectionEdit', function (req, response, next) {
  var formData = req.body;
  var sectionid = formData.sectionId;
  formData.sectionId = parseInt(formData.sectionId)
  formData.items = null
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections/' + sectionid,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})

router.get('/oa/deleteSection', function (req, response) {
  var sectionid = req.query.id;
  request.delete({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections/' + sectionid,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    }
  }, (err, res, data) => {
    var result = res.body
    req.session.sections = result
    response.redirect('/oa/sections')
  })

})

router.get('/oa/newSection', function (req, res) {
  if (adminid === '') {
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

})

router.post('/oa/newSection', function (req, response, next) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var formData = req.body;
  formData.items = null
  request.post({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})


//=================================================================================
//  Categories
//=================================================================================
router.get('/oa/categories', async (req, res) => {
  if (adminid === '') {
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
})

router.get('/oa/categoryEdit', function (req, res) {
  if (adminid === '') {
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
})

router.post('/oa/categoryEdit', function (req, response, next) {
  var formData = req.body;
  var categoryid = formData.categoryId;
  formData.categoryId = parseInt(formData.categoryId)
  formData.boats = null
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories/' + categoryid,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})

router.get('/oa/newCategory', function (req, res) {
  if (adminid === '') {
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

})

router.post('/oa/newCategory', function (req, response, next) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var formData = req.body;
  formData.boats = null
  request.post({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
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
})

router.get('/oa/deleteCategory', function (req, response) {
  var sectionid = req.query.id;
  request.delete({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories/' + sectionid,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    }
  }, (err, res, data) => {
    var result = res.body
    req.session.categories = result
    response.redirect('/oa/categories')
  })

})

//=================================================================================
//  Users
//=================================================================================
router.get('/oa/users', async (req, res) => {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetUsers',
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) return error;
    var result = JSON.parse(response.body);
    result.forEach(element => {
      element.role = 'Customer'
      if (element.email == 'admin@maalu.com') {
        element.role = 'Administrator'
      }

    });
    res.render('./oa/user.html', {
      result: result,
      admin: req.session.admin
    })
  });
})

router.get('/oa/userView', async (req, res) => {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var userid = req.query.id;
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetUserById?Id=' + userid,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) return error;
    var result = JSON.parse(response.body);
    res.render('./oa/userView.html', {
      result: result,
      admin: req.session.admin
    })
  });
})
module.exports = router