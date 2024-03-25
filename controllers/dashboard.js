const User = require("../models/userData");
 const Expense = require('../models/expense')
 const sequelize = require('../util/database'); 
 


const get_Dashboard = async (req,res) => {
  const  t = await sequelize.transaction();
try{
  const All_user = await User.findAll({
    attributes: ['id', 'username', 'total'],
    group: ['User.id'], order: [['total', 'DESC']]
  } ,{ transaction: t });
 
    const transformedResult = All_user.map((user) => ({
      username: user.dataValues.username,
      total_cost: user.dataValues.total,
    }), { transaction: t });
//console.log(transformedResult) 
if(transformedResult){
  res.status(200).json(transformedResult);
  await t.commit();
}
else{
  await t.rollback() ;
}
} 
catch  (err) { 
  await t.rollback();
  console.log(err) }
};

module.exports = get_Dashboard



