# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS fundamentals tutorial project called "iluvcoffe" - a coffee shop API demonstrating core NestJS concepts. The application uses TypeORM with PostgreSQL for database operations and implements a RESTful API for managing coffee resources.

## Development Commands

**Package Manager**: This project uses `pnpm` (not npm or yarn)

```bash
# Install dependencies
pnpm install

# Development with hot-reload
pnpm run start:dev

# Production build
pnpm run build

# Start production server
pnpm run start:prod

# Linting and formatting
pnpm run lint
pnpm run format

# Testing
pnpm run test              # Unit tests
pnpm run test:watch        # Unit tests in watch mode
pnpm run test:e2e          # End-to-end tests
pnpm run test:cov          # Test coverage
pnpm run test:debug        # Debug tests
```

## Database Setup

The application requires a PostgreSQL database. Use Docker Compose to run it:

```bash
# Start PostgreSQL container (from parent directory)
docker-compose -f ../docker-compose.yml up -d

# Stop PostgreSQL container
docker-compose -f ../docker-compose.yml down
```

**Database Configuration** (hardcoded in `src/app.module.ts`):
- Host: localhost
- Port: 5432
- Username: postgres
- Password: postgres
- Database: postgres

**Important**: The app uses `synchronize: true` in TypeORM config, which auto-syncs schema changes (development only - never use in production).

## Architecture

### Module Structure

The application follows NestJS modular architecture:

- **AppModule** (`src/app.module.ts`): Root module that imports TypeOrmModule, CoffeesModule, and CoffeeRatingModule
- **CoffeesModule** (`src/coffees/`): Feature module for coffee-related operations
  - Controller: `coffees.controller.ts` - handles HTTP requests (GET, POST, PATCH, DELETE)
  - Service: `coffees.service.ts` - business logic and database operations
  - Entity: `entities/coffee.entity.ts` - TypeORM entity definition
  - DTOs: `dto/create.coffee.dto.ts` and `dto/update.coffee.dto.ts` - data validation
  - Constants: `coffees.constant.ts` - defines injection tokens (e.g., `COFFEE_BRANDS`)
  - Exports: `CoffeesService` for use in other modules
- **CoffeeRatingModule** (`src/coffee-rating/`): Demonstrates module dependency injection
  - Service: `coffee-rating.service.ts` - injects `CoffeesService` from imported `CoffeesModule`
  - Imports: `CoffeesModule` to access exported services

### Validation Pipeline

The application uses a global ValidationPipe configured in `src/main.ts`:
- `whitelist: true` - strips properties not in DTO
- `forbidNonWhitelisted: true` - throws error for unknown properties
- `transform: true` - auto-transforms payloads to DTO types

DTOs use `class-validator` decorators (e.g., `@IsString()`) for validation.

### TypeORM Patterns

**Repository Pattern**: Services use `@InjectRepository()` to inject TypeORM repositories:
```typescript
constructor(
  @InjectRepository(Coffee)
  private readonly coffeeRepository: Repository<Coffee>
) {}
```

**Common Operations**:
- `find()` - get all records
- `findOneBy({ where: { id } })` - get single record
- `create()` + `save()` - create new record
- `preload()` + `save()` - update existing record
- `remove()` - delete record

**Entity Decorators**:
- `@Entity()` - marks class as database table
- `@PrimaryGeneratedColumn()` - auto-incrementing primary key
- `@Column()` - regular column
- `@Column('json', { nullable: true })` - JSON column type

### DTO Patterns

**Update DTOs**: Use `@nestjs/mapped-types` PartialType to make all fields optional:
```typescript
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
```

### Custom Providers

The `CoffeesModule` demonstrates different custom provider patterns:

**Class Providers** (`useClass`): Conditionally provide different implementations based on environment:
```typescript
{
  provide: ConfigService,
  useClass: process.env.NODE_ENV === 'development'
    ? DevelopmentConfigService
    : ProductionConfigService
}
```

**Factory Providers** (`useFactory`): Asynchronously create provider values with dependency injection:
```typescript
{
  provide: COFFEE_BRANDS, // String token from coffees.constant.ts
  useFactory: async (dataSource: DataSource): Promise<string[]> => {
    const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
    return coffeeBrands
  },
  inject: [DataSource] // Dependencies injected into factory function
}
```

**Provider Tokens**: Custom providers use string tokens defined in `coffees.constant.ts`:
```typescript
export const COFFEE_BRANDS = 'COFFEE_BRANDS'
```

**Injecting Custom Providers**: Use `@Inject()` decorator with the token:
```typescript
constructor(@Inject(COFFEE_BRANDS) brands: string[]) {}
```

## Code Conventions

- Controllers use async/await for database operations
- Services throw `NotFoundException` when resources are not found (imported from `@nestjs/common`)
- Service methods that return single items are typed with `Promise<Entity>`
- Service methods that return arrays are typed with `Entity[]`
- Routes use RESTful conventions: `GET /coffees`, `GET /coffees/:id`, `POST /coffees`, `PATCH /coffees/:id`, `DELETE /coffees/:id`

## Key Dependencies

- `@nestjs/typeorm` - TypeORM integration
- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `class-validator` - DTO validation
- `class-transformer` - object transformation
- `@nestjs/mapped-types` - DTO mapping utilities
