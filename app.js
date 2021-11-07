var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var router = require('./router')
var template = require('art-template')

var app = express()

app.use(express.urlencoded({ extended: false }))

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use(session({
  secret: 'almondboats',
  resave: false,
  saveUninitialized: true
}))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))

// The function to format date with the format of 'yyyy-mm-dd'
template.defaults.imports.getDate = (dateTime) => {
  const datetime = new Date(dateTime)
  const year = datetime.getFullYear()
  const month = ("0" + (datetime.getMonth() + 1)).slice(-2)
  const date = ("0" + datetime.getDate()).slice(-2)
  const hour = ("0" + datetime.getHours()).slice(-2)
  const minute = ("0" + datetime.getMinutes()).slice(-2)
  const second = ("0" + datetime.getSeconds()).slice(-2)
  return year + "-" + month + "-" + date
}

// The function to format date with the format of 'yyyy-mm-dd HH:MM:ss'
template.defaults.imports.getDateTime = (dateTime) => {
  const datetime = new Date(dateTime)
  const year = datetime.getFullYear()
  const month = ("0" + (datetime.getMonth() + 1)).slice(-2)
  const date = ("0" + datetime.getDate()).slice(-2)
  const hour = ("0" + datetime.getHours()).slice(-2)
  const minute = ("0" + datetime.getMinutes()).slice(-2)
  const second = ("0" + datetime.getSeconds()).slice(-2)
  return year + "-" + month + "-" + date + ' ' + hour + ':' + minute + ':' + second
}

// The function to format date with the format of month name, day and date
template.defaults.imports.getMonthDate = (dateTime) => {
  const datetime = new Date(dateTime)
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday",
    "Sunday"
  ];
  var monthname = monthNames[datetime.getMonth()];
  const year = datetime.getFullYear()
  const day = dayNames[datetime.getDay()]
  const month = ("0" + (datetime.getMonth() + 1)).slice(-2)
  const date = ("0" + datetime.getDate()).slice(-2)
  const hour = ("0" + datetime.getHours()).slice(-2)
  const minute = ("0" + datetime.getMinutes()).slice(-2)
  const second = ("0" + datetime.getSeconds()).slice(-2)
  return day + ", " + date + ' ' + monthname
}

// The function to format money
template.defaults.imports.moneyFormat = (money) => {
  if (money) {
    return '$' + money.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  return "0.00";
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  var _send = res.send;
  var sent = false;
  res.send = function (data) {
    if (sent) return;
    _send.bind(res)(data);
    sent = true;
  };
  next();
});


app.use(router)


app.listen('3000', function () {
  console.log('The server started at port 3000.....')
})