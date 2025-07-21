# Contact Service Backend

A scalable Node.js backend service for managing contact information with MongoDB Atlas integration.

## Features

- RESTful API with Express.js
- MongoDB Atlas integration with Mongoose ODM
- Input validation and sanitization
- Error handling and logging
- CORS support
- Rate limiting for API security
- Environment-based configuration
- Pagination and search functionality

## API Endpoints

### Health Check
- **GET** `/health` - Check server status

### Contacts
- **POST** `/api/v1/contacts` - Create a new contact
- **GET** `/api/v1/contacts` - Get all contacts with filtering and pagination
- **GET** `/api/v1/contacts/stats` - Get contact statistics

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file and configure the following variables:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/contactsdb?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development

# API Configuration
API_VERSION=v1
```

### 3. MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address
5. Get your connection string and update MONGODB_URI in .env

### 4. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## API Usage Examples

### Create Contact
```bash
curl -X POST http://localhost:3000/api/v1/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "mobileNumber": "+1234567890",
    "emailId": "john@example.com",
    "natureOfServices": "Web Development",
    "workRelated": "Frontend Development",
    "note": "Experienced developer"
  }'
```

### Get Contacts
```bash
curl http://localhost:3000/api/v1/contacts?page=1&limit=10&search=john
```

## Deployment

This backend is ready for deployment on various platforms:

### Heroku
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### DigitalOcean App Platform
1. Create a new app
2. Connect repository
3. Configure environment variables
4. Deploy

## Project Structure

```
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   ├── errorHandler.js      # Global error handler
│   └── validation.js        # Input validation
├── models/
│   └── Contact.js           # Contact schema
├── routes/
│   └── contacts.js          # Contact routes
├── server.js                # Main server file
├── package.json
└── README.md
```

## Security Features

- Helmet.js for security headers
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Performance Optimizations

- Database indexing for faster queries
- Pagination for large datasets
- Efficient MongoDB queries
- Connection pooling with Mongoose