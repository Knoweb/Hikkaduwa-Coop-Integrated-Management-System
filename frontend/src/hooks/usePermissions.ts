/**
 * Centralized permissions hook.
 * Reads role from AuthContext (single source of truth — no direct localStorage reads).
 *
 * Usage:
 *   const { canMutateBusinessData, isAuditor, isAdmin } = usePermissions();
 */
import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { user, isAuditor, isAdmin, canMutateBusinessData } = useAuth();

  return {
    role: user?.role ?? null,
    isAuditor,
    isAdmin,
    canMutateBusinessData,
  };
};
