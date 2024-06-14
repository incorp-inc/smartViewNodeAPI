const express = require('express');
const multer = require('multer');

const fileUpload = require('./apiServices/fileUpload')
const extractResult = require('./apiServices/extractResults')
const userLogs = require('./apiServices/userLogs')

const bodyParser = require('body-parser'); // Add this line


const app = express();
app.use(bodyParser.json()); // Add this line
app.use(bodyParser.urlencoded({ extended: true })); // Add this line



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

 const result = await extractResult.extractResult(FileID,res)

 res.json(result);

});

app.post('/getUserDataForDateRange', upload.none(), async (req, res) => {

  const { username, startDate, endDate } = req.body;

  if (!username || !startDate || !endDate) {
    return res.status(400).send('Missing required fields: username, startDate, endDate');
  }

  try {
    const data = await userLogs.getUserActivity(username, startDate, endDate);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/getAllUserData', upload.none(), async (req, res) => {

  const { username } = req.body;

  if (!username ) {
    return res.status(400).send('Missing required fields: username');
  }

  try {
    const data = await userLogs.getAllUserData(username);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.post('/getCountOfFilesMatchingCriteria', upload.none(), async (req, res) => {

  const { startDate,endDate, menu, submenu } = req.body;

  try {
    const data = await userLogs.getCountOfFilesMatchingCriteria(startDate,endDate, menu, submenu)
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
