const User = require('../model/user');
const forgetPasswordModel = require('../model/forgetPassword')
const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config();

const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name , ispremiumuser }, process.env.TOKEN_SECRET);
  };

exports.forgetPassword = async(req, res) => {

    try {
        const findEmail = req.body.email;
        const userId = req.user.id

        const user = await User.findOne({ where: { email: findEmail}});

        if(user){
            const id = uuid.v4();

        const forgetPasswordRequest = new forgetPasswordModel({
            id: id,
            userId: userId,
            isactive: true
            });
        


        await forgetPasswordRequest.save();

        const token = generateAccessToken(user.id, user.name, user.ispremiumuser);

        const client = Sib.ApiClient.instance

        const apiKey = client.authentications['api-key'];

        apiKey.apiKey = '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'

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        
        const sender = {
            email: 'riteshspotlight@gmail.com'
        }

        const receiver = [{
            email: findEmail
        }]

        const resetUrl = `http://localhost:7000/password/reset-password/${id}`

        tranEmailApi.sendTransacEmail({
            sender, 
            to: receiver,
            subject: 'Password Reset Link',
            textContent: `Here is your Password Reset Link: ${resetUrl}`,
            htmlContent: `Click this link to reset your password: <a href="${resetUrl}"> ${resetUrl} </a>`
        })

        res.status(200).send({success: true, message: "Link successfully send to the Email Id"})
    }
}
    catch(err){
        console.log(err, " error in forgett backend")
        res.status(500).json({success: false, message: err} )
    } 
 } 


 exports.resetPasswordForm = async (req, res, next) => {
    try {
      const id = req.params.id;
      console.log(id, 'renderresetPassword')
  
      const forgetPasswordRequest = await forgetPasswordModel.findOne({ where: { id } });
  
      if (forgetPasswordRequest) {
        await forgetPasswordRequest.update({ isactive: false });
  
        res.status(200).send(`
          <html>
            <form action="/password/updatePassword/${id}" method="get">
              <label for="newpassword">Enter New password</label>
              <input name="newpassword" type="password" required></input>
              <button type="submit">reset password</button>
            </form>
          </html>
        `);
      } else {
        res.status(400).send(`<html><p>Invalid password reset link</p></html>`);
      }
    } catch (error) {
      console.log('Error in reset password backend', error);
      res.status(500).json({ success: false, message: error });
    } 
  };




  exports.resetPassword = async (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        console.log('in the reset pass fun', newpassword, resetpasswordid)
        const forgotpasswordrequest = await forgetPasswordModel.findOne({ where: { id: resetpasswordid } });

        if (!forgotpasswordrequest) {
            return res.status(404).json({ error: 'No forgot password request found', success: false });
        }

        const user = await User.findOne({ where: { id: forgotpasswordrequest.userId } });
        if (!user) {
            return res.status(404).json({ error: 'No user found', success: false });
        }

        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err){
                console.log(err);
                throw new Error(err);
            }
            bcrypt.hash(newpassword, salt, function(err, hash) {
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                user.update({ password: hash }).then(() => {
                    forgotpasswordrequest.update({ active: false });
                    res.status(201).json({message: 'Successfully updated the new password'})
                })
            });
        });
    }
    catch (error) {
        console.log('Error in reset password backend', error);
        res.status(500).json({ success: false, message: error });
    }
}

