-- ============================================================
-- RBAC System - Complete Setup Migration
-- Project: alaminseller's Project
-- Database: Supabase PostgreSQL 17.6
-- Region: ap-southeast-1 (Singapore)
-- Date: June 15, 2026
-- ============================================================

-- ========================================
-- STEP 1: Create RBAC Tables
-- ========================================

-- Roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Role-Permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(role_id, permission_id)
);

-- User-Roles junction table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, role_id)
);

-- RBAC Audit Log table
CREATE TABLE IF NOT EXISTS public.rbac_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES auth.users(id),
    performed_at TIMESTAMPTZ DEFAULT now(),
    ip_address INET
);

-- ========================================
-- STEP 2: Insert System Roles
-- ========================================

INSERT INTO public.roles (name, description, is_system) VALUES
    ('super_admin', 'Full system access with all permissions. Can manage all resources, users, and system settings.', true),
    ('admin', 'Administrative access. Can manage users, content, and most settings but cannot modify system-level configuration.', true),
    ('manager', 'Can manage content and users within assigned scope. Limited administrative capabilities.', true),
    ('user', 'Standard user with basic read/write access to own resources only.', true)
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- STEP 3: Insert Permissions
-- ========================================

INSERT INTO public.permissions (name, description, resource, action) VALUES
    ('users.create', 'Create new users', 'users', 'create'),
    ('users.read', 'View user profiles', 'users', 'read'),
    ('users.update', 'Update user profiles', 'users', 'update'),
    ('users.delete', 'Delete users', 'users', 'delete'),
    ('users.manage_roles', 'Assign or revoke user roles', 'users', 'manage_roles'),
    ('roles.create', 'Create new roles', 'roles', 'create'),
    ('roles.read', 'View roles and permissions', 'roles', 'read'),
    ('roles.update', 'Modify roles and permissions', 'roles', 'update'),
    ('roles.delete', 'Delete roles', 'roles', 'delete'),
    ('content.create', 'Create content', 'content', 'create'),
    ('content.read', 'View content', 'content', 'read'),
    ('content.update', 'Edit content', 'content', 'update'),
    ('content.delete', 'Delete content', 'content', 'delete'),
    ('content.publish', 'Publish or unpublish content', 'content', 'publish'),
    ('settings.read', 'View system settings', 'settings', 'read'),
    ('settings.update', 'Modify system settings', 'settings', 'update'),
    ('storage.create', 'Upload files', 'storage', 'create'),
    ('storage.read', 'View/download files', 'storage', 'read'),
    ('storage.delete', 'Delete files', 'storage', 'delete'),
    ('analytics.read', 'View analytics and reports', 'analytics', 'read')
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- STEP 4: Assign Permissions to Roles
-- ========================================

-- super_admin: ALL 20 permissions
INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
    WHERE r.name = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- admin: 18 permissions (excludes settings.update, roles.delete)
INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
    WHERE r.name = 'admin' AND p.name NOT IN ('settings.update', 'roles.delete')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- manager: 10 permissions
INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
    WHERE r.name = 'manager' AND p.name IN (
        'content.create', 'content.read', 'content.update', 'content.delete', 'content.publish',
        'users.read', 'analytics.read', 'storage.create', 'storage.read', 'storage.delete'
    )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- user: 5 permissions
INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
    WHERE r.name = 'user' AND p.name IN (
        'content.read', 'content.create', 'content.update', 'storage.create', 'storage.read'
    )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ========================================
-- STEP 5: Create Helper Functions
-- ========================================

