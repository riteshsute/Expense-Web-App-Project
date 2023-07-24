const User = require('../model/user');
const ForgetPassword = require('../model/forgetPassword')
const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name , ispremiumuser }, process.env.TOKEN_SECRET);
  };

  exports.forgetPassword = async (req, res) => {
    try {
      const findEmail = req.body.email;
      const userId = req.user.id; 
  
      const user = await User.findOne({ email: findEmail });
  
      if (user) {
        const id = uuid.v4();
  
        const forgetPasswordRequest = new ForgetPassword({
          _id: id,
          userId: userId,
          isactive: true,
        });
  
        await forgetPasswordRequest.save();
  
        const token = generateAccessToken(user.id, user.name, user.ispremiumuser);
  
        const client = Sib.ApiClient.instance

                const apiKey = client.authentications['api-key'];
        
                apiKey.apiKey = process.env.EMAIL_KEY
        
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
        } catch (err) {
      console.log(err, ' error in forget backend');
      res.status(500).json({ success: false, message: err });
    }
  };
  
  exports.resetPasswordForm = async (req, res, next) => {
    try {
      const id = req.params.id;
  
      const forgetPasswordRequest = await ForgetPassword.findOne({ _id: id });
  
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
      const forgotpasswordrequest = await ForgetPassword.findOne({ _id: resetpasswordid });

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
                    res.status(201).json({ success: true, message: 'Successfully updated the new password'})
                })
            });
        });
      } catch (error) {
      console.log('Error in reset password backend', error);
      res.status(500).json({ success: false, message: error });
    }
  };
  
  


// exports.forgetPassword = async(req, res) => {

//     try {
//         const findEmail = req.body.email;
//         const userId = req.user.id

//         const user = await User.findOne({ where: { email: findEmail}});

//         if(user){
//             const id = uuid.v4();

//         const forgetPasswordRequest = new forgetPasswordModel({
//             id: id,
//             userId: userId,
//             isactive: true
//             });
        


//         await forgetPasswordRequest.save();

//         const token = generateAccessToken(user.id, user.name, user.ispremiumuser);

//         const client = Sib.ApiClient.instance

//         const apiKey = client.authentications['api-key'];

//         apiKey.apiKey = process.env.EMAIL_KEY

//         const tranEmailApi = new Sib.TransactionalEmailsApi();

        
//         const sender = {
//             email: 'riteshspotlight@gmail.com'
//         }

//         const receiver = [{
//             email: findEmail
//         }]

//         const resetUrl = `http://localhost:7000/password/reset-password/${id}`

//         tranEmailApi.sendTransacEmail({
//             sender, 
//             to: receiver,
//             subject: 'Password Reset Link',
//             textContent: `Here is your Password Reset Link: ${resetUrl}`,
//             htmlContent: `Click this link to reset your password: <a href="${resetUrl}"> ${resetUrl} </a>`
//         })

//         res.status(200).send({success: true, message: "Link successfully send to the Email Id"})
//     }
// }
//     catch(err){
//         console.log(err, " error in forgett backend")
//         res.status(500).json({success: false, message: err} )
//     } 
//  } 


//  exports.resetPasswordForm = async (req, res, next) => {
//     try {
//       const id = req.params.id;
  
//       const forgetPasswordRequest = await forgetPasswordModel.findOne({ where: { id } });
  
//       if (forgetPasswordRequest) {
//         await forgetPasswordRequest.update({ isactive: false });
  
//         res.status(200).send(`
//           <html>
//             <form action="/password/updatePassword/${id}" method="get">
//               <label for="newpassword">Enter New password</label>
//               <input name="newpassword" type="password" required></input>
//               <button type="submit">reset password</button>
//             </form>
//           </html>
//         `);
//       } else {
//         res.status(400).send(`<html><p>Invalid password reset link</p></html>`);
//       }
//     } catch (error) {
//       console.log('Error in reset password backend', error);
//       res.status(500).json({ success: false, message: error });
//     } 
//   };




//   exports.resetPassword = async (req, res) => {
//     try {
//         const { newpassword } = req.query;
//         const { resetpasswordid } = req.params;
//         const forgotpasswordrequest = await forgetPasswordModel.findOne({ where: { id: resetpasswordid } });

//         if (!forgotpasswordrequest) {
//             return res.status(404).json({ error: 'No forgot password request found', success: false });
//         }

//         const user = await User.findOne({ where: { id: forgotpasswordrequest.userId } });
//         if (!user) {
//             return res.status(404).json({ error: 'No user found', success: false });
//         }

//         const saltRounds = 10;
//         bcrypt.genSalt(saltRounds, function(err, salt) {
//             if(err){
//                 console.log(err);
//                 throw new Error(err);
//             }
//             bcrypt.hash(newpassword, salt, function(err, hash) {
//                 if(err){
//                     console.log(err);
//                     throw new Error(err);
//                 }
//                 user.update({ password: hash }).then(() => {
//                     forgotpasswordrequest.update({ active: false });
//                     res.status(201).json({ success: true, message: 'Successfully updated the new password'})
//                 })
//             });
//         });
//     }
//     catch (error) {
//         console.log('Error in reset password backend', error);
//         res.status(500).json({ success: false, message: error });
//     }
// }

