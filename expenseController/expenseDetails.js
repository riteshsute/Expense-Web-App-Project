const expenseData = require('../model/expense');
const User = require('../model/user');
const sequelize = require('../ExpenseUtil/database')


exports.addExpense = (async (req, res) => {
    const t = await sequelize.transaction();
    try {
            if(!req.body.amount){
                throw new Error('amount is mandatory')
            }
        const Amount = req.body.amount;
        const Description = req.body.description;
        const Category = req.body.category;
        const userId = req.user.id;
        
        
        const data = await expenseData.create( { amount: Amount, description: Description, category: Category, userId: userId }, {transaction: t});
        const userExpenses =  Number(req.user.total_expense) + Number(data.amount);
        await User.update({
            total_expense: userExpenses
        }, {
            where: {id: req.user.id},
            transaction: t
        })

        await t.commit();
        res.status(201).json({ showNewExpenseDetail: data});
        
        } catch(err){
            console.log(err)
            await t.rollback();
            res.status(500).json({ error: err })
        } 
    })


exports.getExpense = (async (req, res, next) => {
    
    try{
        // console.log(req.user.id, 'inside on the user')
    const Expense = await expenseData.findAll({ where: {userId: req.user.id }});
    res.status(200).json({ allExpenses: Expense })
    }
    catch (err) {
        console.log('get expense is failing', JSON.stringify(err));
        return res.status(500).json({error: err})
    }
})


exports.deleteExpense = (async (req, res, next) => {
    const t = await sequelize.transaction();
    try{
        const deleteId = req.params.id;
        const userDb = await User.findOne({ where: { id: req.user.id}});
        console.log(">>>>>>>>>>>", userDb)
        const userExpenses =  Number(userDb.total_expense) - Number(expenseData.amount);
        await expenseData.destroy({where: { id: deleteId }})
        console.log(userExpenses, "expensee")
        await User.update({
            total_expense: userExpenses
        }, {
            where: {id: req.user.id},
            transaction: t
        })

        await t.commit();
        res.status(200).json({success: true})

    }
    catch(err) {
        console.log(err)
        await t.rollback();
       return res.status(400).json({error: 'id is missing'})
    }
})



// const t = await sequelize.transaction();
//     try {
//         const deleteId = req.params.id;
//         const expense = await expenseData.findOne({ where: { id: deleteId } });
        
//         if (!expense) {
//             throw new Error('Expense not found');
//         }
//         console.log(req.user, " in data ")
//         const user = await User.findOne({ where: { id: req.user.id } });

//         if (!user) {
//             throw new Error('User not found');
//         }

//         const userDeletedExpenses = Number(user.total_expense) - Number(expense.amount);

//         await expenseData.destroy({ where: { id: deleteId } });

//         await User.update(
//             { total_expense: userDeletedExpenses },
//             { where: { id: user.id }, transaction: t }
//         );

//         await t.commit();
//         res.status(200).json({ success: true });
//     } catch (err) {
//         console.log(err); 
//         await t.rollback();
//         return res.status(400).json({ error: err.message });
//     }
// })
// )


