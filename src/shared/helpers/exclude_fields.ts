//TODO: how to delete fields in PRISMA according to the documentation: https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
export function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
