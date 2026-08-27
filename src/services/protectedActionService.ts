import { AppRoute } from '../types';

export type ProtectedActionType =
  | 'save'
  | 'call'
  | 'whatsapp'
  | 'message'
  | 'apply'
  | 'inquiry'
  | 'post'
  | 'review';

export interface ProtectedActionRequest {
  type: ProtectedActionType;
  returnRoute: AppRoute;
  execute: () => void | Promise<void>;
  requiresAgreement?: boolean;
}

export interface PendingProtectedAction extends ProtectedActionRequest {
  requiresAgreement: boolean;
}

export const normalizeProtectedAction = (request: ProtectedActionRequest): PendingProtectedAction => ({
  ...request,
  requiresAgreement: request.requiresAgreement ?? true,
});
