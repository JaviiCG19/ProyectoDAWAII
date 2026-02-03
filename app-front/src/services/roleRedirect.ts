export function getRedirectPathByRole(role: string, idLocal?: number | null, idRes?: number | null): string {
  switch (role) {
    case "1": return "/admin"; 
    case "2": return `/gerente/${idRes}`; 
    case "3": return `/admin-sucursal/${idLocal}`; 
    case "4": return `/recepcion/${idLocal}`;
    case "5": return `/mesero/${idLocal}`;
    
    default: return "/login";
  }
}