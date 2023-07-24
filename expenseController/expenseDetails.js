const expenseData = require('../model/expense');
const mongoose = require('mongoose');
const User = require('../model/user');
// const sequelize = require('../ExpenseUtil/database');
const AWS =  require('aws-sdk');
const UserServices = require('../services.js/userservices');
const S3Services = require('../services.js/S3Services');
const downloadedFilesDb = require('../model/filesDownloaded');
const { NULL } = require('mysql2/lib/constants/types');


const downloadExpenses = async (req, res) => {
    try {
      const userId = req.user.id;
      const isPremium = req.user.ispremiumuser;
  
      // Check if the user is a premium user
      if (!isPremium) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const expenses = await UserServices.getExpenses(req);
      const stringifiedExpenses = JSON.stringify(expenses);
  
      const fileName = `Expense${userId}/${new Date()}.txt`;
  
      const fileURL = await S3Services.uploadToS3(stringifiedExpenses, fileName);
  
      const savingDownloadedFiles = await downloadedFilesDb.create({ fileURL: fileURL, userId });
  
      const fsDownloads = await downloadedFilesDb.find({ userId })
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: 'desc' });

      const totalCount = await downloadedFilesDb.countDocuments({ userId });
  
      const totalPages = Math.ceil(totalCount / limit);
      const DownloadedFilesUrl = {
        fileURL,
        success: true, 
        filesDb: fsDownloads,
        totalPages: totalPages,
        currentPage: page,
      };
  
      res.status(201).json({ fileURL, success: true, DownloadedFilesUrl });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: err });
    }
  };


  const addExpense = async (req, res) => {
    try {
        if (!req.body.amount) {
            throw new Error('amount is mandatory');
        }

        const { amount, description, category } = req.body;
        const userId = req.user._id;

        const newExpense = new expenseData({
            amount: amount,
            description: description,
            category: category,
            userId: userId,
        });

        await newExpense.save();

        const user = await User.findById(userId);
        user.total_expense += amount;
        await user.save();

        res.status(201).json({ showNewExpenseDetail: newExpense });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

// const addExpense = (async (req, res) => {
//     const t = await sequelize.transaction();
//     try {
//             if(!req.body.amount){
//                 throw new Error('amount is mandatory')
//             }
//         const Amount = req.body.amount;
//         const Description = req.body.description;
//         const Category = req.body.category;
//         const userId = req.user.id;
         
        
//         const data = await expenseData.create( { amount: Amount, description: Description, category: Category, userId: userId }, {transaction: t});
//         console.log(data, "inside the cotroller")
//         const userExpenses =  Number(req.user.total_expense) + Number(data.amount);
//         await User.update({
//             total_expense: userExpenses
//         }, {
//             where: {id: req.user.id},
//             transaction: t
//         })
//         console.log(data, "inside the cotroller")
//         await t.commit();
//         res.status(201).json({ showNewExpenseDetail: data});
        
//         } catch(err){
//             console.log(err)
//             await t.rollback();
//             res.status(500).json({ error: err })
//         } 
//     })


const getExpense = async (req, res, next) => {
    try {
        const expenses = await expenseData.find({ userId: req.user._id }).exec();
        // console.log(expenses, 'in the getExpense');
        res.status(200).json({ allExpenses: expenses });
    } catch (err) {
        console.log('getExpense is failing', JSON.stringify(err));
        return res.status(500).json({ error: err });
    }
}

const deleteExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const deleteId = req.params.id;
        console.log(deleteId, 'delete id')

        const expense = await expenseData.findById(deleteId);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        const user = await User.findById(req.user._id);
        user.total_expense -= expense.amount;
        await user.save();

     
        await expense.deleteOne();

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

// const deleteExpense = (async (req, res) => {
//     const t = await sequelize.transaction();
//     try{
//         const deleteId = req.params.id;
//         const expense = await expenseData.findOne({ where: {id: deleteId}})
//         const userDb = await User.findOne({ where: { id: req.user.id}});

//         const userExpenses =  Number(userDb.total_expense) - Number(expense.amount);

//         await User.update({
//             total_expense: userExpenses
//         }, {
//             where: {id: req.user.id},
//             transaction: t
//         })
//         await expenseData.destroy({where: { id: deleteId }})
//         await t.commit();
//         res.status(200).json({success: true})

//     }
//     catch(err) {
//         console.log(err)
//         await t.rollback();
//        return res.status(400).json({error: 'id is missing'})
//     }
// })


module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    downloadExpenses
}


