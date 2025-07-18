# DailyWageConnect - Local Job Scheduler for Daily-Wage Workers

A comprehensive platform that connects households with nearby daily-wage workers like electricians, plumbers, maids, and gardeners. The system enables two-way scheduling based on mutual availability, helping workers get consistent income while users find reliable help easily.

## 🌟 Features

### For Users (Customers)
- **Search & Book Workers**: Find available workers by service type, location, and ratings
- **Profile Viewing**: View worker profiles, ratings, experience, and availability
- **Real-time Scheduling**: Book services based on mutual availability
- **Booking Management**: Track booking status, cancel/reschedule bookings
- **Rating System**: Rate and review workers after service completion
- **Notifications**: Real-time alerts for booking updates
- **Favorites**: Save frequently used workers for quick booking

### For Workers
- **Profile Creation**: Showcase skills, experience, and services offered
- **Availability Management**: Set daily/weekly availability with time slots
- **Booking Requests**: Accept or reject incoming booking requests
- **Earnings Tracking**: Monitor completed jobs and total earnings
- **Dashboard Analytics**: View booking statistics and performance metrics
- **Real-time Notifications**: Get instant alerts for new bookings

### General Features
- **Dual Authentication**: Separate registration flows for users and workers
- **Real-time Communication**: Socket.IO powered notifications
- **Mobile Responsive**: Works seamlessly on all devices
- **Secure**: JWT-based authentication and data validation
- **Rating & Reviews**: Two-way rating system for trust building

## 🛠 Tech Stack

### Frontend
- **React.js** - UI library with functional components and hooks
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Socket.IO Client** - Real-time communication
- **React Query** - Server state management
- **Lucide React** - Modern icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework for RESTful APIs
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation and sanitization

## 📁 Project Structure

```
dailywageconnect/
├── backend/
│   ├── models/          # Database schemas
│   │   ├── User.js
│   │   ├── Worker.js
│   │   ├── Booking.js
│   │   └── Notification.js
│   ├── routes/          # API endpoints
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── workers.js
│   │   ├── bookings.js
│   │   └── notifications.js
│   ├── middleware/      # Custom middleware
│   │   └── auth.js
│   ├── .env            # Environment variables
│   ├── server.js       # Main server file
│   └── package.json    # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts (Auth, Socket)
│   │   ├── utils/       # Utility functions and API calls
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   ├── public/          # Static assets
│   ├── tailwind.config.js
│   └── package.json     # Frontend dependencies
└── package.json         # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dailywageconnect.git
   cd dailywageconnect
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install all dependencies (backend + frontend)
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dailywageconnect
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod

   # Or using MongoDB directly
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev

   # Or run separately:
   # Backend only
   npm run backend

   # Frontend only
   npm run frontend
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage

### For Customers
1. **Sign Up**: Register as a customer with basic details
2. **Search Workers**: Browse available workers by service type
3. **View Profiles**: Check worker ratings, experience, and availability
4. **Book Service**: Select time slots and submit booking requests
5. **Track Bookings**: Monitor booking status and receive notifications
6. **Rate & Review**: Provide feedback after service completion

### For Workers
1. **Sign Up**: Register as a worker with services and rates
2. **Set Availability**: Configure daily/weekly working hours
3. **Manage Bookings**: Accept/reject incoming requests
4. **Complete Jobs**: Mark bookings as completed
5. **Track Earnings**: Monitor income and job statistics
6. **Build Reputation**: Collect ratings and reviews

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register/user` - Register new customer
- `POST /api/auth/register/worker` - Register new worker
- `POST /api/auth/login` - User/worker login
- `GET /api/auth/me` - Get current user profile

### Workers
- `GET /api/workers` - Search workers with filters
- `GET /api/workers/:id` - Get worker profile
- `GET /api/workers/available/:service` - Get available workers for service
- `PUT /api/workers/profile` - Update worker profile
- `PUT /api/workers/availability` - Update availability

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user/worker bookings
- `PUT /api/bookings/:id/accept` - Worker accepts booking
- `PUT /api/bookings/:id/reject` - Worker rejects booking
- `PUT /api/bookings/:id/complete` - Mark booking complete
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/rate` - Rate completed booking

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 🌍 Social Impact

### Empowering Workers
- **Direct Access**: Eliminates middlemen, ensuring workers get full payment
- **Flexible Scheduling**: Workers can set their own availability
- **Skill Recognition**: Rating system helps skilled workers build reputation
- **Digital Inclusion**: Brings informal workers into the digital economy

### Supporting Households
- **Reliable Service**: Access to verified and rated workers
- **Transparent Pricing**: Clear hourly rates with no hidden fees
- **Convenience**: Easy scheduling and booking management
- **Trust Building**: Rating and review system ensures quality

### Community Benefits
- **Local Economy**: Promotes local service providers
- **Women Empowerment**: Provides opportunities for women workers
- **Elderly Support**: Helps elderly and low-tech users find assistance
- **Quality Assurance**: Reduces exploitation through transparent processes

## 🔮 Future Enhancements

### MVP Features (2-hour build)
- [x] Basic worker search and booking
- [x] Real-time notifications
- [x] User/worker registration
- [x] Availability management

### Planned Features
- **Multilingual Support**: Hindi, regional languages
- **Payment Integration**: UPI, digital wallets
- **GPS Integration**: Location-based worker matching
- **AI Recommendations**: Smart worker suggestions
- **Voice Interface**: WhatsApp bot integration
- **Verification System**: Document verification and badges
- **Advanced Analytics**: Detailed dashboard insights
- **Mobile App**: React Native/Flutter implementation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: Full-stack developers
- **UI/UX Design**: Modern, accessible interface design
- **Backend Architecture**: Scalable API design
- **Database Design**: Optimized MongoDB schemas

## 📞 Support

For support and queries:
- Email: support@dailywageconnect.com
- Phone: +91-8000000000
- GitHub Issues: [Create an issue](https://github.com/yourusername/dailywageconnect/issues)

## 🎯 Demo

Try the live demo at: [https://dailywageconnect.demo.com](https://dailywageconnect.demo.com)

**Demo Accounts:**
- Customer: user@demo.com / demo123
- Worker: worker@demo.com / demo123

---

**DailyWageConnect** - Connecting communities, empowering workers, building trust. 🤝