const User = require('../model/user');
const Expense = require('../model/expense');

const getUserLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: 'expenses',
          localField: '_id',
          foreignField: 'userId',
          as: 'expenses',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          total_expense: { $sum: '$expenses.amount' },
        },
      },
      {
        $sort: { total_expense: -1 },
      },
    ]);

    res.status(202).json(leaderboard);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getUserLeaderboard,
};