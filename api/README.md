# SFP Animal Management System - Backend

This is the backend API for the Save Fur Pets (SFP) Animal Management System. It's built with Node.js, Express, and PostgreSQL.

## Features

- RESTful API endpoints for managing:
  - Animals
  - Volunteers
  - Applications
  - Interviews
  - Contracts
- JWT authentication with role-based access control
- PostgreSQL database integration with Sequelize ORM
- Input validation
- Error handling
- Database seeding with sample data
- Automatic migrations on startup

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- pnpm (recommended) or npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `api/` directory:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sfp_portal
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Redis (optional, for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Important**: Replace the placeholder values with your actual credentials!

### 3. Set Up PostgreSQL Database

#### Option A: Using Docker (Recommended)

If you have Docker installed, you can start PostgreSQL using the provided docker-compose file:

```bash
# From the project root directory
cd infra
docker-compose up -d postgres
```

This will create a PostgreSQL database with the following credentials:

- Host: `localhost`
- Port: `5432`
- Database: `sfp_portal`
- Username: `sfp_user`
- Password: `sfp_password`

#### Option B: Manual PostgreSQL Setup

1. Install PostgreSQL on your system
2. Start PostgreSQL service
3. Create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sfp_portal;

# Create user (optional)
CREATE USER sfp_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sfp_portal TO sfp_user;

# Exit psql
\q
```

### 4. Run Database Migrations

The application uses Sequelize ORM with automatic migrations. When you start the server, it will automatically:

- Create all necessary tables
- Set up relationships
- Initialize the database schema

**Manual Migration (Optional)**:

If you want to run migrations manually before starting the server:

```bash
node src/migrations/runMigrations.js
```

This will:

- ✅ Create the `volunteers` table
- ✅ Create the `animals` table
- ✅ Create the `applications` table
- ✅ Create the `interviews` table
- ✅ Create the `contracts` table
- ✅ Set up all foreign key relationships

### 5. Seed the Database (Optional)

Populate the database with sample data for testing:

```bash
# Seed volunteers (creates admin, foster, and interviewer accounts)
node src/seeds/seedVolunteers.js

# Seed animals (creates sample animals)
node src/seeds/seedAnimals.js

# Seed applications (creates sample applications)
node src/seeds/seedApplications.js
```

**Default Test Accounts** (created by seedVolunteers.js):

1. **Admin Account**

   - Email: `admin@sfp.com`
   - Password: `admin123`
   - Roles: `admin`, `foster`, `interviewer`

2. **Foster Account**

   - Email: `foster@sfp.com`
   - Password: `foster123`
   - Role: `foster`

3. **Interviewer Account**
   - Email: `interviewer@sfp.com`
   - Password: `interviewer123`
   - Role: `interviewer`

### 6. Start the Server

**Development Mode** (with auto-reload):

```bash
pnpm dev
# or
npm run dev
```

**Production Mode**:

```bash
pnpm start
# or
npm start
```

The server will start on `http://localhost:5001` (or the PORT specified in your `.env` file).

You should see output like:

```
✅ Database connected successfully
✅ Running migrations...
✅ All migrations completed successfully
🚀 Server running on http://localhost:5001
```

## Troubleshooting

### Database Connection Issues

**Error: `ECONNREFUSED` or `Connection refused`**

- Make sure PostgreSQL is running:

  ```bash
  # macOS (if installed via Homebrew)
  brew services start postgresql@14

  # Linux
  sudo systemctl start postgresql

  # Check status
  brew services list  # macOS
  sudo systemctl status postgresql  # Linux
  ```

- Verify your database credentials in `.env`
- Check if PostgreSQL is listening on the correct port:
  ```bash
  psql -U postgres -c "SHOW port;"
  ```

**Error: `database "sfp_portal" does not exist`**

- Create the database as described in Step 3

**Error: `password authentication failed`**

- Double-check your DB_USER and DB_PASSWORD in `.env`
- Make sure the user has proper permissions

### Migration Issues

**Error: `relation already exists`**

This means tables already exist. To reset the database:

```bash
# Connect to PostgreSQL
psql -U postgres -d sfp_portal

# Drop all tables
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO sfp_user;

# Exit and re-run migrations
\q
node src/migrations/runMigrations.js
```

### Port Already in Use

**Error: `EADDRINUSE: address already in use :::5001`**

- Change the PORT in your `.env` file
- Or kill the process using the port:
  ```bash
  # macOS/Linux
  lsof -ti:5001 | xargs kill -9
  ```

## Running the Server

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/register` - Register a new volunteer
- `GET /api/auth/verify` - Verify JWT token (protected)

### Animals

- `GET /api/animals` - Get all animals
- `GET /api/animals/available` - Get available animals
- `GET /api/animals/:id` - Get animal by ID
- `POST /api/animals` - Create a new animal (protected)
- `PUT /api/animals/:id` - Update animal (protected)
- `PATCH /api/animals/:id/state` - Update animal state (protected)

### Volunteers

- `GET /api/volunteers` - Get all volunteers (protected)
- `GET /api/volunteers/current` - Get current volunteers (protected)
- `GET /api/volunteers/:id` - Get volunteer by ID (protected)
- `POST /api/volunteers` - Create a new volunteer
- `PUT /api/volunteers/:id` - Update volunteer (protected)

### Applications

- `GET /api/applications` - Get all applications (protected, role-based filtering)
  - Admins see all applications
  - Interviewers see applications assigned to them
  - Adopters see their own applications
- `GET /api/applications/:id` - Get application by ID (protected)
- `GET /api/applications/animal/:animalId` - Get applications by animal (protected)
- `POST /api/applications` - Create a new application (public)
- `PATCH /api/applications/:id/status` - Update application status (protected)
  - Only admins can approve applications
  - Interviewers can move to "review" status

### Interviews

- `GET /api/interviews` - Get all interviews (protected, filtered by role)
- `GET /api/interviews/:id` - Get interview by ID (protected)
- `GET /api/interviews/application/:applicationId` - Get interviews by application (protected)
- `GET /api/interviews/volunteer/:volunteerId` - Get interviews by volunteer (protected)
- `POST /api/interviews` - Schedule an interview (protected, admin/interviewer)
- `PATCH /api/interviews/:id/result` - Update interview result (protected)

### Contracts

- `GET /api/contracts` - Get all contracts (protected)
- `GET /api/contracts/:id` - Get contract by ID (protected)
- `GET /api/contracts/animal/:animalId` - Get contracts by animal (protected)
- `POST /api/contracts` - Create a contract (protected)
- `PATCH /api/contracts/:id/signature` - Update contract signature (protected)

### Utility

- `GET /api/health` - Health check endpoint
- `GET /` - API welcome message

## Role-Based Access Control

The API uses role-based access control (RBAC) to restrict access to certain endpoints. The available roles are:

### Roles

1. **Admin** (`admin`)

   - Full access to all endpoints
   - Can approve/reject applications
   - Can manage all animals, volunteers, and applications
   - Can assign interviewers
   - Can update animal statuses to any value

2. **Interviewer** (`interviewer`)

   - View and manage assigned interviews
   - View applications for animals they're interviewing
   - Move applications to "review" status (reserves animal)
   - Cannot approve applications (admin-only)
   - Can update animal status to "interviewing" or "reserved"

3. **Foster** (`foster`)

   - Manage animals assigned to them
   - Create and update animal profiles
   - Mark animals as "ready for adoption"
   - Cannot publish animals (admin approval required)
   - View applications for their fostered animals

4. **Adopter** (default user role)
   - Submit adoption applications
   - View their own applications
   - Sign contracts
   - Browse available animals

### Authentication Flow

1. **Register/Login**: User registers or logs in with email/password
2. **JWT Token**: Server returns a JWT token
3. **Protected Requests**: Include token in Authorization header
   ```
   Authorization: Bearer <your_jwt_token>
   ```
4. **Role Check**: Server validates token and checks user role
5. **Access Control**: Endpoint access granted/denied based on role

### Example Protected Request

```bash
# Login first
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sfp.com", "password": "admin123"}'

# Use the returned token
curl -X GET http://localhost:5001/api/animals \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Application Workflow

The application follows a specific workflow:

```
Submitted → Interview → Review → Approved/Rejected
    ↓           ↓          ↓           ↓
(animal:     (animal:   (animal:    (animal:
published)  interviewing) reserved)  adopted)
```

### Status Transitions

1. **Submitted**: Initial application status
2. **Interview**: Interviewer schedules interview (animal → "interviewing")
3. **Review**: Interviewer moves to review after successful interview (animal → "reserved")
4. **Approved**: Admin approves application (animal → "adopted", other applications auto-rejected)
5. **Rejected**: Application declined at any stage

## Testing the API

### Using Postman

Import the Postman collection from `/tests/SFP-Portal-API.postman_collection.json`

### Using cURL

```bash
# Health check
curl http://localhost:5001/api/health

# Get available animals (public)
curl http://localhost:5001/api/animals/available

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sfp.com", "password": "admin123"}'

# Get all animals (protected)
curl http://localhost:5001/api/animals \
  -H "Authorization: Bearer <token>"
```

## Development Tips

### Hot Reload

The `pnpm dev` command uses `nodemon` to automatically restart the server when files change.

### Database Reset

To completely reset the database and start fresh:

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE sfp_portal;"
psql -U postgres -c "CREATE DATABASE sfp_portal;"

# Re-run migrations
node src/migrations/runMigrations.js

# Re-seed data
node src/seeds/seedVolunteers.js
node src/seeds/seedAnimals.js
node src/seeds/seedApplications.js
```

### Logs

The server logs all requests and errors to the console. In production, consider using a logging service like Winston or Bunyan.

### Environment Variables

**Development**:

```env
NODE_ENV=development
PORT=5001
DB_HOST=localhost
```

**Production**:

```env
NODE_ENV=production
PORT=5001
DB_HOST=your-production-db-host
JWT_SECRET=use-a-strong-secret-key
```

## Project Structure

```
api/
├── src/
│   ├── config/          # Database and Redis configuration
│   │   ├── database.js
│   │   └── redis.js
│   ├── controller/      # Request handlers
│   │   ├── animalController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── contractController.js
│   │   ├── interviewController.js
│   │   └── volunteerController.js
│   ├── middleware/      # Express middleware
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handler
│   │   └── metrics.js        # Performance metrics
│   ├── migrations/      # Database migrations
│   │   └── runMigrations.js  # Migration runner
│   ├── models/          # Sequelize models
│   │   ├── Animal.js
│   │   ├── Application.js
│   │   ├── Contract.js
│   │   ├── Interview.js
│   │   ├── Volunteer.js
│   │   ├── associations.js   # Model relationships
│   │   └── index.js         # Model exports
│   ├── routes/          # API routes
│   │   ├── animalRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── contractRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── volunteerRoutes.js
│   ├── seeds/           # Database seeders
│   │   ├── seedVolunteers.js
│   │   ├── seedAnimals.js
│   │   └── seedApplications.js
│   ├── services/        # Business logic
│   │   └── emailService.js
│   └── server.js        # Main application entry
├── .env                 # Environment variables
├── package.json
└── README.md
```

## Related Documentation

- [Frontend README](../web/README.md)
- [Infrastructure Setup](../infra/README.md)
- [Testing Guide](../tests/README.md)
- [Application Workflow](../docs/APPLICATION_WORKFLOW_IMPLEMENTATION.md)
- [Role Permissions Guide](../docs/ROLE_PERMISSIONS_GUIDE.md)

## License

This project is licensed under the MIT License.
