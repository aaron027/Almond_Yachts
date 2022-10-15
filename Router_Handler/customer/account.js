//======================================================================================
// My Account Block
//======================================================================================
var request = require('request')

/**
 * 
 * Render latest order info
 * @returns 
 */
module.exports.latestOrderInfo = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  var latestOrder = req.session.latestOrder
  var latestBoat = req.session.latestBoat
  var latestCategory = req.session.latestCategory
  var orderid = latestOrder.orderId;
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/OrderDetails/GetOrderDetailsByOrderId?orderId=' + orderid,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, res1) {
    if (error) return error;
    var orderdetails = JSON.parse(res1.body);
    var options = {
      'method': 'GET',
      'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
      'headers': {
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, res2) {
      if (error) return error;
      var items = JSON.parse(res2.body);
      var selectedItemarr = []
      for (var i in items) {
        for (var j in orderdetails) {
          if (items[i].itemId == orderdetails[j].itemId) {
            selectedItemarr.push(items[i])
          }
        }
      }
      var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
        'headers': {
          'Content-Type': 'application/json'
        }
      };
      request(options, function (error, res3) {
        if (error) return error;
        var sections = JSON.parse(res3.body);
        var selectedsections = []
        for (var i in sections) {
          for (var j in selectedItemarr) {
            if (sections[i].sectionId == selectedItemarr[j].sectionId) {
              selectedsections.push(sections[i])
            }
          }
        }
        res.render('latestOrder.html', {
          user: req.session.user,
          latestOrder: latestOrder,
          latestBoat: latestBoat,
          latestCategory: latestCategory,
          selectedsections: selectedsections,
          selectedItemarr: selectedItemarr
        })

      });

    });

  });

}

/**
 * 
 * Render dashboard for my account
 * @returns 
 */
module.exports.renderDashboard = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  var userid = req.session.user.id
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders/GetOrdersByCustomerId?customerId=' + userid,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) return error;
    var orders = JSON.parse(response.body);
    request.get({
      url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, res2, data) => {
      if (error) return error;
      var boats = JSON.parse(res2.body);
      if (orders.length != 0) {
        var latestOrder = orders[orders.length - 1];
        var latestOrderCustomerId = latestOrder.customerId;
        request.get({
          url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
          headers: {
            'Content-Type': 'application/json'
          }
        }, (err, res2, data) => {
          if (error) return error;
          var categories = JSON.parse(res2.body);
          var boatId = latestOrder.boatId;
          var foundBoat = boats.find(element => element.id == boatId);
          var userid = req.session.user.id;
          if (latestOrderCustomerId == userid) {
            req.session.latestOrder = latestOrder
            req.session.latestBoat = foundBoat
            var foundCategory = categories.find(element => element.categoryId == foundBoat.categoryId);
            req.session.latestCategory = foundCategory

            res.render('account.html', {
              user: req.session.user,
              latestOrder: latestOrder,
              foundBoat: foundBoat,
              foundCategory: foundCategory
            })
          } else {
            res.render('account.html', {
              user: req.session.user
            })
          }
        })
      } else {
        res.render('account.html', {
          user: req.session.user
        })
      }

    })
  });
}


/**
 * 
 * The function for rendering setting page
 * @returns 
 */
module.exports.userSetting = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  res.render('setting.html', {
    user: req.session.user
  })
}


/**
 * Render Order history in account block
 */

module.exports.orderHistory = (req, res, next) => {
  if (!req.session.user) {
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
    var orderresult = JSON.parse(response.body);

    var options = {
      'method': 'GET',
      'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
      'headers': {
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, res1) {
      if (error) return error;
      var BoatsResult = JSON.parse(res1.body);
      var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
        'headers': {
          'Content-Type': 'application/json'
        }
      };
      request(options, function (error, res2) {
        if (error) return error;
        var CategoryResult = JSON.parse(res2.body);

        var boatArr = []
        for (var i in BoatsResult) {
          for (var j in orderresult) {
            if (BoatsResult[i].id == orderresult[j].boatId) {
              boatArr.push(BoatsResult[i])
            }
          }
        }
        var categoryArr = []
        for (var i in CategoryResult) {
          for (var j in boatArr) {
            if (CategoryResult[i].categoryId == boatArr[j].categoryId) {
              categoryArr.push(CategoryResult[i])
            }
          }
        }

        // Display order history with reverse chronological order
        orderresult = orderresult.reverse()
        req.session.orderInfo = orderresult

        res.render('order.html', {
          user: req.session.user,
          orderresult: orderresult,
          categoryArr: categoryArr,
          boatArr: boatArr
        })
      });
    });
  });

}

