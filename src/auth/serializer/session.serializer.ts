import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error | null, user: any) => void): void {
    done(null, user); // Pass null for no error
  }

  deserializeUser(
    payload: string,
    done: (err: Error | null, payload: string) => void,
  ): void {
    done(null, payload); // Pass null for no error
  }
}