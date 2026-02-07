export function isTokenExpired(): boolean {
  const exp = localStorage.getItem("token_exp");
  if (!exp) return true;
  return Date.now() > Number(exp);
}