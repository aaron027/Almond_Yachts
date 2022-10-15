var express = require('express')
var request = require('request')
var router = express.Router()
var nodemailer = require('nodemailer')
// import login module for customer
var user_Handler = require('./Router_Handler/customer/login')
// import order module for customer
var order_Handler = require('./Router_Handler/customer/order')
// import account module for customer
var account_Handler = require('./Router_Handler/customer/account')
var model_Handler = require('./Router_Handler/customer/model')
// import forget password module for customer
var forgetPwd_Handler = require('./Router_Handler/customer/forgetPwd')
// import register module for customer
var register_Handler = require('./Router_Handler/customer/register')
// import nav menu module for customer
var menu_Handler = require('./Router_Handler/customer/navMenu')
// import login module for admin
var login_admin_Handler = require('./Router_Handler/admin/login')
// import account module for admin
var account_admin_Handler = require('./Router_Handler/admin/account')
// import item module for admin
var item_admin_Handler = require('./Router_Handler/admin/item')
// import supplier module for admin
var supplier_admin_Handler = require('./Router_Handler/admin/supplier')
// import index module for admin
var index_admin_Handler = require('./Router_Handler/admin/index')
// import order module for admin
var order_admin_Handler = require('./Router_Handler/admin/order')
// import boat module for admin
var boat_admin_Handler = require('./Router_Handler/admin/boat')
// import section module for admin
var section_admin_Handler = require('./Router_Handler/admin/section')
// import category module for admin
var category_admin_Handler = require('./Router_Handler/admin/category')
// import user module for admin
var user_admin_Handler = require('./Router_Handler/admin/user')

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
// Admin Section
//=================================================================================

router.get('/oa/index', index_admin_Handler.indexPage)

//=================================================================================
//  Login Block for Admin
//=================================================================================

// Render login page
router.get('/oa/login', login_admin_Handler.renderLoginPage)

// function for login
router.post('/oa/login', login_admin_Handler.loginForm)

// function for logout
router.get('/oa/logout', login_admin_Handler.loginout)


//=================================================================================
//  Account Block for Admin
//=================================================================================

//Render profile page
router.get('/oa/profile', account_admin_Handler.renderProfilePage)

//Edit profile page
router.post('/oa/profile', account_admin_Handler.editAccount)

// Render Account page
router.get('/oa/account', account_admin_Handler.renderAccountPage)

//Render change password page
router.get('/oa/changePwd', account_admin_Handler.renderChangePwd)

// The function to change password for admin
router.post('/oa/changePwd', account_admin_Handler.changePwd)


//=================================================================================
//  Items Block for Admin
//=================================================================================

//Render item page
router.get('/oa/Item', item_admin_Handler.renderItemPage)

//Render edit page
router.get('/oa/itemEdit', item_admin_Handler.renderEditItemPage)

//Render new item page
router.get('/oa/newItem', item_admin_Handler.renderNewItemPage)

// The function to delete item
router.get('/oa/deleteItem', item_admin_Handler.deleteItem)

//The function to add new item
router.post('/oa/newItem', item_admin_Handler.addNewItem)

// The function to edit item
router.post('/oa/itemEdit', item_admin_Handler.editItem)


//=================================================================================
//  Suppliers Block for Admin
//=================================================================================

// Render supplier edit page
router.get('/oa/supplierEdit', supplier_admin_Handler.renderSupplierEditPage)

// The function to edit supplier
router.post('/oa/supplierEdit', supplier_admin_Handler.editSupplier)

// Render supplier list page
router.get('/oa/supplier', supplier_admin_Handler.renderSupplierPage)

// The function to delete supplier
router.get('/oa/deleteSupplier', supplier_admin_Handler.deleteSupplier)

// Render add new supplier page
router.get('/oa/newSupplier', supplier_admin_Handler.renderNewSupplierPage)

// The function to add new supplier
router.post('/oa/newSupplier', supplier_admin_Handler.addNewSupplier)

//=================================================================================
//  Orders Block for Admin
//=================================================================================

// Render Order list page
router.get('/oa/order', order_admin_Handler.renderOrderPage)

//Render order edit page
router.get('/oa/orderEdit', order_admin_Handler.renderOrderEditPage)

// The function to edit order
router.post('/oa/orderEdit', order_admin_Handler.editOrder)

//The function to delete order
router.get('/oa/deleteOrder', order_admin_Handler.deleteOrder)


//=================================================================================
//  Boats Block for Admin
//=================================================================================

// Render boat list page
router.get('/oa/boats', boat_admin_Handler.renderBoatPage)

// Render edit boat page
router.get('/oa/boatEdit', boat_admin_Handler.renderBoatEditPage)

// The function to delete boat
router.get('/oa/deleteBoat', boat_admin_Handler.deleteBoat)

// The function to edit boat
router.post('/oa/boatEdit', boat_admin_Handler.editBoat)

// Render new boat page
router.get('/oa/newBoat', boat_admin_Handler.renderNewBoatPage)

// The function to add a new boat
router.post('/oa/newBoat', boat_admin_Handler.addNewBoat)

//=================================================================================
//  Sections Block for Admin
//=================================================================================

//Render section list page
router.get('/oa/sections', section_admin_Handler.renderSectionPage)

//Render section edit page
router.get('/oa/sectionEdit', section_admin_Handler.renderSectionEditPage)

//The function to edit section
router.post('/oa/sectionEdit', section_admin_Handler.editSection)

// The function to delete section
router.get('/oa/deleteSection', section_admin_Handler.deleteSection)

// Render new section page
router.get('/oa/newSection', section_admin_Handler.renderNewSectionPage)

// The function to add new section
router.post('/oa/newSection', section_admin_Handler.addNewSection)


//=================================================================================
//  Categories Block for Admin
//=================================================================================

// Render category list page
router.get('/oa/categories', category_admin_Handler.renderCategoryPage)

// Render category edit page
router.get('/oa/categoryEdit', category_admin_Handler.renderCategoryEditPage)

// The function to edit page
router.post('/oa/categoryEdit', category_admin_Handler.editCategory)

// Render new category page
router.get('/oa/newCategory', category_admin_Handler.renderNewCategoryPage)

// The function to add new category
router.post('/oa/newCategory', category_admin_Handler.addNewCategory)

// The function to delete category
router.get('/oa/deleteCategory', category_admin_Handler.deleteCategory)

//=================================================================================
//  Users
//=================================================================================

// Render user list page
router.get('/oa/users', user_admin_Handler.renderUserPage)

// The function to view user details
router.get('/oa/userView', user_admin_Handler.viewUser)

module.exports = router