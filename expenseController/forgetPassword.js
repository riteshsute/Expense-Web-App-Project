const User = require('../model/user');
const Sib = require('sib-api-v3-sdk');


// const generateAccessToken = (id, name, ispremiumuser) => {
//     return jwt.sign({ userId: id, name: name , ispremiumuser }, 'D93AA783D5DB71321189EE9971CBDAEB25B5F271CC33EC294D8B84FB6D8D65DD');
//   };

exports.forgetPassword = async(req, res) => {

    const token = generateToken();
    console.log(token)

    try {
        const findEmail = req.body.email;

        const client = Sib.ApiClient.instance

        const apiKey = client.authentications['api-key'];

        apiKey.apiKey = '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'

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        
        const sender = {
            email: 'suteritesh@gmail.com'
        }

        const receiver = [{
            email: findEmail
        }]

        tranEmailApi.sendTransacEmail({
            sender, 
            to: receiver,
            subject: 'Password Reset Link',
            textContent: `Here is your Password Reset Link`,
            htmlContent: `Click this link to reset your password: <a href="${getResetUrl(token)}">${getResetUrl(token)}</a>`
        })
        .then()
        .catch()
        res.status(200).send('Password reset email sent!');
    }
    catch(err){
        console.log(" error in forgett backend")
        res.status(500).json({success: false, message: err} )
    } 
} 