
const downloadModel = require('../models/download')
 
const get_link= async (req,res) => {
   try {
      // Find all expenses associated with the user
      const download_link = await downloadModel.findAll({ 
        where: { userId: req.user.id } , 
        attributes:['id','downloadlink']
       });
 
      // Map the expenses to a desired format
      const Link_Data = download_link.map(get_link => ({
         id: get_link.id,
         downloadLink: get_link.downloadlink
      }));
       
      return Link_Data;

   }
   catch (err ) {
      console.error('Error retrieving expense data:', err);
      res.status(500).json({ error: 'Failed to retrieve expense data' });
   }
}

module.exports = {
   get_link
}