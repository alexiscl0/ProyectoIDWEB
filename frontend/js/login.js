/* ============================================================
   login.js — Lógica del formulario de acceso (Fase 1)
   ============================================================ */
(function (B) {
  'use strict';

  var formulario = document.getElementById('formLogin');
  var campoEmail = document.getElementById('email');
  var campoPassword = document.getElementById('password');
  var cajaMensaje = document.getElementById('mensaje');
  var btnEntrar = document.getElementById('btnEntrar');

  // Si ya hay sesión activa, no tiene sentido mostrar el login
  if (B.auth.sesionActual()) {
    window.location.replace('index.html');
    return;
  }

  function mostrarMensaje(texto) {
    cajaMensaje.textContent = texto;
    cajaMensaje.classList.remove('oculto');
  }

  function ocultarMensaje() {
    cajaMensaje.textContent = '';
    cajaMensaje.classList.add('oculto');
  }

  function validar() {
    var valido = true;
    B.ui.limpiarErrores(formulario);

    var email = campoEmail.value.trim();
    if (!email) {
      B.ui.marcarError(campoEmail, 'El correo es obligatorio.');
      valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      B.ui.marcarError(campoEmail, 'Escribe un correo válido.');
      valido = false;
    }

    if (!campoPassword.value) {
      B.ui.marcarError(campoPassword, 'La contraseña es obligatoria.');
      valido = false;
    } else if (campoPassword.value.length < 6) {
      B.ui.marcarError(campoPassword, 'Mínimo 6 caracteres.');
      valido = false;
    }

    return valido;
  }

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    ocultarMensaje();

    if (!validar()) return;

    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Verificando…';

    // Pequeña espera para simular la llamada al servidor
    window.setTimeout(function () {
      var resultado = B.auth.iniciarSesion(campoEmail.value, campoPassword.value);

      if (!resultado.ok) {
        mostrarMensaje(resultado.error);
        btnEntrar.disabled = false;
        btnEntrar.textContent = 'Iniciar sesión';
        campoPassword.value = '';
        campoPassword.focus();
        return;
      }

      window.location.replace('index.html');
    }, 350);
  });

  // Limpiar el error del campo mientras se escribe
  [campoEmail, campoPassword].forEach(function (campo) {
    campo.addEventListener('input', function () {
      B.ui.marcarError(campo, '');
      ocultarMensaje();
    });
  });

  // Mostrar / ocultar contraseña
  document.getElementById('verPassword').addEventListener('change', function (evento) {
    campoPassword.type = evento.target.checked ? 'text' : 'password';
  });

  campoEmail.focus();
})(window.EducacionCultura);
