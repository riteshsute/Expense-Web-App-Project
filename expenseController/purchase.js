const { NULL } = require('mysql2/lib/constants/types');
const Razorpay = require('razorpay');
const Order = require('../model/orders');
const User = require('../model/user')
const expenseController = require('../expenseController/expense');

const adddemo = expenseController.generateAccessToken
  
exports.purchasePremium = (async (req, res) => {
    try{
        var rzp = new Razorpay({
            key_id: "rzp_test_pvti04oUkfRtpC",  
            key_secret: "wgZ5I8mGPCsizGko1QM0cfPW"
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

// const generateAccessToken = (id, name, ispremiumuser) => {
//     return jwt.sign({ userId: id, name: name , ispremiumuser }, 'D93AA783D5DB71321189EE9971CBDAEB25B5F271CC33EC294D8B84FB6D8D65DD');
//   };
 

exports.updateStatus = (async (req, res) => {
        try {
        const userId = req.user.id;
        const { payment_id, order_id, ispremiumuser} = req.body;
        const order = await Order.findOne({ where: { orderid: order_id}});
        const promise = order.update({ paymentid: payment_id, status:"SUCCESSFUL" })
        const promise1 = req.user.update({ ispremiumuser: true})

        // const promise2 = order.update({ paymentid: payment_id, status:"FAILED" })
        // const promise3 = req.user.update({ ispremiumuser: false})

        
        Promise.all([promise, promise1]).then(() => {
            return res.status(202).json({ sucess: true, message: "TRANSCATION SUCCESSFUL", token: expenseController.generateAccessToken(userId,undefined, true)});
        }).catch((error) => {
            throw new Error(error);
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: "something went wrong", error: err});
    }
})