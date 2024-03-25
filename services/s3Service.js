
// const AWS = require('aws-sdk')

// const uploadToS3 = async (data, filename) => {
//    const BUCKET_NAME = process.env.BUCKET_NAME
//    const IAM_USER_KEY =  process.env.IAM_USER_KEY
//    const IAM_USER_SECRET = process.env.IAM_USER_SECRET
//    const s3bucket = new AWS.S3({
//      accessKeyId: IAM_USER_KEY,
//      secretAccessKey: IAM_USER_SECRET,
//    });
 
  
//  var params = {
//      Bucket: BUCKET_NAME,
//      Key: filename,
//      Body: data, // Convert data to Buffer
//      ACL: 'public-read'
//  }
//  return  new Promise ((resolve , reject) => {  
//  //  console.log('Uploading to S3:', filename, 'Data Length:', data); // Add this line for debugging
 
//    s3bucket.upload( params,  (err, s3response) => {
//      if (err) {
//        console.log("error", err);
//        reject(err)
//      } else {
//        console.log("Successfully uploaded data to ", s3response);
//        resolve(s3response.Location)
//      }
//    });
 
//  })
 
//  }


//  module.exports = {
//    uploadToS3
//  }