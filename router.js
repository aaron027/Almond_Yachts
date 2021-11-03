var express = require('express')
var request = require('request')
var router = express.Router()
var nodemailer = require('nodemailer')
var user_Handler = require('./Router_Handler/customer/login')
var order_Handler = require('./Router_Handler/customer/order')
var account_Handler = require('./Router_Handler/customer/account')
var model_Handler = require('./Router_Handler/customer/model')
var forgetPwd_Handler = require('./Router_Handler/customer/forgetPwd')
var register_Handler = require('./Router_Handler/customer/register')
var menu_Handler = require('./Router_Handler/customer/navMenu')

var apikey = "";
var adminapi = "";
var userid = "";
var adminid = "";

//======================================================================================
// MenuNav Block
// This block contains: Index page,  about page, model page and contact page
//======================================================================================

//Render index page 
router.get('/', menu_Handler.indexPage)

//Render about page 
router.get('/about', menu_Handler.aboutPage)

//Render contact page 
router.get('/contact', menu_Handler.contactPage)

//Render model page 
router.get('/model', model_Handler.modelPage)


//======================================================================================
// Login Block
// This block contains login page, forget password page, forget password result page
// Contains the function for logining in and submit email for resetting password
//======================================================================================

// Render login page
router.get('/login', user_Handler.loginUser)

// Post request for login
router.post('/login', user_Handler.loginUserForm)

// The function for logout
router.get('/logout', user_Handler.logout)

// Render forget password page
router.get('/forgetPwd', forgetPwd_Handler.renderForgetPwd)

// Render forget password result page
router.get('/forgetPwdResult', forgetPwd_Handler.renderForgetPwdResult)

// The function for sending email for reset password
router.post('/forgetPwd', forgetPwd_Handler.forgetPwdForm)

//======================================================================================
// Order Block
// This block contains customization page and order result page
// Contains the function for placing order
//======================================================================================

//Render custom page 
router.get('/custom', menu_Handler.customPage)

// The function for placing order
router.post('/placeOrder', order_Handler.placeOrder)

// Render order result after placing order
router.get('/orderResult', order_Handler.showResult)

//======================================================================================
// My account Block
// This block contains the Dashboard page, setting page, reset password page, 
// order history page, order detail page and latest order detail page
// Contains the function for resetting password and editting profile
//======================================================================================

// Render resetting password page
router.get('/setting', account_Handler.userSetting)

// Render dashboard page
router.get('/account', account_Handler.renderDashboard)

// Render latest order information page
router.get('/latestOrderInfo', account_Handler.latestOrderInfo)

// The function for changing password
router.post('/changePwd', account_Handler.changePwd)

// Render order history page
router.get('/order', account_Handler.orderHistory)

// Render order info page for each order in history
router.get('/orderInfo', account_Handler.orderHistoryDetail)

// Render editing profile page
router.get('/edit', account_Handler.RenderEditProfile)

// The function for editing profile
router.post('/edit', account_Handler.EditProfileForm)

//======================================================================================
// Register Block
//======================================================================================

//Render register page
router.get('/register', register_Handler.renderRegPage)

