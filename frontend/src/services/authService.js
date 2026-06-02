const API_URL = 'http://localhost:5183/api/auth';

export const authService = {

  async login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
    return data;
  },

  async verifyOtp(email, code) {
    const res = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Código inválido');
    return data;
  },

  saveSession(authData) {
    localStorage.setItem('token',          authData.accessToken);
    localStorage.setItem('nombreCompleto', authData.nombreCompleto);
    localStorage.setItem('email',          authData.email);
    localStorage.setItem('rolId',          authData.rolId);
    localStorage.setItem('rolNombre',      authData.rolNombre);
  },

  logout() {
    localStorage.clear();
  },

  getToken()   { return localStorage.getItem('token'); },
  isLoggedIn() { return !!localStorage.getItem('token'); },
  getUser()    {
    return {
      nombreCompleto: localStorage.getItem('nombreCompleto'),
      email:          localStorage.getItem('email'),
      rolId:          parseInt(localStorage.getItem('rolId') || '0'),
      rolNombre:      localStorage.getItem('rolNombre'),
    };
  }
};