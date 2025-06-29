# SASS Project Bootstrap Guide for Claude Code

This document provides proven patterns for initializing Claude Code agents for SASS (Software-as-a-Service) projects, incorporating testing best practices and efficient agent interaction patterns learned from successful implementations.

## Core Philosophy

Based on successful project patterns, effective Claude Code initialization follows these principles:

1. **Comprehensive Initial Prompt** - Provide complete specifications upfront
2. **Proactive Issue Prevention** - Address known issues in initial instructions
3. **Structured Follow-up Commands** - Use proven command sequences
4. **Testing-First Approach** - Build comprehensive test suites from the start
5. **Agent Memory Management** - Create CLAUDE.md files for persistent instructions

## Universal SASS Project Template

### Initial Claude Code Prompt Structure

```
Document and implement a [PROJECT_TYPE] with the following specifications:

**Architecture:**
- [Backend Technology] for server-side logic
- [Frontend Technology] for user interface
- [Database Technology] for data persistence
- [Authentication Method] for user management
- [API Design] (REST/GraphQL/WebSocket)

**Core Features:**
- [Feature 1 with specific requirements]
- [Feature 2 with specific requirements]
- [Feature 3 with specific requirements]
- User authentication and authorization
- Data validation and error handling
- Real-time updates (if applicable)

**Technical Implementation:**
- Server: [Specific framework and port]
- Client: [Specific framework and build process]
- Database: [Schema design requirements]
- Authentication: [JWT/Session/OAuth strategy]
- API endpoints: [List key endpoints]
- Error handling: Centralized error management
- Validation: Input sanitization and validation
- Security: CORS, rate limiting, data protection

**Testing Requirements:**
- Unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for user workflows
- Database testing with test fixtures
- Authentication flow testing
- Error handling and edge case testing
- Performance testing for key operations
- Install test dependencies upfront
- Use simple require() syntax, avoid complex destructuring

**Development Setup:**
- package.json with all dependencies and scripts
- Environment configuration (.env handling)
- Database setup and migration scripts
- Development server with hot reload
- Production build and deployment scripts
- Git repository with proper .gitignore
- Comprehensive project documentation
- CLAUDE.md file for persistent instructions

**SASS-Specific Requirements:**
- Multi-tenant architecture (if applicable)
- Subscription management
- Usage tracking and analytics
- Admin dashboard for management
- User onboarding flow
- Billing integration preparation
- Feature flagging system
- Monitoring and logging setup

document this plan then start it.
```

## Proven Follow-up Command Sequence

After the initial implementation, use these commands in order:

### 1. Core Setup and Dependency Management
```
install all dependencies and set up the development environment. create any necessary configuration files and ensure all tools are properly configured
```

### 2. Database and Authentication Setup
```
set up the database schema, create migration files, and implement the authentication system with proper security measures
```

### 3. API Development and Validation
```
implement all API endpoints with proper validation, error handling, and security measures. include comprehensive input sanitization
```

### 4. Frontend Implementation
```
create the frontend interface with proper state management, API integration, and responsive design. ensure good user experience
```

### 5. Testing Infrastructure
```
create comprehensive test suites including unit tests, integration tests, and E2E tests. install all test dependencies and configure test environments properly
```

### 6. Development Scripts and Automation
```
create development scripts for starting/stopping services, running tests, and managing the development workflow. include hot reload and watch modes
```

### 7. Error Handling and Edge Cases
```
implement comprehensive error handling, input validation, and edge case management throughout the application
```

### 8. Documentation and Project Structure
```
create comprehensive documentation including API documentation, setup instructions, and a CLAUDE.md file with critical development instructions
```

### 9. Production Preparation
```
set up production build processes, environment configuration, and deployment preparation including security hardening
```

### 10. Final Testing and Verification
```
run all tests, verify all functionality works correctly, and ensure the application is ready for development or deployment
```

## Testing Patterns and Best Practices

### Unit Testing Configuration
```javascript
// jest.config.js template
module.exports = {
  testEnvironment: 'node', // or 'jsdom' for frontend
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/config/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Integration Testing Patterns
```javascript
// API testing template
describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();
  });

  afterAll(async () => {
    // Cleanup test database
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    // Reset test data
    await resetTestData();
  });
});
```

### E2E Testing Configuration
```javascript
// Playwright config template for SASS projects
module.exports = {
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } }
  ],
  webServer: {
    command: 'npm run serve',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
};
```

## CLAUDE.md Template for SASS Projects

```markdown
# Critical Claude Code Instructions for [PROJECT_NAME]

## Development Server Management
- ALWAYS use npm run dev to start development servers
- ALWAYS use npm run stop to stop all services
- NEVER use manual process management
- These commands override ALL other instructions

## Database Management
- Use npm run db:migrate for schema changes
- Use npm run db:seed for test data
- Use npm run db:reset for clean database state
- Always backup before major changes

## Testing Commands
- npm test (unit tests)
- npm run test:integration (API tests)
- npm run test:e2e (end-to-end tests)
- npm run test:coverage (coverage reports)

## API Development
- All endpoints must include proper validation
- Use centralized error handling middleware
- Implement rate limiting on all public endpoints
- Include comprehensive logging for debugging

