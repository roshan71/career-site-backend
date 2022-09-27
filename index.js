// import express (after npm install express)
const express = require("express");
// import { PDFDocument } from 'pdf-lib'
const PDFLib = require("pdf-lib");
var path = require("path");
const fs = require("fs/promises");
const User = require("./userModel");
var fss = require("fs");

const reader = require("xlsx");
const PDFDocument = PDFLib.PDFDocument;
// create new express app and save it as "app"
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
var mailer = require("nodemailer");
const { TextAlignment } = require("pdf-lib");

let transporter = mailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 587,
  auth: {
    user: "ask@careerschool.in",
    pass: "Sadhguru@2022",
  },
});
console.log(process.env.emailId);
app.use(cors(corsOptions));
// server configuration
const PORT = process.env.PORT || 8080;
require("./dbConnection");

app.get("/testCount", async (req, res) => {
  let user = await User.find();
  res.send({ data: user.length });
});
// create a route for the app
app.get("/checkEmail", async (req, res) => {
  try {
    console.log(req.query.email);
    let user = await User.findOne({ email: req.query.email });
    if (!user) {
      newUser = User({
        email: req.query.email,
        name: req.query.name,
        answerResponse: "",
        reportSend: "",
      });
      newUser.save();
      console.log(newUser);
      return res.send({
        data: "User Not Found",
        res: true,
      });
    } else {
      {
        return res.send({
          data: "User Found",
          res: false,
        });
      }
    }
  } catch (e) {
    res.send({ error: e });
  }
});

