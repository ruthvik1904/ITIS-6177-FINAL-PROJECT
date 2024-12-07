const express = require('express');
const bodyParser = require('body-parser');
const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Only JPEG and PNG images are allowed'), false);
        }
        cb(null, true);
      },
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Middleware
app.use(bodyParser.json());

// Azure Vision Client Setup
const endpoint = process.env['VISION_ENDPOINT'];
const key = process.env['VISION_KEY'];
const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const features = ['Caption', 'Read'];

// API Route for OCR
app.post('/api/analyze-url', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const result = await client.path('/imageanalysis:analyze').post({
      body: { url: imageUrl },
      queryParameters: { features: features },
      contentType: 'application/json',
    });

    const iaResult = result.body;

    const caption = iaResult.captionResult ? iaResult.captionResult.text : null;
    const content = iaResult.readResult
      ? iaResult.readResult.blocks.flatMap(block =>
          block.lines.map(line => line.text)
        )
      : [];

    const response = {
      caption,
      content,
    };


    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze image', details: error.message });
  }
});

app.post('/api/analyze-upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const filePath = path.join(__dirname, req.file.path);

  try {
    const imageData = fs.readFileSync(filePath);

    const result = await client.path('/imageanalysis:analyze').post({
      body: imageData,
      queryParameters: { features: features },
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    const iaResult = result.body;

    const caption = iaResult.captionResult ? iaResult.captionResult.text : null;
    const content = iaResult.readResult
      ? iaResult.readResult.blocks.flatMap(block =>
          block.lines.map(line => line.text)
        )
      : [];

    const response = {
      caption,
      content,
    };


    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze image', details: error.message });
  } finally {
    // Clean up uploaded file
    fs.unlinkSync(filePath);
  }
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ error: `Multer Error: ${err.message}` });
    } else if (err.message === 'Only JPEG and PNG images are allowed') {
        res.status(400).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
