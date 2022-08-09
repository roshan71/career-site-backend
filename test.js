// import { PDFDocument } from 'pdf-lib'
const PDFLib = require('pdf-lib');
var path = require("path");
const fs = require('fs/promises');
const PDFDocument = PDFLib.PDFDocument;
// These should be Uint8Arrays or ArrayBuffers
// This data can be obtained in a number of different ways
// If your running in a Node environment, you could use fs.readFile()
// In the browser, you could make a fetch() call and use res.arrayBuffer()
async function createPDF(){
    const formPdfBytes = await fs.readFile("./output/test.pdf")

// Load a PDF with form fields
 const pdfDoc = await PDFDocument.load(formPdfBytes)

// // Embed the Mario and emblem images

// Get the form containing all the fields
const form = pdfDoc.getForm()

// Get all fields in the PDF by their names
const nameField = form.getTextField('Name')
const emailField = form.getTextField('Email')
// Fill in the basic info fields
nameField.setText('Mario')
emailField.setText('karanpatel2329@gmail.com')
// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await pdfDoc.save()
}

createPDF();