# MANDIACX Security Monitoring System

A modern, real-time CCTV monitoring and incident management dashboard built with Next.js, featuring an advanced timeline visualization for security incidents across multiple cameras.

## 🚀 Features

- **Real-time Incident Monitoring**: Track security incidents across multiple camera feeds
- **Interactive Timeline**: 24-hour timeline with scrubber functionality for incident navigation
- **Incident Management**: Mark incidents as resolved/unresolved with filtering capabilities
- **Multi-Camera Support**: Monitor incidents from multiple camera locations
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Type-Safe**: Built with TypeScript for enhanced reliability

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Deployment Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mandiacx-security-monitoring
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mandiacx_db"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

### 5. Development Server
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Production Deployment

#### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add the `DATABASE_URL` environment variable in Vercel dashboard
3. Deploy automatically on push to main branch



#### Manual Server Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🏗️ Tech Decisions & Architecture

### Framework Choice: Next.js 14
- **App Router**: Modern routing with server components for better performance
- **API Routes**: Built-in API functionality for backend operations
- **Server-Side Rendering**: Improved SEO and initial load performance
- **TypeScript Integration**: Native TypeScript support for type safety

### Database: PostgreSQL + Prisma
- **PostgreSQL**: Robust relational database perfect for structured incident data
- **Prisma ORM**: Type-safe database operations with excellent TypeScript integration
- **Schema-First**: Database schema defined in `schema.prisma` for consistency

### State Management: React Hooks
- **useState/useEffect**: Simple state management for component-level state
- **No External Library**: Avoided Redux/Zustand for this scope to keep bundle size minimal

### Styling: Tailwind CSS
- **Utility-First**: Rapid development with consistent design system
- **Responsive Design**: Built-in responsive utilities for mobile-first approach
- **Dark Theme**: Security monitoring typically requires dark interfaces
- **Custom Components**: Modular component architecture for maintainability

### Timeline Implementation
- **Canvas-Free Approach**: Used HTML/CSS for better accessibility and easier maintenance
- **Custom Scrubber**: Interactive timeline scrubber with drag functionality
- **Responsive Design**: Adaptive time markers based on available screen space
- **Performance Optimized**: Memoized calculations to prevent unnecessary re-renders

## 📁 Project Structure

```
├── app/
│   ├── components/          # React components
│   │   ├── IncidentList.tsx
│   │   ├── IncidentPlayer.tsx
│   │   ├── Timeline.tsx
│   │   └── Navbar.tsx
│   ├── api/                 # API routes
│   │   ├── incidents/
│   │   └── placeholder/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Dashboard page
│   └── globals.css         # Global styles
├── lib/
│   └── prisma.ts           # Prisma client
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seeding
└── README.md
```

## 🔮 If I Had More Time...

### Performance Optimizations
- **Virtual Scrolling**: For handling thousands of incidents in the timeline
- **WebSocket Integration**: Real-time incident updates without polling
- **Image Optimization**: Lazy loading and compression for incident thumbnails
- **Caching Layer**: Redis for incident data caching and session management

### Enhanced Features
- **Advanced Filtering**: Filter by camera, incident type, date range, severity
- **Incident Analytics**: Statistics dashboard with charts and trends
- **Export Functionality**: PDF reports, CSV exports for incident data
- **User Management**: Role-based access control (Admin, Operator, Viewer)
- **Notifications**: Email/SMS alerts for critical incidents
- **Video Playback**: Actual video streaming instead of static thumbnails

### Technical Improvements
- **Database Optimization**: Indexing, query optimization, database clustering
- **Microservices**: Split into separate services (Auth, Incidents, Cameras, Notifications)
- **API Versioning**: Proper versioning strategy for API endpoints
- **Error Boundaries**: Better error handling and user feedback
- **Testing Suite**: Unit tests, integration tests, E2E testing with Playwright
- **Monitoring**: Application monitoring with Sentry, logging with Winston

### UX/UI Enhancements
- **Keyboard Navigation**: Full keyboard accessibility for power users
- **Custom Themes**: Light/dark mode toggle, brand customization
- **Mobile App**: React Native companion app for mobile monitoring
- **Advanced Timeline**: Zoom levels, multi-day view, incident grouping
- **Drag & Drop**: Reorderable incident lists, camera management

### Security & Compliance
- **Audit Logs**: Track all user actions for compliance
- **Data Encryption**: End-to-end encryption for sensitive incident data
- **GDPR Compliance**: Data retention policies, user data management
- **Two-Factor Authentication**: Enhanced security for user accounts
- **IP Whitelisting**: Restrict access to specific IP ranges

### DevOps & Infrastructure
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Monitoring & Alerting**: System health monitoring, performance alerts
- **Load Balancing**: Handle multiple concurrent users
- **Database Migrations**: Proper migration strategy for schema changes
- **Backup Strategy**: Automated backups with point-in-time recovery

## 📊 Sample Data

The application comes pre-seeded with:
- **4 Cameras**: Different locations (Main Entrance, Vault, Shop Floor, Loading Dock)
- **12 Incidents**: Various types across different time periods
- **Mixed Status**: Both resolved and unresolved incidents for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for modern security monitoring needs.