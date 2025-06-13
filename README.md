# Electronics Blog

A modern web application for electronics enthusiasts, built with React and Firebase.

## 🚀 Features

- 🔐 User Authentication (Sign up, Login, Password Recovery)
- 👥 User Role Management (Admin, User)
- 📝 Blog Post Management
- 📂 Category Management
- 🎨 Dark/Light Mode
- 📱 Responsive Design
- 🔍 Search Functionality
- 📸 Image Upload Support

## 🛠️ Tech Stack

- **Frontend:**
  - React.js
  - Vite
  - Ant Design
  - Tailwind CSS
  - React Router DOM
  - React Icons

- **Backend:**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Storage

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/electronics-blog.git
   cd electronics-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Fill in your Firebase configuration in `.env`:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 📁 Project Structure

```
electronics-blog/
├── src/
│   ├── admin/           # Admin dashboard components
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   ├── pages/          # Page components
│   └── utils/          # Utility functions
├── database/           # Firebase configuration
├── public/            # Static assets
└── ...
```

## 🔐 Authentication

The application uses Firebase Authentication with the following features:
- Email/Password authentication
- Password recovery
- Role-based access control
- Protected routes

## 👥 User Roles

- **Admin:**
  - Full access to admin dashboard
  - Manage posts, categories, users, and roles
  - Configure system settings

- **User:**
  - Create and manage own posts
  - Comment on posts
  - Update profile

## 🎨 Customization

### Theme
The application supports both light and dark modes. The theme can be toggled using the theme switcher in the header.

### Styling
- Ant Design components for UI elements
- Tailwind CSS for custom styling
- Responsive design for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

- **Your Name** - [Your GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Ant Design](https://ant.design/)
- [Firebase](https://firebase.google.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
