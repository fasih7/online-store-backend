# Online Store Backend

A comprehensive e-commerce backend API built with NestJS, featuring user management, product catalog, order processing, and notification systems.

## 🚀 Features

### Core Modules

- **User Management**: Registration, authentication, profile management with role-based access control
- **Product Catalog**: Product management with categories, featured products, and search functionality
- **Order Processing**: Complete order lifecycle management with order items
- **Category Management**: Hierarchical category system for product organization
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Email Notifications**: Automated email notifications for order confirmations and user verification
- **Caching**: Redis integration for improved performance

### Technical Features

- **Dual Database Support**: PostgreSQL (primary) and MongoDB (optional) with repository pattern
- **API Documentation**: Swagger/OpenAPI documentation available at `/docs`
- **Request Logging**: Morgan middleware for HTTP request logging
- **Global Exception Handling**: Centralized error handling and logging
- **Email Templates**: Handlebars-based email templates for notifications
- **Validation**: Class-validator for request validation
- **TypeScript**: Full TypeScript support with strict typing

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (primary), MongoDB (optional)
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Email**: Nodemailer with Gmail SMTP
- **Caching**: Redis
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Validation**: Class-validator, Class-transformer

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Redis (optional, for caching)
- MongoDB (optional, if using MongoDB features)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd online-store-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp example.env .env
   ```

   Update the `.env` file with your configuration:

   ```env
   PORT=3000

   # PostgreSQL Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_postgres_password
   DATABASE_NAME=product_catalog

   # MongoDB (optional)
   MONGO_CONNECTION_STRING=your_mongodb_connection_string

   # JWT Configuration
   JWT_SECRET_KEY=your_long_jwt_secret_key
   JWT_EXPIRATION_TIME=30m

   # Email Configuration (Gmail SMTP)
   EMAIL_ID=your_email@gmail.com
   APP_PASSWORD=your_gmail_app_password

   # Redis Configuration (optional)
   REDIS_URL=redis://localhost:6379

   # Password Hashing
   SALT_ROUNDS=10
   ```

4. **Database Setup**

   ```bash
   # PostgreSQL setup
   createdb product_catalog

   # The application will automatically create tables on startup
   ```

## 🚀 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The application will be available at `http://localhost:3000`

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

- **Swagger UI**: `http://localhost:3000/docs`

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Authentication guards
│   ├── strategies/      # Passport strategies
│   └── utils/           # Auth utilities
├── categories/          # Category management
│   ├── dto/             # Category DTOs
│   ├── entities/        # TypeORM entities
│   ├── repos/           # Repository implementations
│   └── schemas/         # MongoDB schemas
├── config/              # Configuration files
├── global/              # Global utilities and types
│   ├── helpers/         # Helper functions
│   ├── repo/            # Base repository classes
│   └── types/           # Shared type definitions
├── notifications/       # Email notification system
├── orders/              # Order management
│   ├── dto/             # Order DTOs
│   ├── entities/        # Order entities
│   ├── repos/           # Order repositories
│   └── schemas/         # Order schemas
├── products/            # Product management
│   ├── controllers/     # Product controllers
│   ├── dto/             # Product DTOs
│   ├── entities/        # Product entities
│   ├── repo/            # Product repositories
│   ├── schemas/         # Product schemas
│   └── services/        # Product services
├── templates/           # Email templates
└── user/                # User management
    ├── dto/             # User DTOs
    ├── entities/        # User entities
    ├── repos/           # User repositories
    ├── schemas/         # User schemas
    └── utils/           # User utilities
```

## 🔐 Authentication

The API uses JWT-based authentication with the following endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify` - Email verification
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

## 📊 Database Schema

### Key Entities

- **Users**: User accounts with roles (admin, user, guest)
- **Products**: Product catalog with categories and pricing
- **Categories**: Hierarchical product categories
- **Orders**: Order management with order items
- **OrderItems**: Individual items within orders
- **Addresses**: User shipping addresses
- **FeaturedProducts**: Featured product management

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📝 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔧 Configuration

The application uses a modular configuration system with environment variables. Key configuration areas:

- **Database**: PostgreSQL connection settings
- **Authentication**: JWT secret and expiration
- **Email**: SMTP configuration for notifications
- **Redis**: Caching configuration
- **Logging**: Winston logger configuration

## 📧 Email Templates

The application includes Handlebars templates for:

- User registration verification
- Password reset verification
- Order confirmation emails

Templates are located in `src/templates/` directory.

## 🚀 Deployment

For production deployment:

1. Set up PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Start in production mode: `npm run start:prod`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using NestJS
