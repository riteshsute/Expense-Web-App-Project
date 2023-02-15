const User = require('../model/user');
const Expense = require('../model/expense');
const Sequelize = require('../ExpenseUtil/database');
const sequelize = require('sequelize');


const getUserLeaderboard = async (req, res) => {
    try{
        const leaderBoardofUsers = await User.findAll({
                attributes: ["id", "name", [sequelize.fn('sum', sequelize.col('amount')), 'total_cost' ]],
                include: [
                    {
                        model: Expense,
                        attributes: []
                    }
                ],
                group:['user.id'],
                order:[[sequelize.col('total_cost'), 'DESC']]
            })
             res.status(202).json(leaderBoardofUsers);

    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}


module.exports = {
    getUserLeaderboard
}