import type { User } from '../../db/types';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user?: User;
    }
  }
}

export {};
