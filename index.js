
// import express (after npm install express)
const express = require('express');
// import { PDFDocument } from 'pdf-lib'
const PDFLib = require('pdf-lib');
var path = require("path");
const fs = require('fs/promises');
const User = require('./userModel');
var fss = require('fs');

const PDFDocument = PDFLib.PDFDocument;
// create new express app and save it as "app"
const app = express();
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
var mailer = require('nodemailer');
const { TextAlignment } = require('pdf-lib');
let transporter = mailer.createTransport({
    service: 'gmail',
    host: 'smtppro.zoho.in',
    auth: {
      user: process.env.emailId, // generated ethereal user
      pass: process.env.pass, // generated ethereal password
    },
  });
app.use(cors(corsOptions))
// server configuration
const PORT = process.env.PORT ||8080;
require('./dbConnection');

app.get('/testCount',async(req,res)=>{
    let user = await User.find();
    res.send({'data':user.length});
})
// create a route for the app
app.get('/checkEmail',async(req,res)=>{
    try{
        console.log(req.query.email);
    let user = await User.findOne({email:req.query.email});
    if(!user){
        newUser = User({'email':req.query.email,'name':req.query.name,'answerResponse':'',reportSend:''}); 
        newUser.save()
        console.log(newUser);
        return res.send({
            'data':'User Not Found',
            'res':true
        });
    }else{
        {
            return res.send({
                'data':'User Found',
                'res':false
            });
        }
    }
    }
    catch(e){
        res.send({'error':e});
    }
});

app.get('/', (req, res) => {
try{
    const counts = {};
const sampleArray = req.query.answer.split(',');
sampleArray.pop()
sampleArray.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
const value=Object.values(counts)
var same=[]
console.log(value)
console.log('-0-0-0-0-')
console.log(sampleArray)
console.log('-1--1-1-1-1--1-1-')
console.log(counts)
console.log(Math.max.apply(Math,value))
console.log('*/*/*/')
switch(Math.max.apply(Math,value)){
    
    case 2: console.log("Case 2 || 2 same");
            getPriority(counts);
            break;
    case 3: console.log("Case 3 || 3 same");
            getPriority(counts);
            break;
    case 4: console.log("Case 4 || 4 same");
            console.log(counts)
            createPDF('./output/answer'+getKeyByValue(counts,Math.max.apply(Math,value))+'.pdf',req.query.name);
            break;
    case 5: console.log("Case 5 || 5 same");
            console.log(counts);
            createPDF('./output/answer'+getKeyByValue(counts,Math.max.apply(Math,value))+'.pdf',req.query.name);
            break;
    case 6: console.log("Case 6 || 6 same");
            console.log("answer"+getKeyByValue(counts,Math.max.apply(Math,value)))
            createPDF('./output/answer'+getKeyByValue(counts,Math.max.apply(Math,value))+'.pdf',req.query.name);        
            break;
    default: console.log("Default");
}
function getPriority(counts){
    if(counts['6']){
                console.log("Priority goes to 6");
                
            createPDF('./output/answer'+getKeyByValue(counts,Math.max.apply(Math,value))+'.pdf',req.query.name);
                return;
            }
            if(counts['5']){
                console.log("Priority goes to 5");
                
            createPDF('./output/answer'+getKeyByValue(counts,Math.max.apply(Math,value))+'.pdf',req.query.name);
                return;
            }
            if(counts['2']){
                console.log("Priority goes to 2");
               
            createPDF('./output/answer'+getKeyByValue(counts,Math.max.apply(Math,value))+'.pdf',req.query.name);
                return;
            }
            if(counts['1']){
                
            createPDF('./output/answer'+getKeyByValue(counts,Math.max.apply(Math,value))+'.pdf',req.query.name);
                console.log("Priority goes to 1");
                return;
            }
            if(counts['3']){
                
            createPDF('./output/answer'+getKeyByValue(counts,Math.max.apply(Math,value))+'.pdf',req.query.name);
                console.log("Priority goes to 3");
                return;
            }
             if(counts['4']){
                
            createPDF('./output/answer'+getKeyByValue(counts,Math.max.apply(Math,value))+'.pdf',req.query.name);
                console.log("Priority goes to 4");
                return;
            }
}
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
async function createPDF(fileName,userName){
    const formPdfBytes = await fs.readFile(fileName)
    const pdfDoc = await PDFDocument.load(formPdfBytes)
    const form = pdfDoc.getForm()

const nameField = form.getTextField('Name')
nameField.setFontSize(21)
nameField.setAlignment(TextAlignment.Center)
nameField.setText("Congratulations "+userName+"!")
const pdfBytes = await pdfDoc.save()
await fs.writeFile(fileName, pdfBytes,)
let user = await User.updateOne({email:req.query.email},{reportSend:fileName});
fss.readFile(fileName, async function (err, data) {
    console.log("s;s");
   await transporter.sendMail({       
        sender: 'sender@sender.com',
        to: req.query.email,
        subject: 'Attachment!',
        body: 'mail content...',
        attachments: [{'filename': fileName, 'content': data}]
    }), function(err, success) {
        console.log('aaa');
        if (err) {
            // Handle error
            console.log("error");
        }
        if(success){
            console.log("sice");
        }

   }
});
res.header("Content-Type", "application/pdf");
res.download(fileName)
}
}catch(e){
    res.send(e);
}
//   res.download('./output/answer.pdf',req.query.name+' report.pdf');
});

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});