-- Get current user's roles
CREATE OR REPLACE FUNCTION public.get_current_user_roles()
RETURNS SETOF TEXT AS $$
    SELECT r.name
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if current user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = role_name
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if current user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT public.has_role('super_admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if current user is admin or above
CREATE OR REPLACE FUNCTION public.is_admin_or_above()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if current user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.role_permissions rp ON ur.role_id = rp.role_id
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = auth.uid() AND p.name = permission_name
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get all permissions for current user
CREATE OR REPLACE FUNCTION public.get_current_user_permissions()
RETURNS SETOF TEXT AS $$
    SELECT DISTINCT p.name
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ========================================
-- STEP 6: Create Triggers
-- ========================================

-- Auto-update updated_at on roles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-assign 'user' role on new signup
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
BEGIN
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'user' LIMIT 1;
    IF default_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id, assigned_by)
        VALUES (NEW.id, default_role_id, NEW.id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_signup();

-- JWT claims sync: helper to sync all users with a specific role
CREATE OR REPLACE FUNCTION public.sync_user_roles_to_jwt_by_role(target_role_id UUID)
RETURNS VOID AS $$
DECLARE
    user_record RECORD;
    role_names TEXT[];
    highest_role TEXT;
BEGIN
    FOR user_record IN
        SELECT DISTINCT user_id FROM public.user_roles WHERE role_id = target_role_id
    LOOP
        SELECT ARRAY_AGG(r.name) INTO role_names
        FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_record.user_id;
        IF role_names IS NULL THEN role_names := '{}'; END IF;
        SELECT r.name INTO highest_role
        FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_record.user_id
        ORDER BY CASE r.name
            WHEN 'super_admin' THEN 1 WHEN 'admin' THEN 2
            WHEN 'manager' THEN 3 WHEN 'user' THEN 4 ELSE 5
        END LIMIT 1;
        UPDATE auth.users SET raw_app_meta_data =
            COALESCE(raw_app_meta_data, '{}'::jsonb) ||
            jsonb_build_object('roles', role_names, 'role', COALESCE(highest_role, ''))
        WHERE id = user_record.user_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- JWT claims sync: trigger on user_roles changes
CREATE OR REPLACE FUNCTION public.sync_user_roles_to_jwt()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id UUID;
    role_names TEXT[];
    highest_role TEXT;
BEGIN
    IF TG_OP = 'DELETE' THEN target_user_id := OLD.user_id;
    ELSE target_user_id := NEW.user_id; END IF;
    SELECT ARRAY_AGG(r.name) INTO role_names
    FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = target_user_id;
    IF role_names IS NULL THEN role_names := '{}'; END IF;
    SELECT r.name INTO highest_role
    FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = target_user_id
    ORDER BY CASE r.name
        WHEN 'super_admin' THEN 1 WHEN 'admin' THEN 2
        WHEN 'manager' THEN 3 WHEN 'user' THEN 4 ELSE 5
    END LIMIT 1;
    UPDATE auth.users SET raw_app_meta_data =
        COALESCE(raw_app_meta_data, '{}'::jsonb) ||
        jsonb_build_object('roles', role_names, 'role', COALESCE(highest_role, ''))
    WHERE id = target_user_id;
    IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_role_changed ON public.user_roles;
CREATE TRIGGER on_user_role_changed
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.sync_user_roles_to_jwt();

-- JWT sync on role rename
CREATE OR REPLACE FUNCTION public.sync_roles_on_rename()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.name != NEW.name THEN
        PERFORM public.sync_user_roles_to_jwt_by_role(OLD.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_role_name_changed ON public.roles;
CREATE TRIGGER on_role_name_changed
    AFTER UPDATE OF name ON public.roles
    FOR EACH ROW EXECUTE FUNCTION public.sync_roles_on_rename();

-- ========================================
-- STEP 7: Audit Log Triggers
-- ========================================

CREATE OR REPLACE FUNCTION public.audit_user_roles_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.rbac_audit_log (action, table_name, record_id, new_data, performed_by)
        VALUES ('INSERT', 'user_roles', NEW.id,
            jsonb_build_object('user_id', NEW.user_id, 'role_id', NEW.role_id, 'assigned_by', NEW.assigned_by), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.rbac_audit_log (action, table_name, record_id, old_data, new_data, performed_by)
        VALUES ('UPDATE', 'user_roles', NEW.id,
            jsonb_build_object('user_id', OLD.user_id, 'role_id', OLD.role_id, 'assigned_by', OLD.assigned_by),
            jsonb_build_object('user_id', NEW.user_id, 'role_id', NEW.role_id, 'assigned_by', NEW.assigned_by), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.rbac_audit_log (action, table_name, record_id, old_data, performed_by)
        VALUES ('DELETE', 'user_roles', OLD.id,
            jsonb_build_object('user_id', OLD.user_id, 'role_id', OLD.role_id, 'assigned_by', OLD.assigned_by), auth.uid());
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.audit_roles_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.rbac_audit_log (action, table_name, record_id, new_data, performed_by)
        VALUES ('INSERT', 'roles', NEW.id,
            jsonb_build_object('name', NEW.name, 'description', NEW.description, 'is_system', NEW.is_system), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.rbac_audit_log (action, table_name, record_id, old_data, new_data, performed_by)
        VALUES ('UPDATE', 'roles', NEW.id,
            jsonb_build_object('name', OLD.name, 'description', OLD.description, 'is_system', OLD.is_system),
            jsonb_build_object('name', NEW.name, 'description', NEW.description, 'is_system', NEW.is_system), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.rbac_audit_log (action, table_name, record_id, old_data, performed_by)
        VALUES ('DELETE', 'roles', OLD.id,
            jsonb_build_object('name', OLD.name, 'description', OLD.description, 'is_system', OLD.is_system), auth.uid());
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.audit_role_permissions_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.rbac_audit_log (action, table_name, record_id, new_data, performed_by)
        VALUES ('INSERT', 'role_permissions', NEW.id,
            jsonb_build_object('role_id', NEW.role_id, 'permission_id', NEW.permission_id), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.rbac_audit_log (action, table_name, record_id, old_data, performed_by)
        VALUES ('DELETE', 'role_permissions', OLD.id,
            jsonb_build_object('role_id', OLD.role_id, 'permission_id', OLD.permission_id), auth.uid());
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS audit_user_roles ON public.user_roles;
CREATE TRIGGER audit_user_roles
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.audit_user_roles_changes();

DROP TRIGGER IF EXISTS audit_roles ON public.roles;
CREATE TRIGGER audit_roles
    AFTER INSERT OR UPDATE OR DELETE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION public.audit_roles_changes();

DROP TRIGGER IF EXISTS audit_role_permissions ON public.role_permissions;
CREATE TRIGGER audit_role_permissions
    AFTER INSERT OR DELETE ON public.role_permissions
    FOR EACH ROW EXECUTE FUNCTION public.audit_role_permissions_changes();

-- ========================================
-- STEP 8: Enable RLS on All Tables
-- ========================================

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rbac_audit_log ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 9: RLS Policies
-- ========================================

-- roles policies
CREATE POLICY "roles_select_authenticated" ON public.roles
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_insert_super_admin" ON public.roles
    FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "roles_update_super_admin" ON public.roles
    FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "roles_delete_super_admin" ON public.roles
    FOR DELETE TO authenticated USING (public.is_super_admin() AND is_system = false);

-- permissions policies
CREATE POLICY "permissions_select_authenticated" ON public.permissions
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "permissions_insert_super_admin" ON public.permissions
    FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "permissions_update_super_admin" ON public.permissions
    FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "permissions_delete_super_admin" ON public.permissions
    FOR DELETE TO authenticated USING (public.is_super_admin());

-- role_permissions policies
CREATE POLICY "role_permissions_select_authenticated" ON public.role_permissions
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "role_permissions_insert_super_admin" ON public.role_permissions
    FOR INSERT TO authenticated WITH CHECK (public.is_super_admin());
CREATE POLICY "role_permissions_update_super_admin" ON public.role_permissions
    FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "role_permissions_delete_super_admin" ON public.role_permissions
    FOR DELETE TO authenticated USING (public.is_super_admin());

-- user_roles policies (admin cannot assign super_admin or admin)
CREATE POLICY "user_roles_select" ON public.user_roles
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin_or_above());
CREATE POLICY "user_roles_insert" ON public.user_roles
    FOR INSERT TO authenticated WITH CHECK (
        public.is_super_admin()
        OR (public.has_role('admin') AND NOT EXISTS (
            SELECT 1 FROM public.roles r
            WHERE r.id = role_id AND r.name IN ('super_admin', 'admin')
        ))
    );
CREATE POLICY "user_roles_update_super_admin" ON public.user_roles
    FOR UPDATE TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "user_roles_delete" ON public.user_roles
    FOR DELETE TO authenticated USING (
        public.is_super_admin()
        OR (public.has_role('admin') AND NOT EXISTS (
            SELECT 1 FROM public.roles r
            WHERE r.id = user_roles.role_id AND r.name IN ('super_admin', 'admin')
        ))
    );

-- audit_log policies (read-only for super_admin, no direct API writes)
CREATE POLICY "audit_log_select_super_admin" ON public.rbac_audit_log
    FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "audit_log_no_insert" ON public.rbac_audit_log
    FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "audit_log_no_update" ON public.rbac_audit_log
    FOR UPDATE TO authenticated USING (false);
CREATE POLICY "audit_log_no_delete" ON public.rbac_audit_log
    FOR DELETE TO authenticated USING (false);

-- ========================================
-- STEP 10: Indexes
-- ========================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON public.permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON public.permissions(name);
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON public.rbac_audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_performed_at ON public.rbac_audit_log(performed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_performed_by ON public.rbac_audit_log(performed_by);

-- ========================================
-- STEP 11: Grants
-- ========================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.permissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.role_permissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT SELECT ON public.rbac_audit_log TO authenticated;

GRANT SELECT ON public.roles TO anon;
GRANT SELECT ON public.permissions TO anon;
GRANT SELECT ON public.role_permissions TO anon;

-- ========================================
-- STEP 12: Function Security
-- ========================================

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_signup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_user_roles_to_jwt() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.sync_user_roles_to_jwt_by_role(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.sync_roles_on_rename() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- ========================================
-- STEP 13: Realtime
-- ========================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.roles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rbac_audit_log;

