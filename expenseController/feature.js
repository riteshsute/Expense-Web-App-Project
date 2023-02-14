const User = require('../model/user');
const Expense = require('../model/expense');
const Sequelize = require('../ExpenseUtil/database');


const getUserLeaderboard = async (req, res) => {
    try{
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {}
        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userId]) {
                userAggregatedExpenses[expense.userId] += expense.amount;
            } else {
                userAggregatedExpenses[expense.userId] = expense.amount;
            }
        });
        var userLeaderboardDetails = [];
        users.forEach((user) => {
            
            userLeaderboardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id] || 0 })
        })
        console.log(userAggregatedExpenses)
        userLeaderboardDetails.sort((a, b) => b.total_cost - a.total_cost);
        res.status(202).json(userLeaderboardDetails);
    } catch {
        console.log(err);
        res.status(500).json(err);
    }
}


module.exports = {
    getUserLeaderboard
}