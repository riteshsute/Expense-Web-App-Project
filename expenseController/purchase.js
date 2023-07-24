const { NULL } = require('mysql2/lib/constants/types');
const Razorpay = require('razorpay');
const Order = require('../model/orders');
const User = require('../model/user')
const expenseController = require('../expenseController/expense');

exports.purchasePremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        console.log(rzp, 'razorpay data is here');
        const amount = 1000;

        const order = await rzp.orders.create({ amount, currency: "INR" });
        const newOrder = new Order({ orderid: order.id, status: 'PENDING', user: req.user._id });
        await newOrder.save();

        return res.status(201).json({ order, key_id: rzp.key_id });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "something went wrong", error: err });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const { payment_id, order_id, ispremiumuser } = req.body;
        const order = await Order.findOne({ orderid: order_id });

        let promise;
        if (ispremiumuser) {
            promise = order.updateOne({ paymentid: payment_id, status: "SUCCESSFUL" });
            await User.findByIdAndUpdate(userId, { ispremiumuser: true });
        } else {
            promise = order.updateOne({ paymentid: payment_id, status: "FAILED" });
            await User.findByIdAndUpdate(userId, { ispremiumuser: false });
        }

        await Promise.all([promise]);
        return res.status(202).json({ sucess: true, message: "TRANSACTION SUCCESSFUL", token: expenseController.generateAccessToken(userId, undefined, true) });
    } catch (err) {
        res.status(403).json({ message: "something went wrong", error: err });
    }
};


// exports.purchasePremium = (async (req, res) => {
//     try{
//         var rzp = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,  
//             key_secret: process.env.RAZORPAY_KEY_SECRET
//         })
//         console.log(rzp, 'razorpay data is here')
//         const amount  = 1000 

//         rzp.orders.create({ amount, currency: "INR"}, (err, order) => { 
//             if(err) {
//                 throw new Error(JSON.stringify(err));
//             }
//             req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
//                 return res.status(201).json({ order, key_id: rzp.key_id, })
//             }).catch(err => {
//                 throw new Error(err)
//             })
//         })
//     } catch(err) {
//         console.log(err);
//         res.status(403).json({ message: "something went wrong", error: err})
//     }
// })

// // const generateAccessToken = (id, name, ispremiumuser) => {
// //     return jwt.sign({ userId: id, name: name , ispremiumuser }, 'D93AA783D5DB71321189EE9971CBDAEB25B5F271CC33EC294D8B84FB6D8D65DD');
// //   };
 

// exports.updateStatus = (async (req, res) => {
//         try {
//         const userId = req.user.id;
//         const { payment_id, order_id, ispremiumuser} = req.body;
//         const order = await Order.findOne({ where: { orderid: order_id}});
//         let promise;

//         if (ispremiumuser) {
//             promise = order.update({ paymentid: payment_id, status:"SUCCESSFUL" });
//             req.user.update({ ispremiumuser: true});
//         } else {
//             promise = order.update({ paymentid: payment_id, status:"FAILED" });
//             req.user.update({ ispremiumuser: false});
//         }

        
//         Promise.all([promise]).then(() => {
//             return res.status(202).json({ sucess: true, message: "TRANSCATION SUCCESSFUL", token: expenseController.generateAccessToken(userId,undefined , true)});
//         }).catch((error) => {
//             throw new Error(error);
//         })
//     } catch(err){
//         res.status(403).json({ message: "something went wrong", error: err});
//     }
// })