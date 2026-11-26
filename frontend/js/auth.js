/* Login temporal de demostración. La autenticación real debe implementarse
   en el servidor; estas credenciales del navegador no son seguras. */
window.EducacionCultura = window.EducacionCultura || {};

(function (EC) {
  'use strict';
  var CLAVE_SESION = 'educultura.sesion';
  var USUARIOS_DEMO = [
    { email: 'admin@educulturademo.test', password: 'Admin123!', nombre: 'María Torres', rol: 'Administración' },
    { email: 'gestor@educulturademo.test', password: 'Gestor123!', nombre: 'Luis Ramos', rol: 'Gestión educativa' }
  ];

  function sesionActual() {
    try {
      var valor = sessionStorage.getItem(CLAVE_SESION);
      return valor ? JSON.parse(valor) : null;
    } catch (_) { return null; }
  }
  function iniciarSesion(email, password) {
    var correo = String(email || '').trim().toLowerCase();
    if (!correo || !password) return { ok: false, error: 'Ingresa tu correo y contraseña.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return { ok: false, error: 'Escribe un correo válido.' };
    var usuario = USUARIOS_DEMO.filter(function (item) {
      return item.email === correo && item.password === password;
    })[0];
    if (!usuario) return { ok: false, error: 'Credenciales inválidas. Verifica tus datos.' };
    var sesion = { nombre: usuario.nombre, rol: usuario.rol, email: usuario.email };
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return { ok: true, usuario: sesion };
  }
  function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESION);
    window.location.href = 'login.html';
  }
  function proteger() {
    if (!sesionActual()) {
      window.location.replace('login.html');
      return false;
    }
    return true;
  }

  EC.auth = {
    sesionActual: sesionActual,
    iniciarSesion: iniciarSesion,
    cerrarSesion: cerrarSesion,
    proteger: proteger
  };
})(window.EducacionCultura);