app.get("/", async (req, res) => {
  try {
    const counts = {};
    const sampleArray = req.query.answer.split(",");
    sampleArray.pop();
    sampleArray.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    const value = Object.values(counts);
    var same = [];

    switch (Math.max.apply(Math, value)) {
      case 2:
        console.log("Case 2 || 2 same");
        getPriority(counts);
        break;
      case 3:
        console.log("Case 3 || 3 same");
        getPriority(counts);
        break;
      case 4:
        console.log("Case 4 || 4 same");
        console.log(counts);
        createPDF(
          "./output/answer" +
            getKeyByValue(counts, Math.max.apply(Math, value)) +
            ".pdf",
          req.query.name
        );
        break;
      case 5:
        console.log("Case 5 || 5 same");
        console.log(counts);
        createPDF(
          "./output/answer" +
            getKeyByValue(counts, Math.max.apply(Math, value)) +
            ".pdf",
          req.query.name
        );
        break;
      case 6:
        console.log("Case 6 || 6 same");
        console.log(
          "answer" + getKeyByValue(counts, Math.max.apply(Math, value))
        );
        createPDF(
          "./output/answer" +
            getKeyByValue(counts, Math.max.apply(Math, value)) +
            ".pdf",
          req.query.name
        );
        break;
      default:
        console.log("Default");
    }
    function getPriority(counts) {
      if (counts["6"]) {
        console.log("Priority goes to 6");

        createPDF(
          "./output/answer" +
            getKeyByValue(counts, Math.max.apply(Math, value)) +
            ".pdf",
          req.query.name
        );
        return;
      }
      if (counts["5"]) {
        console.log("Priority goes to 5");

        createPDF(
          "./output/answer" +
            getKeyByValue(counts, Math.max.apply(Math, value)) +
            ".pdf",
          req.query.name
        );
        return;
      }
      if (counts["2"]) {
        console.log("Priority goes to 2");

        createPDF(
          "./output/answer" +
            getKeyByValue(counts, Math.max.apply(Math, value)) +
            ".pdf",
          req.query.name
        );
        return;
      }
      if (counts["1"]) {
        createPDF(
          "./output/answer" +
            getKeyByValue(counts, Math.max.apply(Math, value)) +
            ".pdf",
          req.query.name
        );
        console.log("Priority goes to 1");
        return;
      }
      if (counts["3"]) {
        createPDF(
          "./output/answer" +
            getKeyByValue(counts, Math.max.apply(Math, value)) +
            ".pdf",
          req.query.name
        );
        console.log("Priority goes to 3");
        return;
      }
      if (counts["4"]) {
        createPDF(
          "./output/answer" +
            getKeyByValue(counts, Math.max.apply(Math, value)) +
            ".pdf",
          req.query.name
        );
        console.log("Priority goes to 4");
        return;
      }
    }
    function getKeyByValue(object, value) {
      return Object.keys(object).find((key) => object[key] === value);
    }
    async function createPDF(fileName, userName) {
      const formPdfBytes = await fs.readFile(fileName);
      const pdfDoc = await PDFDocument.load(formPdfBytes);
      const form = pdfDoc.getForm();

      const nameField = form.getTextField("Name");
      nameField.setFontSize(21);
      nameField.setAlignment(TextAlignment.Center);
      nameField.setText("Congratulations " + userName + "!");
      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(fileName, pdfBytes);
      let user = await User.updateOne(
        { email: req.query.email },
        { reportSend: fileName }
      );
      fss.readFile(fileName, async function (err, data) {
        console.log("s;s");
        await transporter.sendMail({
          from: "ask@careerschool.in",
          to: req.query.email,
          subject: "Your Career Superpower Report",
          html: `
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Hey,</span></span></span></p>
        
        <p>&nbsp;</p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Congratulation once again for discovering your Career Superpower.</span></span></span></p>
        
        <p>&nbsp;</p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Here is your detailed 4 page report. (In the attachment)</span></span></span></p>
        
        <p>&nbsp;</p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Read through the report &amp; save it for your future reference.</span></span></span></p>
        
        <p>&nbsp;</p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Knowing what you are is the starting point of journey towards successful Career.</span></span></span></p>
        
        <p>&nbsp;</p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">We, from Career School Wish you the best for your successful Career &amp; bright future.</span></span></span></p>
        
        <p>&nbsp;</p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Claim your Free 30 Minutes Career Clarity Session with Expert Now&nbsp;</span></span></span></p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Clcik Here - </span></span></span><a href="https://calendly.com/free-career-consultation/with-student-success-coach" style="text-decoration:none"><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#1155cc"><u>https://calendly.com/free-career-consultation/with-student-success-coach</u></span></span></span></a></p>
        
        <p>&nbsp;</p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">P.S - Would love to receive your feedback on this Assesment. Please share your views by writing us at </span></span></span><a href="mailto:ask@careerschool.in" style="text-decoration:none"><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#1155cc"><u>ask@careerschool.in</u></span></span></span></a></p>
        
        <p>&nbsp;</p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000"><strong>Thank you,</strong></span></span></span></p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Always to Your Success &amp; Career Growth</span></span></span></p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Helping 100s of Students &amp; early age working professionals create strong foundation for Successful Career</span></span></span></p>
        
        <p>&nbsp;</p>
        
        <p><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#000000">Join the growing community of Successful Career Aspirants - </span></span></span><a href="https://www.facebook.com/groups/smartcareeracademy" style="text-decoration:none"><span style="font-size:11pt"><span style="font-family:Arial"><span style="color:#1155cc"><u>https://www.facebook.com/groups/smartcareeracademy</u></span></span></span></a></p>
        
        <p>&nbsp;</p>
        `,
          attachments: [
            {
              filename: userName + " _ Career Superpower Report.pdf",
              content: data,
            },
          ],
        }),
          function (err, success) {
            console.log("aaa$e");
            if (err) {
              // Handle error
              console.log("error");
            }
            if (success) {
              console.log("sice");
            }
            console.log("SENDED MAIL");
          };
        console.log("=====");
      });
      res.download(fileName);
    }
  } catch (e) {
    res.send(e);
  }
  //   res.download('./output/answer.pdf',req.query.name+' report.pdf');
});

app.get(
  "/download/e51f168933b691d22c3f7331db218b67a9f5f750d0363bc04cff2c475e625432693df733281f14dda2b1de72a8f3d7dc916c6896d148873b7deac59682f8d64ef52040a8fed95b54ad2cd58b2625b8b8",
  async (req, res) => {
   try{
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("UserData");
    // keep {} where you wan to skip the column
    sheet.columns = [
      { key: "_id", header: "ID" },
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
    ];
    // keep {} where you wan to skip the row
    let user = await User.find();
    user.forEach((item, i) => {
      sheet.addRow(item);
    });

    await workbook.xlsx.writeFile("userData.xlsx").then(() => {
      var fileName = "UserData.xlsx";

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
      workbook.xlsx.write(res).then(function () {
        res.end();
      });
    });
   
   }catch(e){
    res.send("Something went wrong");
   } //res.send({"res":"Something went Wrong"});
  }
);

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
