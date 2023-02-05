const User = require('../model/expense');
const Bcrypt = require('bcrypt')

exports.signUpUser = ( async (req, res) => {
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
      res.status(500).json(err)
     }
  })


  exports.loginUser =  ( async (req, res) => {
    try{
    const { email, password } = req.body;

    const user = await User.findAll({ where: { email }})
    console.log(user)
        if (user.length > 0) {
          Bcrypt.compare(password, user[0].password, (err, result) => {
            if(err){
              throw new Error('Something Went Wrong');
            } 
            if(result === true){
              res.status(200).json({ success: true, message: "User logged in successfully" });
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
  
  