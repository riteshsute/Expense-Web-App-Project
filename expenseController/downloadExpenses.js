const expenseData = require('../model/expense');
const User = require('../model/user');
const sequelize = require('../ExpenseUtil/database');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser: ispremiumuser },
    'D93AA783D5DB71321189EE9971CBDAEB25B5F271CC33EC294D8B84FB6D8D65DD'
  );
};

exports.nodownloadExpenses = async (req, res, next) => {
  try {
    const premiumuser = await User.findOne();
    if (!premiumuser) {
      return res.status(401).json('User is not premium');
    }

    const userExpenses = await expenseData.findAll({
      where: { userId: premiumuser.id },
    });

    const fileName = `${premiumuser.name}-expenses-${new Date().toISOString()}.json`;
    const downloadsDir = path.join(__dirname, '..', 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }
    
    const filePath = path.join(downloadsDir, fileName);

    const writeStream = fs.createWriteStream(filePath);

    writeStream.write(JSON.stringify(userExpenses), 'utf-8');

    writeStream.on('finish', () => {
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error(err);
        }
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    });

    writeStream.end();
  } 
  catch (err) {
    console.log(err);
    res.status(500).json('Server Error');
  }
};
