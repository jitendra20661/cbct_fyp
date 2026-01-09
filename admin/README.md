# AI Receptionist Admin Panel

A simple and clean web interface to manage doctors and categories for the AI Receptionist application.

## Features

- ✅ Add and manage categories (specializations)
- ✅ Add and manage doctors with detailed information
- ✅ Upload doctor profile images
- ✅ Assign doctors to categories
- ✅ Clean and responsive UI
- ✅ MongoDB integration for data persistence

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB:
   - Open the `.env` file
   - Update `MONGODB_URI` with your MongoDB connection string:
     - For local MongoDB: `mongodb://localhost:27017/ai_receptionist`
     - For MongoDB Atlas: Get your connection string from Atlas dashboard

## Running the Application

1. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3001
```

## Usage

### Adding Categories

1. Click on the "Categories" tab
2. Fill in the category form:
   - Category Name (required)
   - Description (optional)
3. Click "Add Category"

### Adding Doctors

1. Click on the "Doctors" tab
2. Fill in the doctor form:
   - Full Name (required)
   - Specialization (required)
   - Category (required - select from dropdown)
   - Experience in years (required)
   - Qualification (optional)
   - Email (optional)
   - Phone (optional)
   - Profile Image (optional)
   - Availability days (optional, comma-separated)
3. Click "Add Doctor"

## File Structure

```
admin/
├── server.js              # Express server and API routes
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables
├── public/               # Frontend files
│   ├── index.html       # Main HTML page
│   ├── styles.css       # Styling
│   └── app.js           # Frontend JavaScript
└── uploads/             # Uploaded images (created automatically)
```

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `DELETE /api/categories/:id` - Delete a category

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create a new doctor (with image upload)
- `DELETE /api/doctors/:id` - Delete a doctor

## MongoDB Collections

### Categories Collection
```javascript
{
  name: String (required, unique),
  description: String,
  createdAt: Date
}
```

### Doctors Collection
```javascript
{
  name: String (required),
  specialization: String (required),
  category: ObjectId (ref: Category, required),
  categoryName: String,
  experience: Number (required),
  qualification: String,
  email: String,
  phone: String,
  image: String,
  availability: [String],
  rating: Number,
  createdAt: Date
}
```

## Troubleshooting

1. **Cannot connect to MongoDB:**
   - Check if MongoDB is running locally (`mongod` command)
   - Verify your connection string in `.env`
   - For Atlas, ensure your IP is whitelisted

2. **Port already in use:**
   - Change the PORT in `.env` file
   - Or stop the process using port 3001

3. **Images not uploading:**
   - Ensure the `uploads/` directory exists
   - Check file permissions

## Notes

- The server runs on port 3001 by default (configurable in `.env`)
- Uploaded images are stored in the `uploads/` directory
- All data is stored in MongoDB database named `ai_receptionist`
