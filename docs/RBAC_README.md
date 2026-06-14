# 🔐 RBAC System - Supabase PostgreSQL

A production-ready **Role-Based Access Control (RBAC)** system built on Supabase PostgreSQL 17.6 with Row Level Security (RLS), JWT custom claims sync, auto role assignment, and full audit logging.

## 📊 System Overview

| Component | Count |
|-----------|-------|
| Tables | 5 (roles, permissions, role_permissions, user_roles, rbac_audit_log) |
| RLS Policies | 20 |
| Functions | 15 |
| Triggers | 14 |
| System Roles | 4 |
| Permissions | 20 across 6 resources |

## 🛡️ Role Hierarchy

| Role | Permissions | Description |
|------|------------|-------------|
| **super_admin** | 20 (All) | Full system access. Manages everything including system settings and role definitions. |
| **admin** | 18 | Manages users, content, and most settings. Cannot modify system config or delete roles. |
| **manager** | 10 | Content management + user viewing + analytics + storage. |
| **user** | 5 | Basic content read/create/update + storage read/upload. |

## 🚀 Quick Start

### 1. Run the Migration

Execute `sql/001_rbac_system_setup.sql` in your Supabase SQL Editor or via the Management API.

### 2. Create Super Admin

```sql
-- Via Supabase Auth Admin API or SQL:
-- Create user first, then assign super_admin role

INSERT INTO public.user_roles (user_id, role_id, assigned_by)
SELECT
    u.id,
    r.id,
    u.id
FROM auth.users u
CROSS JOIN public.roles r
WHERE u.email = 'your-admin@example.com'
AND r.name = 'super_admin';
```

### 3. New Users Auto-Get 'user' Role

The `on_auth_user_created` trigger automatically assigns the `user` role to every new signup. No manual step needed.

## 📋 Permission Matrix

| Permission | Resource | Action | super_admin | admin | manager | user |
|-----------|----------|--------|:-----------:|:-----:|:-------:|:----:|
| users.create | users | create | ✅ | ✅ | — | — |
| users.read | users | read | ✅ | ✅ | ✅ | — |
| users.update | users | update | ✅ | ✅ | — | — |
| users.delete | users | delete | ✅ | ✅ | — | — |
| users.manage_roles | users | manage_roles | ✅ | ✅ | — | — |
| roles.create | roles | create | ✅ | ✅ | — | — |
| roles.read | roles | read | ✅ | ✅ | — | — |
| roles.update | roles | update | ✅ | ✅ | — | — |
| roles.delete | roles | delete | ✅ | — | — | — |
| content.create | content | create | ✅ | ✅ | ✅ | ✅ |
| content.read | content | read | ✅ | ✅ | ✅ | ✅ |
| content.update | content | update | ✅ | ✅ | ✅ | ✅ |
| content.delete | content | delete | ✅ | ✅ | ✅ | — |
| content.publish | content | publish | ✅ | ✅ | ✅ | — |
| settings.read | settings | read | ✅ | ✅ | — | — |
| settings.update | settings | update | ✅ | — | — | — |
| storage.create | storage | create | ✅ | ✅ | ✅ | ✅ |
| storage.read | storage | read | ✅ | ✅ | ✅ | ✅ |
| storage.delete | storage | delete | ✅ | ✅ | ✅ | — |
| analytics.read | analytics | read | ✅ | ✅ | ✅ | — |

## 🔧 Helper Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `is_super_admin()` | BOOLEAN | Check if current user is super_admin |
| `is_admin_or_above()` | BOOLEAN | Check if current user is admin or super_admin |
| `has_role('role_name')` | BOOLEAN | Check if current user has a specific role |
| `has_permission('perm_name')` | BOOLEAN | Check if current user has a specific permission |
| `get_current_user_roles()` | TEXT[] | Get all roles for current user |
| `get_current_user_permissions()` | TEXT[] | Get all permissions for current user |

### Usage via REST API (RPC)

```javascript
const { data, error } = await supabase.rpc('is_super_admin');
const { data, error } = await supabase.rpc('has_permission', { permission_name: 'users.create' });
const { data, error } = await supabase.rpc('has_role', { role_name: 'admin' });
const { data, error } = await supabase.rpc('get_current_user_roles');
const { data, error } = await supabase.rpc('get_current_user_permissions');
```

### Usage in RLS Policies

```sql
CREATE POLICY "admin_only" ON public.some_table
    FOR INSERT TO authenticated
    WITH CHECK (public.has_permission('content.create'));
```

## 🔄 Automatic Features

### Auto Role Assignment
New users automatically get the `user` role via the `on_auth_user_created` trigger on `auth.users`.

### JWT Custom Claims Sync
When roles change, `app_metadata` is automatically updated with:
- `role`: The highest-priority role name (for quick checks)
- `roles`: Array of all role names (for complete listing)

This sync happens via the `on_user_role_changed` trigger on `user_roles`.

### Audit Logging
All changes to `roles`, `user_roles`, and `role_permissions` are automatically logged in `rbac_audit_log` with:
- Action type (INSERT/UPDATE/DELETE)
- Old and new data (JSONB)
- Who performed the change
- When it was performed

## 🔒 Security Features

- **RLS enforced on all 5 tables** — No data access bypass possible
- **Admin privilege escalation blocked** — Admins cannot assign super_admin or admin roles
- **System role protection** — System roles cannot be deleted through API
- **Internal functions secured** — Trigger/sync functions not accessible to anon/PUBLIC
- **Audit trail** — All RBAC changes are tracked with full before/after data
- **NOT NULL constraints** — `is_system` and `assigned_by` cannot be NULL

## 📁 Project Structure

```
rbac-project/
├── README.md
├── sql/
│   └── 001_rbac_system_setup.sql    # Complete migration
├── docs/
│   └── RBAC_System_Documentation.docx  # Full documentation
└── .env.example                      # Environment variables template
```

## 🔑 Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

## 📝 Adding New Permissions

```sql
-- 1. Add the permission
INSERT INTO public.permissions (name, description, resource, action)
VALUES ('products.delete', 'Delete products', 'products', 'delete');

-- 2. Assign to roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name IN ('super_admin', 'admin') AND p.name = 'products.delete';

-- 3. Create RLS policy using has_permission()
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_delete_authorized" ON public.products
    FOR DELETE TO authenticated
    USING (public.has_permission('products.delete'));
```

## License

MIT
