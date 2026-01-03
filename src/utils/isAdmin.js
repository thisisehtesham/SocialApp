const ADMIN_EMAILS = ['admin@example.com'];

export function isAdmin(user) {
  return user?.email && ADMIN_EMAILS.includes(user.email);
}
