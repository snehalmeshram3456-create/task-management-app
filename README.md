# TaskMaster - Task Management Application

A modern, production-ready full-stack task management application with authentication, Kanban board, and advanced analytics.

## 🌟 Features

### Authentication
- ✅ User Registration with validation
- ✅ User Login with JWT tokens
- ✅ Session persistence
- ✅ Secure password hashing with bcrypt

### Task Management
- ✅ Create, Read, Update, Delete (CRUD) tasks
- ✅ Task priorities (Low, Medium, High)
- ✅ Task status (Pending, In Progress, Completed)
- ✅ Task categories (Work, Personal, Shopping, Health, Other)
- ✅ Due date tracking
- ✅ Task assignments

### Kanban Board
- ✅ Drag and drop tasks between columns
- ✅ Organize tasks by status
- ✅ Real-time UI updates
- ✅ Visual task cards with metadata

### Filtering & Search
- ✅ Filter by status, priority, category
- ✅ Search tasks by title
- ✅ Multiple sorting options (newest, oldest, priority, due date)

### Analytics & Statistics
- ✅ Total tasks count
- ✅ Completed tasks count
- ✅ Pending tasks count
- ✅ Overdue tasks count
- ✅ Task distribution charts
- ✅ Weekly completion report

### UI/UX
- ✅ Modern, responsive design
- ✅ Dark/Light mode toggle
- ✅ Mobile-friendly interface
- ✅ Beautiful animations
- ✅ Toast notifications
- ✅ Loading spinners
- ✅ Smooth transitions

### Dashboard
- ✅ Statistics cards
- ✅ Chart.js integration
- ✅ Sidebar navigation
- ✅ User profile section

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (with CSS Grid & Flexbox)
- Vanilla JavaScript (ES6+)
- Chart.js for data visualization

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication
- bcryptjs for password hashing

### Database
- MongoDB

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud-based like MongoDB Atlas)

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd task-management-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
MONGODB_URI=mongodb://localhost:27017/task-management-app
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**Important Security Note:** In production, use a strong random JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. MongoDB Setup

#### Option A: Local MongoDB
```bash
# If MongoDB is installed locally
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

### 5. Start the Application

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## 📂 Project Structure

```
task-management-app/
│
├── frontend/
│   ├── index.html              # Landing page
│   ├── login.html              # Login page
│   ├── register.html           # Registration page
│   ├── dashboard.html          # Main dashboard
│   ├── css/
│   │   └── style.css           # Complete stylesheet
│   └── js/
│       ├── app.js              # Landing page JS
│       ├── auth.js             # Authentication logic
│       ├── api.js              # API calls
│       ├── dashboard.js        # Dashboard logic
│       └── task.js             # Task management logic
│
├── backend/
│   ├── server.js               # Express server
│   ├── config/
│   │   └── db.js               # Database configuration
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Task.js             # Task schema
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication
│   ├── controllers/
│   │   ├── authController.js   # Auth handlers
│   │   └── taskController.js   # Task handlers
│   └── routes/
│       ├── authRoutes.js       # Auth endpoints
│       └── taskRoutes.js       # Task endpoints
│
├── package.json
├── .env.example
└── README.md
```

## 🔐 API Endpoints

### Authentication Routes
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
GET    /api/auth/profile     # Get user profile (protected)
POST   /api/auth/logout      # Logout (protected)
```

### Task Routes
```
GET    /api/tasks            # Get all tasks (protected)
GET    /api/tasks/:id        # Get single task (protected)
POST   /api/tasks            # Create task (protected)
PUT    /api/tasks/:id        # Update task (protected)
DELETE /api/tasks/:id        # Delete task (protected)
GET    /api/tasks/stats/dashboard  # Get stats (protected)
```

## 🎨 Color Theme

- **Primary:** #2563EB (Blue)
- **Secondary:** #1E293B (Dark Blue-Gray)
- **Success:** #22C55E (Green)
- **Warning:** #F59E0B (Amber)
- **Danger:** #EF4444 (Red)

## 🔑 Key Features Explained

### Drag & Drop Kanban Board
Tasks can be dragged between columns (Pending → In Progress → Completed) with real-time status updates.

### Advanced Filtering
Filter tasks by:
- Status (Pending, In Progress, Completed)
- Priority (Low, Medium, High)
- Category (Work, Personal, Shopping, Health, Other)
- Due Date

### Dashboard Statistics
Real-time statistics showing:
- Total number of tasks
- Completed tasks
- Pending tasks
- Overdue tasks

### Dark Mode
Toggle between light and dark themes. Preference is saved in localStorage.

### Responsive Design
- Desktop: Full sidebar and all features
- Tablet: Collapsible sidebar
- Mobile: Mobile-optimized interface with hamburger menu

## 🔒 Security Features

1. **Password Security**
   - Passwords hashed with bcryptjs (10 rounds)
   - Never stored in plain text

2. **JWT Tokens**
   - Secure token-based authentication
   - 7-day token expiration
   - Token validation on protected routes

3. **Input Validation**
   - Server-side validation on all inputs
   - XSS protection with HTML escaping
   - Email format validation

4. **CORS Protection**
   - Configurable CORS origins
   - Prevents unauthorized cross-origin requests

## 🚀 Deployment

### Deploy Backend to Heroku
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=your_mongodb_uri

# Push to Heroku
git push heroku main
```

### Deploy Frontend to Vercel/Netlify
Simply push your frontend folder to Vercel or Netlify.

## 📊 Database Schema

### User Model
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  createdAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  priority: String (Low|Medium|High),
  status: String (Pending|In Progress|Completed),
  dueDate: Date,
  category: String,
  assignedUser: ObjectId,
  createdBy: ObjectId,
  completedAt: Date,
  isOverdue: Boolean,
  createdAt: Date
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP address

### CORS Error
- Verify `CORS_ORIGIN` in `.env` matches your frontend URL
- Update if running on different port

### Port Already in Use
```bash
# Change PORT in .env or kill the process
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Crypto Error
- Ensure Node.js is updated to latest version
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📝 Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Complete project",
    "description": "Finish the React project",
    "priority": "High",
    "status": "In Progress",
    "category": "Work",
    "dueDate": "2024-12-31"
  }'
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Chart.js Documentation](https://www.chartjs.org/)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created as a production-ready task management application.

## 🎯 Future Enhancements

- [ ] Real-time updates with Socket.io
- [ ] File attachments for tasks
- [ ] Comments on tasks
- [ ] Activity logs
- [ ] Email reminders
- [ ] Export to PDF/Excel
- [ ] Role-based access control
- [ ] Team collaboration features
- [ ] Recurring tasks
- [ ] Task templates

## ⚡ Performance Tips

1. **Indexing**: MongoDB indexes are created on frequently queried fields
2. **Pagination**: Implement pagination for large task lists
3. **Caching**: Consider Redis for session caching
4. **Lazy Loading**: Frontend assets are optimized for faster loading

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Happy Task Managing! 🚀**
