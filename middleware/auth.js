const jwt = require('jsonwebtoken');
const User  = require('../model/user');
// const Expense = require('../model/expense');
require('dotenv').config();



const autheticate = (req, res, next) => {
    try{
    const token = req.header('Authorization')
    console.log(process.env.TOKEN_SECRET)

    const user = jwt.verify(token, process.env.TOKEN_SECRET); 
    
    User.findById(user.userId).then(user => {
        req.user = user;
        next()
    })
    .catch(err => { throw new Error(err)});
  } catch(err){
    console.log(err);
    return res.status(401).json({ success: false })
  }
}

module.exports = {
    autheticate
}