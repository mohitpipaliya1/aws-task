const express = require('express')

const app = express();

const multer = require('multer')
require('dotenv/config')
const aws = require('aws-sdk')



const s3= new aws.S3({
    accessKeyId:process.env.AWS_ID,
    secreteAccessKey:process.env.AWS_SECRET
})


const storage = multer.memoryStorage({
     destination : function(req,file,callback){
         callback(null,'');
     }
})

const upload = multer({storage}).single('image')

app.post("/upload",upload,(req,res)=>{
     
     let params = {
         Bucket:process.env.AWS_BUCKETNAME,
         Key: req.file.originalname,
         Body:req.file.buffer
             }
     s3.upload(params,(error,data)=>{
            if(error){
                res.status(500).send(error)
            }

            res.status(200).send(data)
     })

})

app.listen(3000,()=>{
    console.log("port is listening at 3000...")
})