//The function for registering an account
router.post('/register', register_Handler.userRegForm)

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
      var d = new Date();
      var month = d.getMonth();
      var day = d.getDate();
      var today = d.getFullYear() + '-' + (month < 10 ? '0' : '') + (month + 1) + '-' + (day < 10 ? '0' : '') + day
      var todayOrders = []
      orderresult.forEach(element => {
        sumtotal += element.price;
        var orderDate = element.orderDate.split('T')[0]
        if (orderDate == today) {
          todayOrders.push(element)
        }
      });
      var ordersize = orderresult.length;
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
          sumtotal: sumtotal,
          todayOrders: todayOrders
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
  request(options, function (error, res1) {
    if (error) return error;
    var orders = JSON.parse(res1.body);
    req.session.orders = orders
    request.get({
      url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + adminapi
      }
    }, (err, res2, data) => {
      if (error) return error;
      var boats = JSON.parse(res2.body);
      request(options, function (error, response) {
        if (error) return error;
        var result = JSON.parse(response.body);
        req.session.orders = result
        request.get({
          url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + adminapi
          }
        }, (err, res3, data) => {
          if (error) return error;
          var categories = JSON.parse(res3.body);
          req.session.categories = categories
          var boatarray = [];
          var boatcategoryarr = [];
          orders.forEach(element1 => {
            boats.forEach(element2 => {
              if (element1.boatId == element2.id) {
                boatarray.push(element2)
              }
            });
          });
          boatarray.forEach(element1 => {
            categories.forEach(element2 => {
              if (element1.categoryId == element2.categoryId) {
                boatcategoryarr.push(element2)
              }
            });
          });
          req.session.boats = boats;

          res.render('./oa/order.html', {
            orders: orders,
            boats: boatarray,
            admin: req.session.admin,
            categories: boatcategoryarr
          })
        })

      });
    })

  });
})

router.get('/oa/orderEdit', function (req, res) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  var orderid = parseInt(req.query.id);
  request.get({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders',
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }, (err, res1, data) => {
    var orders = JSON.parse(res1.body)
    var found = orders.find(element => element.orderId == orderid);
    var customerId = found.customerId;

    request.get({
      url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, res2, data) => {
      var boats = JSON.parse(res2.body)
      var boatid = found.boatId;
      var foundBoat = boats.find(element => element.id == boatid);
      req.session.orderSingle = found;
      var categoryid = foundBoat.categoryId;
      request.get({
        url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories/' + categoryid,
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (err, res3, data) => {
        var categoryResult = JSON.parse(res3.body)
        request.get({
          url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/GetUserById?Id=' + customerId,
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          }
        }, (err, res4, data) => {
          var cutomerFound = JSON.parse(res4.body)
          request.get({
            url: 'https://boatconfigure20210930164433.azurewebsites.net/api/OrderDetails/GetOrderDetailsByOrderId?orderId=' + orderid,
            method: 'get',
            headers: {
              'Content-Type': 'application/json'
            }
          }, (err, res5, data) => {
            var orderDetails = JSON.parse(res5.body)

            request.get({
              url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
              method: 'get',
              headers: {
                'Content-Type': 'application/json'
              }
            }, (err, res6, data) => {
              var items = JSON.parse(res6.body)
              var foundArr = []
              for (var i in orderDetails) {
                for (var j in items) {
                  if (orderDetails[i].itemId == items[j].itemId) {
                    foundArr.push(items[j])
                  }
                }
              }
              request.get({
                url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
                method: 'get',
                headers: {
                  'Content-Type': 'application/json'
                }
              }, (err, res7, data) => {
                var sections = JSON.parse(res7.body)
                var foundArrSection = []
                for (var i in foundArr) {
                  for (var j in sections) {
                    if (foundArr[i].sectionId == sections[j].sectionId) {

                      foundArrSection.push(sections[j])
                    }
                  }
                }
                res.render('./oa/orderEdit.html', {
                  admin: req.session.admin,
                  orderSingle: found,
                  categoryInfo: categoryResult,
                  foundBoat: foundBoat,
                  cutomerFound: cutomerFound,
                  foundArr: foundArr,
                  foundArrSection: foundArrSection
                })
              })
            })
          })
        })
      })
    })

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

//======================================================================================
// Change password Block
//======================================================================================

router.get('/oa/changePwd', function (req, res, next) {
  if (adminid === '') {
    return res.redirect('/oa/login')
  }
  res.render('./oa/changePwd.html', {
    admin: req.session.admin
  })
})
router.post('/oa/changePwd', function (req, response, next) {
  var formData = req.body;
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/ResetPassword',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminapi
    },
    body: JSON.stringify(formData)
  }, (err, res, data) => {
    var result = res.body
    req.session.admin = result
    response.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})
module.exports = router