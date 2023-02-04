const User = require('../model/expense');

exports.signUpUser = ('/expense/signup', async (req, res, next) => {
    const userData = req.body;

    console.log(userData)

    const existingUser = await User.findOne({ where: { email: userData.email } });
    
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists'
      });
    } 
    
    const user = await User.create(userData);

    res.status(201).json({
      message: 'User created successfully'
    });
  })


  exports.loginUser =  ('/expense/login', async (req, res, next) => {
    const { email, password } = req.body;
    console.log()
  


    User.findOne({ where: { email, password }  })
      .then(user => {
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
        // else if (password === password){
        //   console.log('password matched');
        //   return res.status(201).json({ message: "password matched" })
        // }
        res.json({ message: "Login successful" });
      })
      .catch(error => {
        res.status(404).json({ message: error.message + 'user not found'});
      });
  });
  