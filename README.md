
# ITIS-6177-FINAL-PROJECT

## Overview

This project serves as the final assignment for the ITIS-6177 System Integration course. The focus is on implementing a robust and scalable system integration solution using modern tools and technologies. The project highlights the integration of an Azure AI Optical Character Recognition (OCR) API into a custom-built web service, enabling users to extract text from images seamlessly.

## Features

- **OCR Functionality**: Processes images for text extraction via URLs or direct file uploads.
- **Custom API Integration**: Provides a user-friendly API endpoint, abstracting the complexity of managing Azure services.
- **Secure Key Management**: Ensures that API keys and sensitive data are handled securely.
- **Error Handling**: Implements robust error management for various scenarios, including invalid inputs and server errors.
- **File Validation**: Supports JPEG and PNG formats with size restrictions for efficient processing.
- **Lightweight and Fast**: Optimized for real-time analysis of images with minimal delay.

## Prerequisites

To run this project, ensure the following prerequisites are met:

1. **Environment Setup**:
   - Node.js installed on your system.
   - Azure account with access to the AI Vision API.

2. **Dependencies**:
   - Express.js for server creation.
   - Multer for handling file uploads.
   - Azure SDK for accessing Azure services.

3. **Environment Variables**:
   - Configure a `.env` file with the following:
     ```
     VISION_ENDPOINT=<Your Azure Vision API Endpoint>
     VISION_KEY=<Your Azure Vision API Key>
     ```

## Project Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ITIS-6177-FINAL-PROJECT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in a `.env` file.

4. Run the server:
   ```bash
   npm start
   ```

5. The server will be available at `http://localhost:3000`.

## API Endpoints

### 1. Analyze Image via URL

- **Endpoint**: `/api/analyze-url`
- **Method**: POST
- **Input**:
  ```json
  {
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- **Response**:
  ```json
  {
    "caption": "A person riding a bicycle on the road",
    "content": ["A", "person", "riding", "a", "bicycle"]
  }
  ```

### 2. Analyze Uploaded Image

- **Endpoint**: `/api/analyze-upload`
- **Method**: POST
- **Input**: Multipart file upload (JPEG or PNG).
- **Response**:
  ```json
  {
    "caption": "A cat sitting on a couch",
    "content": ["A", "cat", "sitting", "on", "a", "couch"]
  }
  ```

## Project Architecture

1. **Frontend**: A minimal client interface for testing endpoints (optional).
2. **Backend**: Express.js-based server integrating Azure AI OCR API.
3. **Storage**: Temporary file storage using Multer, with automatic cleanup after processing.

## Security Measures

- API keys are stored in environment variables to prevent exposure.
- File uploads are validated for type and size to ensure only supported files are processed.
- Temporary files are deleted after processing to maintain data privacy.
