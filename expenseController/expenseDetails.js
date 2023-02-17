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
    console.log('up on the user>>>>>>', req.user.id)
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
    try{
        const deleteId = req.params.id;
        console.log(deleteId, 'in the destroy')
        await expenseData.destroy({where: { id: deleteId }})
        res.status(200).json({success: true})
    }
    catch(err) {
       return res.status(400).json({error: 'id is missing'})
    }
})

