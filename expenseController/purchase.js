const { NULL } = require('mysql2/lib/constants/types');
const Razorpay = require('razorpay');
const Order = require('../model/orders');
const User = require('../model/user')

exports.purchasePremium = (async (req, res) => {
    try{
        var rzp = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_KEY_SECRET
        })
        // console.log(rzp, 'razorpay data is here')
        const amount  = 1000

        rzp.orders.create({ amount, currency: "INR"}, (err, order) => { 
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id, })
            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err) {
        console.log(err);
        res.status(403).json({ message: "something went wrong", error: err})
    }
})
 

exports.updateStatus = (async (req, res) => {
        try {
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({ where: { orderid: order_id}});
        const promise = order.update({ paymentid: payment_id, status:"SUCCESSFUL" })
        const promise1 = req.user.update({ ispremiumuser: true})
    
        Promise.all([promise, promise1]).then(() => {
            return res.status(202).json({ sucess: true, message: "TRANSCATION SUCCESSFUL"});
        }).catch((error) => {
            throw new Error(error);
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: "something went wrong", error: err});
    }
})