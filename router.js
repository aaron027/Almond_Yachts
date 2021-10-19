var express = require('express')
// var User = require('./models/user')
// var md5 = require('blueimp-md5')
var request = require('request')
// var axios = require('axios')

var router = express.Router()

var apikey = "";

router.get('/', function (req, res, next) {
  res.render('index.html', {
    user: req.session.user
  })
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
        response.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      }
    })
  })
})

//======================================================================================
// Register Block
//======================================================================================

router.get('/register', function (req, res, next) {
  res.render('register.html')
})
router.get('/setting', function (req, res) {
  res.render('setting.html', {
    user: req.session.user
  })
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

router.get('/logout', function (req, res) {
  req.session.user = null
  res.redirect('/login')
})

router.get('/edit', function (req, res) {
  res.render('edit.html', {
    user: req.session.user
  })
})

router.post('/edit', function (req, res, next) {
  request.put({
    url: 'https://boatconfigure20210930164433.azurewebsites.net/api/Authentication/UpdateUsers',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apikey
    },
    body: JSON.stringify(req.body)
  }, (err, res, data) => {
    var result = JSON.parse(res.body);
    // if (result.status === 401) {
    //   response.status(200).json({
    //     err_code: 1,
    //     message: 'The email exits!'
    //   })
    // } else {
    //   var user = JSON.parse(res.body)
    //   req.session.user = user;
    //   response.status(200).json({
    //     err_code: 0,
    //     message: 'OK'
    //   })
    // }
  })
})

//======================================================================================
// Customization Block
//======================================================================================

router.get('/custom', async (req, res) => {
  var options = {
    'method': 'GET',
    'url': 'https://boatconfigure20210930164433.azurewebsites.net/api/Items',
    'headers': {
      'Authentication': 'Bearer ' + apikey,
      'Content-Type': 'application/json'
    }
  };
  request(options, function (error, response) {
    if (error) return error;
    var result = JSON.parse(response.body);
    res.render('customization.html', {
      result: result,
      user: req.session.user
    })
  });
})

router.get('/about', function (req, res) {
  res.render('about.html', {
    user: req.session.user
  })
})

router.get('/account', function (req, res) {
  res.render('account.html', {
    user: req.session.user
  })
})

router.get('/contact', function (req, res) {
  res.render('contact.html', {
    user: req.session.user
  })
})

router.get('/pwdReset', function (req, res) {
  res.render('pwdReset.html', {
    user: req.session.user
  })
})

router.get('/oa/index', function (req, res) {
  res.render('./oa/index.html', {
    user: req.session.user
  })
})

router.get('/oa/login', function (req, res) {
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
    apikey = data;
    var username = JSON.parse(options.body).email
    if (username != 'admin@maalu.com') {
      return response.status(200).json({
        err_code: 2,
        message: 'No Authorization!'
      })
    }
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
        response.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      }
    })
  })
})

router.get('/oa/logout', function (req, res) {
  req.session.user = null
  res.redirect('/oa/login')
})

router.get('/oa/order', function (req, res) {
  res.render('./oa/order.html', {
    user: req.session.user
  })
})

router.get('/oa/user', function (req, res) {
  User.find(function (err, users) {
    if (err) {
      res.status(500).send('server error')
    }
    res.render('./oa/user.html', {
      user: req.session.user,
      users: users
    })
  })
})

router.get('/oa/user/delete', function (req, res) {
  User.findByIdAndRemove(req.query.id.replace(/"/g, ""), function (err) {
    if (err) {
      res.status(500).send('server error')
    }
    res.redirect('/oa/user')
  })
})

router.get('/oa/user/edit', function (req, res) {
  User.findById(req.query.id.replace(/"/g, ""), function (err, users) {
    if (err) {
      res.status(500).send('server error')
    }
    res.render('./oa/profile.html', {
      users: users,
      user: req.session.user
    })
  })
})

router.get('/oa/user/new', function (req, res) {

  res.render('./oa/addUser.html', {
    user: req.session.user
  })
})

router.get('/oa/profile', function (req, res) {
  res.render('./oa/profile.html', {
    user: req.session.user
  })
})

router.post('/oa/profile', function (req, res, next) {
  var body = req.body
  console.log(body)
  User.findOneAndUpdate({
    email: body.email
  }, body, { returnOriginal: false, new: true }, function (err, user) {
    if (err) {
      next(err)
    }
    console.log(user)
    req.session.user = user
    res.redirect('/oa/account')
  })
})

router.get('/oa/account', function (req, res) {
  res.render('./oa/account.html', {
    user: req.session.user
  })
})

router.get('/oa/supplier', function (req, res) {
  res.render('./oa/supplier.html', {
    user: req.session.user
  })
})

module.exports = router