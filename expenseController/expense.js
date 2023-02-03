const Expense = require('../model/expense');

exports.signUpUser = ('/expense/signup', async (req, res) => {
    const userData = req.body;

    console.log(userData)

    const existingUser = await Expense.findOne({ where: { email: userData.email } });
    
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }
    
    const user = await Expense.create(userData);

    res.status(201).json({
      message: 'User created successfully'
    });
  })