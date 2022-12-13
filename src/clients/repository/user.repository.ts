import { Operation, User } from '@prisma/client';

export abstract class UserRepository {
  abstract getUserById(userId: string): Promise<User>;
}
