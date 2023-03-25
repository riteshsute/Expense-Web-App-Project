const path = require('path');

const express = require('express');

const fs = require('fs')

const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const app = express()

const helmet = require('helmet')

const compression = require('compression');

const morgan = require('morgan');

const cors = require('cors')

app.use(cors()); 

const expenseRoutes = require('./expenseRoutes/expense');
const expenseDetailRoute = require('./expenseRoutes/expenseDetails');
const purchaseRoutes = require('./expenseRoutes/purchase');
const leaderboardRoutes = require('./expenseRoutes/feature');
const forgetPasswordRoutes = require('./expenseRoutes/forgetPassword');

const Expense = require('./model/expense');
const User = require('./model/user');
const Order = require('./model/orders');
const forgetPasswordRequest = require('./model/forgetPassword');
const filesDownloaded = require('./model/filesDownloaded');

const sequelize = require('./ExpenseUtil/database');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
    
const accessLogStream = fs.createWriteStream(  
    path.join(__dirname, 'access.log'), 
    { flags: 'a' }  
);

app.use(morgan('combined', { stream: accessLogStream}))
app.use(helmet());
app.use(compression());
app.use(expenseRoutes);
app.use(expenseDetailRoute);
app.use(purchaseRoutes);
app.use(leaderboardRoutes); 
app.use('/password', forgetPasswordRoutes); 

app.use((req, res) => {
  console.log('urrrlll', req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`)); 
}); 
 
User.hasMany(Expense);
Expense.belongsTo(User); 

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgetPasswordRequest);
forgetPasswordRequest.belongsTo(User);

User.hasMany(filesDownloaded);
filesDownloaded.belongsTo(User);
 
   
sequelize
//   .sync({ force: true })   
    .sync() 
    .then(result => { 
        app.listen(process.env.PORT || 7000);
    }) 
    .catch(err => console.log(err));  