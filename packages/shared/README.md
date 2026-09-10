# Shared Package

Shared utilities và types cho Cookbook monorepo.

## Exports

- **Number formatting**: `formatVn()`, `formatCompactVn()`, `parseVn()`
- **Types**: All TypeScript interfaces for API contracts

## Usage

### Web Admin (TypeScript)

```typescript
import { formatVn, RecipeListItem } from '@cookbook/shared';

const displayQuantity = formatVn(1000); // "1.000"
```

### Backend API (TypeScript)

```typescript
import { RecipeCreateRequest } from '@cookbook/shared';
// Types shared with frontend
```

### Android (Kotlin)

Kotlin code **KHÔNG import trực tiếp** package này. Thay vào đó:
1. OpenAPI spec (`docs/api/openapi.yaml`) là source of truth
2. Dùng plugin Gradle (kotlinx-serialization / OpenAPI Generator) để generate Kotlin data classes
3. Number formatting implement riêng trong `core/util/NumberFormatUtils.kt` (logic giống hệt)

## Development

```bash
# From monorepo root
pnpm --filter=@cookbook/shared build
pnpm --filter=@cookbook/shared test
```