const User = require('../model/user');
const Bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { name } = require('ejs');


const signUpUser = ( async (req, res) => {
    const { name, email, password, phonenumber} = req.body;
    // console.log(userData)
    const existingUser = await User.findOne({ where: { email: email } });
    try{
      if (existingUser) {
        return res.status(400).json({
          error: 'User already exists'
        });
      } 
        Bcrypt.hash(password, 10, async(err, hash) => {
          console.log(err)
          const user = await User.create({name, email, password: hash, phonenumber});
        
          res.status(201).json({
          message: 'User created successfully'
        })
      });
    } catch(err) {
      res.status(500).json(err, 'in post error')
     }
  })


  const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name , ispremiumuser }, 'D93AA783D5DB71321189EE9971CBDAEB25B5F271CC33EC294D8B84FB6D8D65DD');
  };

  const loginUser =  ( async (req, res) => {
    try{
    const { email, password, ispremiumuser} = req.body;

    console.log(ispremiumuser)

    const user = await User.findAll({ where: { email }})
    console.log(user)
        if (user.length > 0) {
          Bcrypt.compare(password, user[0].password, (err, result) => {
            if(err){
              throw new Error('Something Went Wrong');
            } 
            if(result === true){
              res.status(200).json({ success: true, message: "User logged in successfully", token: generateAccessToken( user[0].id, user[0].name, user[0].ispremiumuser )});
            } else {
              return res.status(400).json({ success: false, message: "Password not matched" });
            }
          }) 
        } else {
           return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch(err) {
      res.status(500).json({success: false, message: err} )
    }
  })
  

  module.exports = {
    signUpUser,
    generateAccessToken,
    loginUser
  }