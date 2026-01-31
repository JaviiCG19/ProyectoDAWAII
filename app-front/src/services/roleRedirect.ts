export function getRedirectPathByRole(role: string): string {
  switch (role) {
    case "1":
      return "/admin";
    case "2":
      return "/gerente";
    case "3":
      return "/recepcion";
    case "4":
      return "/mesero";
    default:
      return "/login";
  }
}
