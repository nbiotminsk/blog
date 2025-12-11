# Nikolai Web Dashboard

A React + Vite + TypeScript frontend for the Nikolai Document Management System.

## Features

- **Dashboard**: Overview of system status and navigation
- **Entities**: Manage contacts with searchable table, category assignment
- **Categories**: Simple list view with add/remove functionality
- **Templates**: Upload DOCX/HTML templates with placeholder detection
- **Documents**: Generate documents using templates and entities

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **React Query** for server state management
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling
- **Axios** for API communication

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Nikolai API server running on port 3002

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.development
```

3. Update `.env.development` with your API configuration:
```env
VITE_API_URL=http://localhost:3002
VITE_APP_TITLE=Nikolai Dashboard
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Type check without emitting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── ui/             # Basic UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
├── styles/             # Global styles and CSS
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## API Integration

The frontend communicates with the Nikolai API server running on port 3002. API endpoints:

- **GET** `/api/health` - Health check
- **GET** `/api/entities` - List entities
- **POST** `/api/entities` - Create entity
- **GET** `/api/entities/search` - Search entities
- **GET** `/api/entities/{id}` - Get entity
- **PATCH** `/api/entities/{id}` - Update entity
- **DELETE** `/api/entities/{id}` - Delete entity
- **GET** `/api/categories` - List categories
- **POST** `/api/categories` - Create category
- **GET** `/api/categories/{id}` - Get category
- **PATCH** `/api/categories/{id}` - Update category
- **DELETE** `/api/categories/{id}` - Delete category
- **GET** `/api/templates` - List templates
- **POST** `/api/templates` - Upload template
- **GET** `/api/templates/{id}` - Get template
- **DELETE** `/api/templates/{id}` - Delete template
- **GET** `/api/documents` - List document records
- **GET** `/api/documents/{id}` - Get document record
- **POST** `/api/documents/generate` - Generate document

## Key Features

### Search and Filtering
- Debounced search input for entities
- Real-time search across name, email, and phone fields
- Pagination support

### Template Management
- File upload for DOCX/HTML templates
- Automatic placeholder detection
- Template preview with detected placeholders

### Document Generation
- Select entity and template
- Dynamic form generation based on template placeholders
- Real-time generation status tracking

### Form Validation
- Client-side validation using Zod
- Server error handling and display
- Loading states and optimistic updates

### Error Handling
- Global error boundaries
- User-friendly error messages
- Network error handling with retry logic

## Development Guidelines

### Code Style
- TypeScript for type safety
- ESLint + Prettier for code quality
- Functional components with hooks
- Consistent naming conventions

### State Management
- React Query for server state
- React state for local UI state
- Custom hooks for reusable logic

### Styling
- Tailwind CSS for utility-first styling
- Custom CSS classes for repeated patterns
- Responsive design principles
- Dark mode ready (can be extended)

## Deployment

The app can be deployed to any static hosting service:

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Configure environment variables for production
4. Set up API proxy or CORS configuration as needed

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new features
3. Include error handling and loading states
4. Test thoroughly before submitting

## Troubleshooting

### Common Issues

**API Connection Failed**
- Ensure the API server is running on the configured port
- Check environment variables for correct API URL
- Verify CORS configuration on the API server

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run typecheck`
- Update dependencies if needed

**Development Server Not Starting**
- Check if port 3000 is available
- Ensure all environment variables are set
- Run `npm install` to ensure dependencies are installed

For more help, check the API server logs and ensure all backend services are running.
