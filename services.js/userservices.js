
const Expense = require('../model/expense');

const getExpenses = async (req) => {
    try {
      const userId = req.user.id;
      const expenses = await Expense.find({ userId });
      return expenses;
    } catch (err) {
      throw new Error(err);
    }
  };
  
  module.exports = {
    getExpenses,
  };


// const getExpenses =  (req, where) => {
//     return req.user.getExpenses(where);
// }

// module.exports ={
//     getExpenses
// }