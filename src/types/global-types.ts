import { Position } from '@prisma/client';

export interface UserSessionType {
  cookie: Record<string, any>;
  passport: {
    user: {
      id: string;
      phoneNumber?: string;
      email?: string;

      role: Position;
    };
  };
}


