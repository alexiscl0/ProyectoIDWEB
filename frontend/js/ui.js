/* ============================================================
   ui.js — Utilidades de interfaz compartidas
   Alertas, formato de fechas, escape de HTML, navbar y menú.
   ============================================================ */
window.EducacionCultura = window.EducacionCultura || {};

(function (B) {
  'use strict';

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
               'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  /** Escapa texto para insertarlo con innerHTML sin riesgo de inyección. */
  function escapar(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** '2026-11-25' → '25 nov 2026' */
  function formatearFecha(iso) {
    if (!iso) return '—';
    var partes = String(iso).split('-');
    if (partes.length !== 3) return escapar(iso);
    var dia = Number(partes[2]);
    var mes = MESES[Number(partes[1]) - 1] || '';
    return dia + ' ' + mes + ' ' + partes[0];
  }

  /** Días transcurridos desde una fecha ISO hasta hoy (nunca negativo). */
  function diasDesde(iso) {
    if (!iso) return 0;
    var objetivo = new Date(iso + 'T00:00:00');
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var ms = hoy.getTime() - objetivo.getTime();
    return Math.max(0, Math.round(ms / 86400000));
  }

  /** Muestra una alerta flotante. tipo: 'exito' | 'error' | 'info' */
  function alerta(mensaje, tipo) {
    var contenedor = document.getElementById('alertas');
    if (!contenedor) {
      contenedor = document.createElement('div');
      contenedor.id = 'alertas';
      contenedor.className = 'alertas';
      contenedor.setAttribute('role', 'status');
      contenedor.setAttribute('aria-live', 'polite');
      document.body.appendChild(contenedor);
    }

    var caja = document.createElement('div');
    caja.className = 'alerta alerta--' + (tipo || 'info');
    caja.textContent = mensaje;
    contenedor.appendChild(caja);

    window.setTimeout(function () {
      caja.style.transition = 'opacity .2s';
      caja.style.opacity = '0';
      window.setTimeout(function () { caja.remove(); }, 220);
    }, 4000);
  }

  /** Marca un campo con error y escribe el mensaje debajo. */
  function marcarError(input, mensaje) {
    if (!input) return;
    var idError = input.getAttribute('aria-describedby');
    var caja = idError ? document.getElementById(idError) : null;

    if (mensaje) {
      input.setAttribute('aria-invalid', 'true');
      if (caja) caja.textContent = mensaje;
    } else {
      input.removeAttribute('aria-invalid');
      if (caja) caja.textContent = '';
    }
  }

  function limpiarErrores(formulario) {
    if (!formulario) return;
    formulario.querySelectorAll('[aria-invalid="true"]').forEach(function (campo) {
      marcarError(campo, '');
    });
  }

  /* ---------- Barra de navegación ---------- */
  function pintarNavbar() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var sesion = B.auth.sesionActual();
    var nombre = document.getElementById('navUsuario');
    if (nombre && sesion) {
      nombre.textContent = sesion.nombre + ' · ' + sesion.rol;
      nombre.title = sesion.email;
    }

    var botonSalir = document.getElementById('btnSalir');
    if (botonSalir) {
      botonSalir.addEventListener('click', B.auth.cerrarSesion);
    }

    var toggle = document.getElementById('navToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var abierto = nav.classList.toggle('nav--abierto');
        toggle.setAttribute('aria-expanded', String(abierto));
        toggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      });
    }

    // Enlace activo según el archivo actual
    var actual = window.location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav__link[href]').forEach(function (enlace) {
      var destino = enlace.getAttribute('href');
      if (destino === actual) {
        enlace.classList.add('nav__link--activo');
        enlace.setAttribute('aria-current', 'page');
      }
    });
  }

  B.ui = {
    escapar: escapar,
    formatearFecha: formatearFecha,
    diasDesde: diasDesde,
    alerta: alerta,
    marcarError: marcarError,
    limpiarErrores: limpiarErrores
  };

  document.addEventListener('DOMContentLoaded', pintarNavbar);
})(window.EducacionCultura);
