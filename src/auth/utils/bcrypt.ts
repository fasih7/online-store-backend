import * as bcrypt from 'bcryptjs';

export const hashWithBcryptJS = async (password: string) => {
  const salt = await bcrypt.genSalt(+process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validatePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};
