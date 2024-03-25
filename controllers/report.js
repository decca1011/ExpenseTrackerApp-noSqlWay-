 
const getExpense = require('./expense')

const  get_your_report = async (req, res) => {  
   try { 
               
       await  getExpense.getAllExpense(req,res)
   
     } catch (error) {
       console.error('Error retrieving expense data:', error);
       res.status(500).json({ error: 'Failed to retrieve expense data' });
     }

}

module.exports = {
 get_your_report
}