/**
 * The detail for each order History
 */

module.exports.orderHistoryDetail = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  var orderid = req.query.orderid;

  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Orders/' + orderid,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, res1) {
    if (error) return error;
    var orderInfo = JSON.parse(res1.body);
    var orderId = orderInfo.orderId
    var options = {
      'method': 'GET',
      'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/OrderDetails/GetOrderDetailsByOrderId?orderId=' + orderId,
      'headers': {
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, res2) {
      if (error) return error;
      var orderDetails = JSON.parse(res2.body);
      var options = {
        'method': 'GET',
        'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Boats',
        'headers': {
          'Content-Type': 'application/json'
        }
      };
      request(options, function (error, res3) {
        if (error) return error;
        var boats = JSON.parse(res3.body);
        var foundboat;
        for (var i in boats) {
          if (boats[i].id == orderInfo.boatId) {
            foundboat = boats[i];
          }
        }
        var options = {
          'method': 'GET',
          'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Categories',
          'headers': {
            'Content-Type': 'application/json'
          }
        };
        request(options, function (error, res4) {
          if (error) return error;
          var categories = JSON.parse(res4.body);
          var foundCategory;
          for (var i in categories) {
            if (categories[i].categoryId == foundboat.categoryId) {
              foundCategory = categories[i];
            }
          }
          var options = {
            'method': 'GET',
            'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Sections',
            'headers': {
              'Content-Type': 'application/json'
            }
          };
          request(options, function (error, res5) {
            if (error) return error;
            var sections = JSON.parse(res5.body);
            var options = {
              'method': 'GET',
              'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
              'headers': {
                'Content-Type': 'application/json'
              }
            };
            request(options, function (error, res6) {
              if (error) return error;
              var items = JSON.parse(res6.body);
              var selectedItems = []
              for (var i in orderDetails) {
                for (var j in items) {
                  if (orderDetails[i].itemId == items[j].itemId) {
                    selectedItems[i] = items[j];
                  }
                }
              }
              var selectedSections = []
              for (var i in selectedItems) {
                for (var j in sections) {
                  if (selectedItems[i].sectionId == sections[j].sectionId) {
                    selectedSections[i] = sections[j];
                  }
                }
              }
              res.render('orderInfo.html', {
                user: req.session.user,
                orderFound: orderInfo,
                foundboat: foundboat,
                foundCategory: foundCategory,
                selectedSections: selectedSections,
                selectedItems: selectedItems
              })
            });
          });
        });
      });
    });
  });


}

/**
 * Render edit profile page
 */
module.exports.RenderEditProfile = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  res.render('edit.html', {
    user: req.session.user
  })
}

/**
 * The function for editing profile
 */
module.exports.EditProfileForm = (req, response, next) => {
  var formData = req.body;
  formData.id = req.session.user.id
  formData.zipCode = parseInt(formData.zipCode)
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/UpdateUsers',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }, (err, res, data) => {
    var result = res.body
    req.session.user = req.body
    response.redirect('/account')
  })
}

/**
 * The function for editing profile
 */
module.exports.changePwd = function (req, response, next) {
  var formData = req.body;
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/ResetPassword',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }, (err, res, data) => {
    var result = res.body
    if (res.statusCode == 400) {
      response.status(200).json({
        err_code: 1,
        message: 'The current password does not match!'
      })
    }
    response.status(200).json({
      err_code: 0,
      message: 'ok!'
    })
  })
}