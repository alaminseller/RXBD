# Task 2-b: Zustand Stores and Custom Hooks

## Agent: full-stack-developer

## Summary
Created 3 Zustand stores and 4 custom hooks for the RxBD prescription platform.

## Files Created

### Stores
1. **`src/store/prescription-store.ts`** - Prescription composer state management
   - Persist middleware with key `rxbd-draft`
   - Partialize excludes `isDirty` from persistence
   - Full CRUD for medications (add, update, remove, reorder)
   - Patient, vitals, clinical data setters
   - Draft management (markDirty, markSaved, resetComposer, loadDraft)
   - Auto-save timestamp tracking via `lastSavedAt`

2. **`src/store/auth-store.ts`** - Authentication and session management
   - Persist middleware with key `rxbd-auth`
   - Login via `POST /api/auth/login` with email/password
   - Logout via `POST /api/auth/logout` (fire-and-forget)
   - Profile update via `PATCH /api/auth/profile`
   - Session token stored in localStorage (`rxbd-session-token`)
   - Exported helpers: `getSessionToken()`, `authHeaders()`

3. **`src/store/settings-store.ts`** - User preferences
   - Persist middleware with key `rxbd-settings`
   - Language: 'en' | 'bn'
   - Theme: 'light' | 'dark' | 'system'
   - Sidebar collapsed toggle

### Hooks
4. **`src/hooks/use-auto-save.ts`** - Auto-save prescription drafts
   - Watches `isDirty` flag, saves at configurable interval (default 10s)
   - Detects existing drafts on mount
   - Returns `lastSavedAt`, `hasDraft`, `resumeDraft()`, `discardDraft()`

5. **`src/hooks/use-medicine-search.ts`** - Medicine search with debounce
   - 200ms debounced search via Fuse.js engine
   - Returns `query`, `setQuery`, `results`, `isLoading`, `selectedMedicine`, `selectMedicine()`, `clearSearch()`

6. **`src/hooks/use-subscription.ts`** - Subscription permission gating
   - Derives `isPremium`, `isFree`, `prescriptionsRemaining`, `canCreatePrescription`
   - Free plan default limit: 30 prescriptions/month

7. **`src/hooks/use-patient-lookup.ts`** - Patient search by name/phone
   - 300ms debounced API search via `/api/patients/search`
   - Returns `query`, `setQuery`, `results`, `isLoading`, `selectedPatient`, `selectPatient()`, `clearSelection()`

## Lint Status
✅ 0 errors, 0 warnings
