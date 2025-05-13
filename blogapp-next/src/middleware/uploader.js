import multer from "multer"; // Import Multer
import path from "path";

// Basic storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  }, // Specify the upload directory
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
  
    cb(null, true);
  
  }else {
    cb(new Error('Only image files are allowed!'), false);
  }


};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Multer wrapper to handle file uploads in a promise-based way
export const uploadFileMiddleware = (req) => {
  return new Promise((resolve, reject) => {
    console.log('Starting file upload process...'); // Debug log

    upload.single('file')(req, null, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        reject({ message: "File upload failed: " + err.message });
        return;
      }

      try {
        // Log the entire request
        console.log('Request object:', {
          file: req.file,
          body: req.body,
          headers: req.headers
        });

        // Get form data
        const formData = await req.formData();
        console.log('Form data entries:', (formData.entries()));

        const fields = {
          title: formData.get('title'),
          summary: formData.get('summary'),
          content: formData.get('content')
        };

        // console.log('Extracted fields:', fields);
            console.log("extracted file is",Object.fromEntries(formData))

        if (!req.file) {
          console.log('No file found in request');
          reject({ message: "No file uploaded. Please select a file." });
          return;
        }

        resolve({
          fields,
          file: req.file
        });
      } catch (error) {
        console.error('Error in middleware:', error);
        reject({ message: "Error processing form data: " + error.message });
      }
    });
  });
};
