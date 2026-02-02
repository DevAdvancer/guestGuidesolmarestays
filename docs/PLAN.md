# Plan: Unified Property Save Transaction

## 1. Goal

Refactor the current multi-request save process (General, Rules, Manual, Emergency) into a single, atomic Server Action. This ensures that all property data is saved successfully or none of it is, preventing data inconsistency.

## 2. Architecture

We will introduce a new server action `savePropertyComplete` that wraps all existing update logic in a `db.transaction()`.

### Backend: `actions/properties.ts`

- **New Function:** `savePropertyComplete(propertyId: string, data: CompletePropertyData)`
- **Logic:**
  1. Start `db.transaction`.
  2. Update/Insert `properties` table.
  3. Process `manualSections` and `manualItems` (diffing/upsert logic).
  4. Process `houseRules` (diffing/upsert logic).
  5. Process `emergencyItems` (diffing/upsert logic).
  6. Return success/failure object.
- **Existing Functions:** Keep individual helper functions (`savePropertyRules`, etc.) but ensure they can be called *within* the transaction or refactor their logic into the main transaction block if Drizzle requires passing the transaction object `tx`.

### Frontend: `PropertyEditorContext.tsx`

- **Update:** `saveChanges()` function.
- **Change:** Replace `Promise.all([ ... ])` with a single await call to `savePropertyComplete`.
- **Handling:** Update local state/dirty state based on the single response.

## 3. Implementation Steps

1. **Modify `actions/properties.ts`**:
    - Import Drizzle's `transaction` or just use `db.transaction`.
    - Create the unified type `CompletePropertyData`.
    - Implement the transactional logic. *Note: We may need to pass the `tx` (transaction handler) to helper functions if we reuse them, or inline the logic.*
2. **Modify `PropertyEditorContext.tsx`**:
    - Update `saveChanges` to construct the full payload object.
    - Call the new action.
3. **Verification**:
    - Test saving a property with changes in multiple sections.
    - Verify only 1 network request is made.
    - Verify data is persisted in DB.

## 4. Risks & Mitigations

- **Transaction Timeout:** Large properties might take longer. *Mitigation:* The operations are simple inserts/updates, unlikely to timeout unless huge data.
- **Drizzle Transaction Context:** Reusing existing functions might be tricky if they rely on the global `db` instance. *Mitigation:* We will likely need to refactor the helpers to accept a `tx` argument or inline them. **Decision:** Inline or Refactor helpers to accept `tx`? Refactoring helpers to accept optional `db` or `tx` is cleaner.

## 5. Review Required

- [ ] Logic for handling temporary IDs (negative numbers) inside the transaction. (Existing logic handles this, need to ensure it's preserved).
