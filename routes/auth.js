const express = require('express');
const multer = require('multer')
const path = require('path')

const upload = multer({storage:multer.diskStorage({
     destination:function(req,res,cb){
          cb(null,path.join(__dirname,'..','upload/user'))
     },
     filename:function(req,file,cb){
           cb(null,file.originalname)                        
     }                              
})})
const { registerUser,loginUser, logoutUser, forgotPassword, resetPassword,
                                    getuserProfile, changePassword,
                                     updateProfile, getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/authController');
// const { forgotPassword } = require('../middlewares/authenticate');
const router = express.Router();
const {isAuthenticatedUser,authorizeRoles} = require('../middlewares/authenticate')

router.route('/register').post(upload.single('avatar'),registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myprofile').get(isAuthenticatedUser, getuserProfile);
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/myprofile').get(isAuthenticatedUser, getuserProfile);
router.route('/update').put(isAuthenticatedUser, updateProfile);

//Admin routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'), getUser);
router.route('/admin/user/:id').put(isAuthenticatedUser,authorizeRoles('admin'), updateUser);
router.route('/admin/user/:id').delete(isAuthenticatedUser,authorizeRoles('admin'), deleteUser);
module.exports = router;