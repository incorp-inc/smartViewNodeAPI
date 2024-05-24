const express = require('express');
const multer = require('multer');

const fileUpload = require('./apiServices/fileUpload')


const app = express();

// Configure multer to store uploaded files in the 'uploads' directory
const upload = multer({ dest: 'uploads/' });

// Route handler for file upload
app.post('/uploadInvoice', upload.single('file'), async (req, res) => {
  // Access the uploaded file information
  const file = req.file;

  // Check if file exists
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

 const FileID = await fileUpload.fileUploadAPI(file,res)

 res.json(FileID);



});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
