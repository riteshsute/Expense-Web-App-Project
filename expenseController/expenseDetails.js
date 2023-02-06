const expenseData = require('../model/expense');


exports.addExpense = (async (req, res, next) => {
        try {
            if(!req.body.amount){
                throw new Error('amount is mandatory')
            }
        const Amount = req.body.amount;
        const Description = req.body.description;
        const Category = req.body.category;
    
        const data = await expenseData.create( { amount: Amount, description: Description, category: Category } );
        res.status(201).json({ showNewExpenseDetail: data })
        } catch(err){
            console.log(err)
            res.status(500).json({
                error: err
            })
        }
})


exports.getExpense = (async (req, res, next) => {
    try{
    const Expense = await expenseData.findAll();
    res.status(200).json({ allExpenses: Expense })
    }
    catch (err) {
        console.log('get expense is failing', JSON.stringify(err));
        return res.status(500).json({error: err})
    }
})