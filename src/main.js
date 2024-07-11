const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fileUpload = require('./apiServices/fileUpload');
const extractResult = require('./apiServices/extractResults');
const userLogs = require('./apiServices/userLogs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer to store uploaded files in the 'uploads' directory
const upload = multer({ dest: 'uploads/' });

// Helper function to wrap responses
function sendSuccessResponse(res, data) {
  res.json({ status: 'success', data });
}

function sendErrorResponse(res, error) {
  res.status(500).json({ status: 'error', message: error.message });
}

// Route handler for file upload
app.post('/uploadInvoice', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }
    const FileID = await fileUpload.fileUploadAPI(file, res);
    const result = await extractResult.extractResult(FileID, res);
    sendSuccessResponse(res, result);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

app.post('/getUserDataForDateRange', upload.none(), async (req, res) => {
  try {
    const { username, startDate, endDate } = req.body;
    if (!username || !startDate || !endDate) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields: username, startDate, endDate' });
    }
    const data = await userLogs.getUserActivity(username, startDate, endDate);
    sendSuccessResponse(res, data);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

app.post('/getAllUserData', upload.none(), async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields: username' });
    }
    const data = await userLogs.getAllUserData(username);
    sendSuccessResponse(res, data);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

app.post('/getCountOfFilesMatchingCriteria', upload.none(), async (req, res) => {
  try {
    const { startDate, endDate, menu, submenu } = req.body;
    const data = await userLogs.getCountOfFilesMatchingCriteria(startDate, endDate, menu, submenu);
    sendSuccessResponse(res, data);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

app.post('/getUniqueMenuAndSubmenu', upload.none(), async (req, res) => {
  try {
    const data = await userLogs.getUniqueMenuAndSubmenu();
    sendSuccessResponse(res, data);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

app.post('/getMenuAccessCount', upload.none(), async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const data = await userLogs.getMenuAccessCount(startDate, endDate);
    sendSuccessResponse(res, data);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});

app.post('/getMenuAccessCountByMonth', upload.none(), async (req, res) => {
  try {
    const { month, year } = req.body;
    const data = await userLogs.getMenuAccessCountByMonth(parseInt(month), parseInt(year));
    sendSuccessResponse(res, data);
  } catch (error) {
    sendErrorResponse(res, error);
  }
});




app.post('/getAllDataWithinDateRange', async (req, res) => {
  try {
      const { startDate, endDate } = req.body;
      const outputFilePath = `C:/UserLogsConsolidated/${startDate}_${endDate}_UserlogsCombined.csv`;

      if (!startDate || !endDate) {
          return res.status(400).json({ status: 'error', message: 'Missing required fields: startDate, endDate' });
      }

      await userLogs.getAllDataWithinDateRangeSingleFile(startDate, endDate, outputFilePath);
      sendSuccessResponse(res, { message: 'CSV file created successfully.' });
  } catch (error) {
      sendErrorResponse(res, error);
  }
});


app.post('/getAllDataWithinDateRangeSeparateFile', async (req, res) => {
  try {
      const { startDate, endDate } = req.body;
      const outputDirectoryPath = 'C:/UserLogsConsolidated';

      if (!startDate || !endDate) {
          return res.status(400).json({ status: 'error', message: 'Missing required fields: startDate, endDate' });
      }

      await userLogs.getAllDataWithinDateRangeSeparateFile(startDate, endDate, outputDirectoryPath);
      sendSuccessResponse(res, { message: 'CSV files created successfully.' });
  } catch (error) {
      sendErrorResponse(res, error);
  }
});

app.post('/getMismatchReport', async (req, res) => {
  try {
      const outputFilePath = `C:/UserLogsConsolidated/Mismatches.csv`;


      await userLogs.getMismatchReport( outputFilePath);
      sendSuccessResponse(res, { message: 'CSV file created successfully.' });
  } catch (error) {
      sendErrorResponse(res, error);
  }
});



// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
