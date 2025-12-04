# 🎓 SH-Academy Client - Modern Learning Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A cutting-edge, responsive Learning Management System built with Next.js 15, TypeScript, and modern UI libraries. Experience seamless course management, interactive learning, and real-time progress tracking.

[Live Demo](https://sh-academy-client.vercel.app) · [Report Bug](https://github.com/samio11/SH-Academy-Client/issues) · [Request Feature](https://github.com/samio11/SH-Academy-Client/issues)

</div>

---

## ✨ Features at a Glance

### 🎨 **Beautiful, Responsive UI**
- Modern, clean interface built with **Tailwind CSS** and **shadcn/ui**
- Fully responsive design - works flawlessly on mobile, tablet, and desktop
- Dark mode support with smooth theme transitions
- Smooth animations and micro-interactions using **Framer Motion**
- Accessible components following WCAG guidelines

### 👨‍💼 **Admin Dashboard**
- **Comprehensive Analytics** - Real-time statistics with interactive charts
- **User Management** - View, edit, block/unblock users with advanced filtering
- **Course Management** - Create, update, and delete courses with rich text editor
- **Enrollment Tracking** - Monitor student enrollments and progress
- **Quiz & Assignment Management** - Create and manage assessments
- **Visual Reports** - Beautiful charts powered by Recharts/Chart.js

### 📚 **Course Features**
- **Rich Course Cards** - Eye-catching course presentations with images
- **Advanced Search & Filtering** - Find courses by title, category, instructor, or price
- **Course Details Page** - Comprehensive course information with curriculum breakdown
- **Lesson Viewer** - Clean, distraction-free learning interface
- **Progress Tracking** - Visual progress bars showing completion percentage
- **Category Browsing** - Organized course categories for easy navigation

### 🎓 **Student Experience**
- **Personal Dashboard** - Overview of enrolled courses and progress
- **Interactive Quizzes** - Engaging multiple-choice quizzes with instant feedback
- **Assignment Submission** - Upload and submit assignments with file support
- **Progress Visualization** - Track your learning journey with progress indicators
- **Certificate Generation** - Earn certificates upon course completion
- **Enrollment Management** - Easy course enrollment with batch selection

### 👨‍🏫 **Instructor Portal**
- **Course Creation Wizard** - Step-by-step course creation process
- **Content Management** - Upload videos, documents, and create lessons
- **Student Progress Monitoring** - View individual student progress
- **Assignment Grading** - Review and grade student submissions
- **Quiz Analytics** - Analyze quiz performance and identify weak areas

### 🔐 **Authentication & Security**
- **Secure Authentication** - JWT-based authentication with refresh tokens
- **Role-Based Access** - Different interfaces for Admin, Instructor, and Student
- **Protected Routes** - Secure pages with authentication middleware
- **Form Validation** - Client-side and server-side validation with Zod
- **Password Security** - Secure password handling with bcrypt

### 🚀 **Performance & SEO**
- **Server-Side Rendering** - Lightning-fast page loads with Next.js SSR
- **Image Optimization** - Automatic image optimization with Next.js Image
- **Code Splitting** - Optimized bundle sizes with dynamic imports
- **SEO Optimized** - Meta tags, Open Graph, and structured data
- **Progressive Web App** - PWA capabilities for offline access

---

## 🛠️ Technology Stack

### **Core Framework**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library with Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### **Styling & UI**
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide Icons](https://lucide.dev/)** - Beautiful, consistent icons

### **Data Management**
- **[TanStack Query](https://tanstack.com/query)** - Powerful data fetching & caching
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Axios](https://axios-http.com/)** - HTTP client for API calls

### **Forms & Validation**
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### **Visualization**
- **[Recharts](https://recharts.org/)** - Composable charting library
- **[React PDF](https://react-pdf.org/)** - PDF rendering and generation

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks

---


## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0 or higher)
- **npm** or **yarn** or **pnpm** or **bun**
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/samio11/SH-Academy-Client.git
cd SH-Academy-Client
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_BACKEND=(Backend URL)
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📱 Key Pages

### Public Pages
- `/` - Homepage with featured courses
- `/courses` - Browse all courses with filters
- `/courses/[id]` - Individual course details
- `/courses/category/[slug]` - Category-specific courses
- `/about` - About the platform
- `/contact` - Contact form

### Authentication
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password recovery

### Student Dashboard
- `/student/dashboard` - Overview and stats
- `/student/my-courses` - Enrolled courses
- `/student/browse` - Browse and enroll in courses
- `/student/progress` - Learning progress tracker
- `/student/certificates` - Earned certificates

### Instructor Dashboard
- `/instructor/dashboard` - Instructor overview
- `/instructor/courses` - Manage courses
- `/instructor/create-course` - Create new course
- `/instructor/students` - View enrolled students
- `/instructor/analytics` - Course performance analytics

### Admin Dashboard
- `/admin/dashboard` - Admin overview with analytics
- `/admin/users` - User management
- `/admin/courses` - Course management
- `/admin/enrollments` - Enrollment tracking
- `/admin/quizzes` - Quiz management
- `/admin/assignments` - Assignment management

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: 221.2 83.2% 53.3%        /* Blue */
--primary-foreground: 210 40% 98%

/* Secondary Colors */
--secondary: 210 40% 96.1%
--secondary-foreground: 222.2 47.4% 11.2%

/* Accent Colors */
--accent: 210 40% 96.1%
--accent-foreground: 222.2 47.4% 11.2%

/* Status Colors */
--success: 142 76% 36%              /* Green */
--warning: 38 92% 50%               /* Yellow */
--error: 0 84% 60%                  /* Red */
--info: 199 89% 48%                 /* Light Blue */
```

### Typography
- **Headings**: Geist Sans (Vercel's font)
- **Body**: Geist Sans
- **Code**: Geist Mono

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js app:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/samio11/SH-Academy-Client)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables
4. Deploy!

### Deploy to Other Platforms

- **Netlify**: Follow [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
- **AWS Amplify**: See [Deploy Next.js on AWS](https://aws.amazon.com/blogs/mobile/deploy-a-nextjs-app-with-aws-amplify/)
- **Railway**: Check [Railway Next.js Guide](https://docs.railway.app/guides/nextjs)

---

## 📚 API Integration

This frontend connects to the SH-Academy Backend API. Make sure the backend is running:

```typescript
// lib/api/axios-instance.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue on GitHub:

- [Report a Bug](https://github.com/samio11/SH-Academy-Client/issues/new?labels=bug)
- [Request a Feature](https://github.com/samio11/SH-Academy-Client/issues/new?labels=enhancement)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Samio**

- GitHub: [@samio11](https://github.com/samio11)
- LinkedIn:(https://www.linkedin.com/in/samio-hasan)
- Email: samiohasan6@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- All open-source contributors

---

## 📊 Project Status

![GitHub issues](https://img.shields.io/github/issues/samio11/SH-Academy-Client)
![GitHub stars](https://img.shields.io/github/stars/samio11/SH-Academy-Client)
![GitHub forks](https://img.shields.io/github/forks/samio11/SH-Academy-Client)
![GitHub license](https://img.shields.io/github/license/samio11/SH-Academy-Client)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ by Samio**

[⬆ Back to Top](#-sh-academy-client---modern-learning-management-system)

</di
