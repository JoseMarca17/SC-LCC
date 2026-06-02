public record UsuarioCreateDto(
    string Nombres,
    string Apellidos,
    string Email,
    string Password,
    byte IdRol // Relacionado con CatRol[cite: 1]
);