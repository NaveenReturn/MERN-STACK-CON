const catchAsyncError = require('../middlewares/catchAsyncError')
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
//Create New Order - api/v1/order/new
exports.newOrder = catchAsyncError( async (req,res,next)=>{
      const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shppingPrice,
        totalPrice,
        paymentInfo
      } = req.body;         
      
      const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shppingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user.id                               
      })

      res.status(200).json({
          success:true,
          order                         
      })
})

//Get Single Order - api/v1/order/:id
exports.getSingleOrder = catchAsyncError( async (req,res,next)=>{

    const order = await  Order.findById(req.params.id).populate('user','name email')   
    if(!order){
          return next(new ErrorHandler(`Order Not Found With this id: ${req.params.id}`,404))                         
    }
    
    res.status(200).json({
       success:true,
       order                            
    })
})

//Get Loggedin User Order - /api/v1/myorders
exports.myOrders = catchAsyncError( async (req,res,next)=>{
    const orders = await  Order.find({user:req.user.id})   

    
    res.status(200).json({
       success:true,
       orders                            
    })
})

//Admin: Get All Orders - api/v1/orders
exports.orders = catchAsyncError( async (req,res,next)=>{
    const orders = await  Order.find()

    let totalAmount = 0;

    orders.forEach(orders =>{
       totalAmount += orders.totalPrice                           
    })

    res.status(200).json({
       success:true,
       totalAmount,
       orders                            
    })
})

//Admin: Update Order / Order Status - api/v1/order/:id
exports.updateOrder = catchAsyncError( async (req,res,next)=>{
    const order = await  Order.findById(req.params.id);
    
    if(order.orderSatus == "Delivered"){
         return next(new ErrorHandler('Order has been already delivered'))                          
    }

    //Updating the product stock of each order item
    order.orderItems.forEach( async orderItems =>{
       await  updateStock(orderItems.product, orderItems.quantity)                         
    })

    order.orderSatus = req.body.orderSatus;
    order.deliveredAt = Date.now();
     await order.save();

     res.status(200).json({
           success:true                        
     })
})

async function updateStock(productId,quantity){
       const product = await Product.findById(productId);
       product.stock = product.stock - quantity;
       product.save({validateBeforeSave:false})                     
}

//Admin: Delete Order - api/v1/order/:id

exports.deleteOrder = catchAsyncError( async (req,res,next)=>{
    
   const order = await  Order.findByIdAndDelete(req.params.id);
   if(!order){
      return next(new ErrorHandler(`Order has been already delivered`))
   }
     
      res.status(200).json({
          success:true
      })
})