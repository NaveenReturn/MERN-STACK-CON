const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productsController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate')

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/product/:id').put(updateProduct)
router.route('/product/:id').delete(deleteProduct)
router.route('/review').put(isAuthenticatedUser, createReview)
router.route('/reviews').get(getReviews)
router.route('/review').get(deleteReview)

//Admin
router.route('/admin/products/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);
module.exports = router