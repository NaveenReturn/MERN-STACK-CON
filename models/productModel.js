const mongoose = require('mongoose');

const productSchem = new mongoose.Schema({
     name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trime:true,
        maxLength:[100,"product name cannot exced 100 character"],

     },
     price:{
        type:Number,
        required:true,
        default:0.0                            
     },
     description:{
         type:String,
         required:[true,"please enter product description"]                          
     },
     ratings:{
         type:Number,
         default:0                          
     },
     images:[
        {
            image: {
            type:String,
            required:true                       
         }                            
        }                          
     ],
     category:{
         type:String,
         required:[true,"please enter product category"],
         enum:{
            values:[
                'Electonics',
                'Mobile Phones',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Book',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'                   
            ],
            message:"Please select correct category"                       
         }                          
     },
     seller:{
        type:String,
        required:[true,'please enter product seller']                           
     },
     stock:{
         type:Number,
         required:[true,'please enter product stock'],
         maxLength:[20,'product stock cannot exceed 20']                          
     },
     numOfReviews:{
         type:Number,
         default:0                          
     },
     reviews:[
         {
             user:mongoose.Schema.Types.ObjectId,                

             rating:{
                 type:String,
                 required:true                  
             },
             comment:{
               type:String,
               required:true                    
             }                      
         }                          
     ],
     user:{
        type:mongoose.Schema.Types.ObjectId
     }
     ,
     createdAt:{
         type:Date,
         default:Date.now()                          
     }                              
})
let schema = mongoose.model('product',productSchem)
module.exports = schema