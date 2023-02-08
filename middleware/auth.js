const jwt = require('jsonwebtoken');
const User  = require('../model/user');
// const Expense = require('../model/expense');

const autheticate = (req, res, next) => {
    try{
    const token = req.header('Authorization')

    const user = jwt.verify(token, 'D93AA783D5DB71321189EE9971CBDAEB25B5F271CC33EC294D8B84FB6D8D65DD'); 
    
    User.findByPk(user.userId).then(user => {
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