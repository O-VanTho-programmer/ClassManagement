# TutorDesk - Coding & Development Guidelines

This document outlines the rules and conventions for developing on the TutorDesk codebase. All contributors and AI agents must follow these patterns to maintain consistency, security, and performance.

---

## 📁 File Structure & Routing

### 1. API Routes
- **Location**: All serverless API routes must be placed in `src/app/api/[route_name]/route.ts`.
- **Naming**: Directory names for API routes must use **snake_case** (e.g., `get_class_grade_weights`, `save_class_grade_weights`).
- **HTTP Methods**: Implement standard REST HTTP methods (`GET`, `POST`, `DELETE`, `PUT`) using Next.js `NextRequest`/`NextResponse`.

### 2. Dashboard Pages
- **Location**: Placed in `src/app/dashboard/hub/[hub_id]/...`.
- **Layouts**: Respect the nested React layouts (`layout.tsx`) that manage sidebars, navigation, and tenant-scoped headers.

---

## 💾 Database & SQL Conventions

### 1. Schema Casing
- **Database Columns**: Physical MySQL database columns use **PascalCase** (e.g., `ClassId`, `StudentId`, `IsPaid`, `Version`).
- **API Serializations**: Always alias query results to **snake_case** using SQL `AS` aliases for consistency with JSON standards:
  ```sql
  SELECT ClassId AS class_id, Category AS category, Weight AS weight FROM class_grade_weight;
  ```

### 2. Transaction Safety
- Always handle multi-row queries or mutations involving multiple database writes inside a transaction:
  ```typescript
  const connection = await pool.getConnection();
  try {
      await connection.beginTransaction();
      // DB operations...
      await connection.commit();
  } catch (error) {
      await connection.rollback();
      throw error;
  } finally {
      connection.release();
  }
  ```

### 3. Invoice Table Versioning (Recurring Billing)
In the TutorDesk domain model, a class can have recurring billing (e.g., Monthly or Quarterly tuition) rather than just a single upfront course fee. 

The `Version` column (an integer) represents the sequential **Billing Cycle / Tuition Period** for a student enrolled in a specific class. 

For example:
- `Version = 1`: Tuition for Month 1 (or Quarter 1 / Initial Course fee).
- `Version = 2`: Tuition for Month 2 (or Quarter 2).
- `Version = 3`: Tuition for Month 3 (or Quarter 3).

- **Differentiating Recurring Invoices**: Because a student stays in the same class across multiple billing cycles, a student can have multiple invoices for the same class. Without `Version`, the system cannot uniquely identify which specific cycle installment an invoice belongs to.
- **Ensuring Idempotency & Preventing Duplicate Billing**: When automated background workers or cron jobs evaluate classes to generate new recurring invoices, `Version` acts as the critical control mechanism. Always check for the existence of `(ClassId, StudentId, Version)` to ensure a student is billed **exactly once** per billing cycle.
- **State & Feature Gating**: When checking payment status for the current active period, match the student's invoice status against the current active billing period:
  `SELECT IsPaid FROM invoice WHERE ClassId = ? AND StudentId = ? AND Version = ?`

---

## 🔐 Security & Permissions

### 1. Middleware Guards
- Standard route access control is enforced at the middleware layer (`src/middleware.ts`) via JWT verification.

### 2. Granular API Permissions
- Every backend endpoint must validate the user's role/permission before executing business logic using `checkPermission()`:
  ```typescript
  import { checkPermission, PERMISSIONS } from "@/lib/permissions";
  
  const permissionCheck = await checkPermission(req, PERMISSIONS.EDIT_CLASS, hubId);
  if (permissionCheck instanceof NextResponse) {
      return permissionCheck; // Returns 403 Forbidden automatically
  }
  ```

---

## 🔄 State Management & Custom Hooks

### 1. Axios Helpers
- Place raw HTTP network requests under `src/lib/api/[helperName].ts`.
- Use the shared axios instance imported from `../axios` or `@/lib/axios` to ensure default headers (like auth cookies) are processed.

### 2. React Query Hooks
- **Query Hooks**: Place under `src/hooks/useGet[Name].ts`. Set explicit `queryKey` arrays containing relevant parameters for automatic cache busting.
- **Mutation Hooks**: Place under `src/hooks/use[Name]Mutation.ts` or `src/hooks/useUpdate[Name].ts`. Integrate with `useAlert` context (`showAlert`) to report successes or errors clearly to the user.

### 3. File Extensions & Typing Constraints
- **TypeScript Files (`.ts`, `.tsx`)**: Utilize standard static typing, annotations, and assertions.
- **JavaScript Files (`.js`, `.jsx`)**: Never write TypeScript syntax (e.g., type assertions like `as string` or type annotations) inside `.js`/`.jsx` files. This causes ECMAScript parser failures during runtime and build compilation. Keep JavaScript files completely standard-compliant.
