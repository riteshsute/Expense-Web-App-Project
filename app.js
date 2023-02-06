const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const app = express()

const cors = require('cors')

app.use(cors());

const expenseRoutes = require('./expenseRoutes/expense');
const expenseDetailRoute = require('./expenseRoutes/expenseDetails')

const sequelize = require('./ExpenseUtil/database');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.use(expenseRoutes);
app.use(expenseDetailRoute);

  
sequelize
//   .sync({ force: true })
    .sync()
    .then(result => {
        app.listen(7000);
    })
    .catch(err => console.log(err));