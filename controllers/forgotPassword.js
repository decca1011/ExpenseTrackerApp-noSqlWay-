const uuid = require('uuid');
const bcrypt = require('bcrypt');
const Sib = require('sib-api-v3-sdk') 
const User = require('../models/userData');
const Forgotpassword = require('../models/forgotpassword');

require('dotenv').config();
 

const client = Sib.ApiClient.instance;

const apikey = client.authentications['api-key']

apikey.apiKey = process.env.SENGRID_API_KEY


// const  forget_password_send_email= async (req, res) => {
//     try {
//         const { email } =  req.body;
//         const user = await User.findOne({where : { email }});
//         if(user){
//             const id = uuid.v4();
//             user.createForgotpassword({ id , active: true })
//                 .catch(err => {
//                     throw new Error(err)
//                 })

//             sgMail.setApiKey(process.env.SENGRID_API_KEY)

//             const msg = {
//                 to: email, // Change to your recipient
//                 from: 'deepakpatil101197@gmail.com' ,
//                 subject: 'Sending with SendGrid is Fun',
//                 text: 'and easy to do anywhere, even with Node.js',
//                 html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
//             }

//             sgMail
//             .send(msg)
//             .then((response) => {

//                 // console.log(response[0].statusCode)
//                 // console.log(response[0].headers)
//                 return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

//             })
//             .catch((error) => {
                
            
//                console.log(error)
//                 //throw new Error(error);
//             })

//             //send mail
//         }else {
//             throw new Error('User doesnt exist')
//         }
//     } catch(err){
//         console.error(err)
//         return res.json({ message: err, sucess: false });
//     }

// }


const forget_password_send_email = async (req,res)=>{
   const to_person = req.body.email

   const tranEmailApi = new Sib.TransactionalEmailsApi()

   const sender = {
      email: 'deepakpatil101197@gmail.com',
   }
   const receivers = [{ 
     email:  to_person,
    }]

    try{

      const { email } =  req.body;
      const user = await User.findOne({where : { email }});
      console.log(user.id)
      if(user){
          var id = uuid.v4();
     console.log(uuid.v4)
          user.createForgotpassword({ id , active: true })
              .catch(err => {
                  throw new Error(err)}
                 ) }

      await  tranEmailApi.sendTransacEmail({
         sender,
         to: receivers,
         subject: 'forget fassword',
         textContent: 'hello',
         htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      }).then((result)=>{
         console.log("success", result);
     })
    //console.log(res)
     res.status(201).json({
         success: true,
         message: 'Email sent successfully',
         
       });

    }catch (err ) {
     
      console.log("get error ======> ",err)
      res.status(500).json({ error: 'Failed to add user'} );
    }

}

const resetpassword = (req, res) => {
   const id =  req.params.id;
   console.log("get====>" ,id)
   Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
       if(forgotpasswordrequest) {
           console.log(forgotpasswordrequest)
           forgotpasswordrequest.update({ active: false});
           res.status(200).send(`<html>
                                   <script>
                                       function formsubmitted(e) {
                                           e.preventDefault();
                                           console.log('called')
                                        }
                                   </script>
                                   <form action="/password/updatepassword/${id}" method="get">
                                       <label for="newpassword">Enter New password</label>
                                       <input name="newpassword" type="password" required></input>
                                       <button>reset password</button>
                                   </form>
                                </html>`)
                               res.end()
                             }
                            }); 
                         };


const updatepassword = (req, res) => {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
   try {
       Forgotpassword.findOne({ where : { id: resetpasswordid }})
       .then( resetpasswordrequest => {
           User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
               // console.log('userDetails', user)
         if(user) {
                   //encrypt the password
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                    bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
                  }
         else {
               return res.status(404).json({ error: 'No user Exists', success: false})
            }
           })
       })

   } catch (error) {
       return res.status(403).json( { error, success: false } )
         }
}

module.exports = {
forget_password_send_email,
   updatepassword,
   resetpassword
}

