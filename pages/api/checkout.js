import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Order} from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req,res) {
  if (req.method === 'PUT' ) {
    
    const { _id, products} = req.body;
   
    const orden = Order.findById({_id});
    const {line_items,name,email,city,postalCode,
      streetAddress,country,paid}=orden;
    await Order.updateOne({_id}, {line_items,name,email,city,postalCode,
    streetAddress,country,paid:true});

    const uniqueIds = [...new Set(products)];
    const productsInfos = await Product.find({_id:uniqueIds});
    
    for (const productId of uniqueIds) {
      const productInfo = productsInfos.find(p => p._id.toString() === productId).toObject();
      const quantity = products.filter(id => id === productId)?.length || 0;
      const newStock=productInfo.stock-quantity;
      const newTrending=productInfo.trending+quantity || 0+quantity;
      await Product.updateOne({ _id: productId }, {...productInfo, stock:newStock, trending:newTrending})
    }
    /*
    products.forEach(item => {
      console.log(item.elemento)
    })
    */
      
    res.json(true);
  }else if(req.method !== 'POST' && req.method !== 'PUT'){
    res.json('should be a POST request');
    return;
  }else if(req.method === 'POST'){
    const {
      name,email,city,
      postalCode,streetAddress,country,
      cartProducts,
    } = req.body;
    await mongooseConnect();
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({_id:uniqueIds});
  
    let line_items = [];
    for (const productId of uniqueIds) {
      const productInfo = productsInfos.find(p => p._id.toString() === productId);
      
      const quantity = productsIds.filter(id => id === productId)?.length || 0;
      console.log(productInfo.price*quantity)
      if (quantity > 0 && productInfo) {
        line_items.push({
          quantity,
          price_data: {
            currency: 'PEN',
            product_data: {name:productInfo.title},
            unit_amount: productInfo.price*100,
          },
        });
      }
    }
  
    const orderDoc = await Order.create({
      line_items,name,email,city,postalCode,
      streetAddress,country,paid:false,
    });
  
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: email,
      success_url: process.env.PUBLIC_URL + '/carrito?success=1',
      cancel_url: process.env.PUBLIC_URL + '/carrito?canceled=1',
      metadata: {orderId:orderDoc._id.toString(),test:'ok'},
    });
    //console.log(session)
    res.json({
      productsIds: productsIds,
      orderId:session.metadata.orderId,
      url:session.url,
    })
  }
  

}