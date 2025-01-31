import * as argon2 from 'argon2';

export const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(plainPassword, {
      timeCost: 4,
      type: argon2.argon2d,
    });
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error) {
    throw new Error('Error verifying password');
  }
};