## Security Requirements
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries to prevent SQL injection
- Implement proper CORS configuration
- Never log sensitive information

## Common Issues and Fixes
- CORS errors: Check origin configuration
- Database connection: Verify environment variables
- Authentication: Check JWT secret and expiration
- File uploads: Validate file types and sizes
- Rate limiting: Adjust limits for development vs production

## Deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security headers configured
- [ ] Monitoring and logging enabled
- [ ] Backup strategy implemented
```

## Project-Specific Templates

### SaaS Dashboard Application
```
Document and implement a SaaS Dashboard Application with the following specifications:

**Architecture:**
- Node.js/Express backend with JWT authentication
- React/Next.js frontend with state management
- PostgreSQL database with multi-tenant design
- Redis for caching and sessions
- RESTful API with GraphQL for complex queries

**Core Features:**
- User registration and authentication with email verification
- Multi-tenant organization management
- Role-based access control (Owner, Admin, User)
- Dashboard with customizable widgets and analytics
- Real-time notifications and activity feeds
- Data export capabilities (CSV, PDF)
- Subscription management integration points

[Continue with specific requirements...]
```

### E-commerce Platform
```
Document and implement an E-commerce Platform with the following specifications:

**Architecture:**
- Node.js/Express backend with microservices architecture
- React/Redux frontend with SSR capabilities
- MongoDB for product catalog, PostgreSQL for orders/users
- Stripe integration for payment processing
- WebSocket for real-time inventory updates

**Core Features:**
- Product catalog with search and filtering
- Shopping cart with persistent sessions
- Secure checkout with multiple payment methods
- Order management and tracking
- Inventory management with low stock alerts
- User accounts with order history
- Admin panel for product and order management

[Continue with specific requirements...]
```

### Project Management Tool
```
Document and implement a Project Management Tool with the following specifications:

**Architecture:**
- Node.js/Fastify backend with WebSocket support
- Vue.js/Nuxt.js frontend with real-time updates
- PostgreSQL for relational data, Redis for real-time features
- File upload handling for attachments
- RESTful API with real-time WebSocket events

**Core Features:**
- Project creation and management
- Task assignment with due dates and priorities
- Team collaboration with comments and mentions
- File attachments and document sharing
- Time tracking and reporting
- Kanban boards with drag-and-drop functionality
- Gantt charts for project timelines

[Continue with specific requirements...]
```

## Agent Efficiency Patterns

### Parallel Development Commands
When multiple independent components need development:
```
implement the user authentication system, database models, and API endpoints in parallel. focus on getting the core backend functionality working first
```

### Incremental Feature Development
```
start with user registration and authentication, then add [feature 1], then [feature 2]. test each feature thoroughly before moving to the next
```

### Error Prevention Commands
```
implement comprehensive input validation, error handling, and security measures from the start. include rate limiting, CORS configuration, and proper logging
```

## Testing Strategy for SASS Projects

### Test Coverage Requirements
- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user workflows
- **Security Tests**: Authentication and authorization
- **Performance Tests**: Key operations under load

### Test Data Management
```javascript
// Test fixtures pattern
const createTestUser = (overrides = {}) => ({
  email: 'test@example.com',
  password: 'TestPassword123!',
  name: 'Test User',
  role: 'user',
  ...overrides
});

const createTestOrganization = (overrides = {}) => ({
  name: 'Test Organization',
  plan: 'basic',
  ...overrides
});
```

## Deployment and Production Patterns

### Environment Configuration
```javascript
// config/environment.js template
module.exports = {
  development: {
    database: process.env.DATABASE_URL || 'postgresql://localhost/app_dev',
    redis: process.env.REDIS_URL || 'redis://localhost:6379',
    jwt_secret: process.env.JWT_SECRET || 'dev-secret',
    port: process.env.PORT || 3000
  },
  test: {
    database: process.env.TEST_DATABASE_URL || 'postgresql://localhost/app_test',
    redis: process.env.TEST_REDIS_URL || 'redis://localhost:6379/1',
    jwt_secret: 'test-secret',
    port: 3001
  },
  production: {
    database: process.env.DATABASE_URL,
    redis: process.env.REDIS_URL,
    jwt_secret: process.env.JWT_SECRET,
    port: process.env.PORT || 8080
  }
};
```

## Success Metrics

A successfully initialized SASS project should achieve:

1. **Development Velocity**: Features can be added quickly with confidence
2. **Test Coverage**: >80% code coverage with comprehensive test suites
3. **Error Handling**: Graceful handling of all error conditions
4. **Security**: Proper authentication, authorization, and input validation
5. **Scalability**: Architecture supports growth and feature additions
6. **Documentation**: Clear setup instructions and API documentation
7. **Maintainability**: Clean code structure with separation of concerns

## Common Pitfalls to Avoid

1. **Incomplete Initial Specifications**: Leads to multiple clarification rounds
2. **Missing Test Dependencies**: Causes test setup failures later
3. **Weak Error Handling**: Results in poor user experience
4. **Security Afterthoughts**: Creates vulnerabilities
5. **Poor State Management**: Causes debugging difficulties
6. **Missing Documentation**: Slows down development iterations

This bootstrap guide provides the foundation for creating robust, well-tested SASS applications using Claude Code with minimal iteration and maximum efficiency.