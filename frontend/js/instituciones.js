/* CRUD de instituciones educativas y culturales con persistencia local. */
(function (EC) {
  'use strict';
  var ui = EC.ui;
  var TIPOS = EC.datos.TIPOS;
  var instituciones = EC.datos.instituciones();
  var estado = { texto: '', tipo: '', editandoId: null };
  var tabla = document.getElementById('tablaInstituciones');
  var contador = document.getElementById('contadorInstituciones');
  var buscar = document.getElementById('buscar');
  var filtro = document.getElementById('filtroTipo');
  var modal = document.getElementById('modalInstitucion');
  var form = document.getElementById('formInstitucion');
  var tituloModal = document.getElementById('modalTitulo');
  var botonGuardar = document.getElementById('btnGuardar');
  var campos = {
    nombre: document.getElementById('nombre'),
    tipo: document.getElementById('tipo'),
    ciudad: document.getElementById('ciudad'),
    modalidad: document.getElementById('modalidad'),
    contacto: document.getElementById('contacto')
  };

  function render() {
    var texto = estado.texto.trim().toLocaleLowerCase('es');
    var visibles = instituciones.filter(function (item) {
      var datos = (item.nombre + ' ' + item.ciudad + ' ' + item.contacto).toLocaleLowerCase('es');
      return (!texto || datos.includes(texto)) && (!estado.tipo || item.tipo === estado.tipo);
    });

    tabla.innerHTML = visibles.length ? visibles.map(function (item) {
      return '<tr><td class="col-id">' + item.id + '</td>' +
        '<td><span class="celda-principal">' + ui.escapar(item.nombre) + '</span>' +
        '<span class="celda-secundaria">' + ui.escapar(item.contacto) + '</span></td>' +
        '<td><span class="badge badge--neutro">' + ui.escapar(item.tipo) + '</span></td>' +
        '<td>' + ui.escapar(item.ciudad) + '</td>' +
        '<td>' + ui.escapar(item.modalidad) + '</td>' +
        '<td><span class="badge ' + (item.estado === 'Activa' ? 'badge--ok' : 'badge--aviso') + '">' +
          ui.escapar(item.estado) + '</span></td>' +
        '<td class="col-acciones"><div class="acciones">' +
        '<button class="btn-icono" type="button" data-editar="' + item.id + '" aria-label="Editar ' +
          ui.escapar(item.nombre) + '" title="Editar">✎</button>' +
        '<button class="btn-icono" type="button" data-eliminar="' + item.id + '" aria-label="Eliminar ' +
          ui.escapar(item.nombre) + '" title="Eliminar">🗑</button>' +
        '</div></td></tr>';
    }).join('') : '<tr><td colspan="7" class="vacio">No se encontraron instituciones con esos filtros.</td></tr>';
    contador.textContent = 'Mostrando ' + visibles.length + ' de ' + instituciones.length + ' instituciones.';
  }

  function abrir(item) {
    ui.limpiarErrores(form);
    form.reset();
    estado.editandoId = item ? item.id : null;
    tituloModal.textContent = item ? 'Editar institución' : 'Nueva institución';
    botonGuardar.textContent = item ? 'Guardar cambios' : 'Guardar';
    if (item) {
      campos.nombre.value = item.nombre;
      campos.tipo.value = item.tipo;
      campos.ciudad.value = item.ciudad;
      campos.modalidad.value = item.modalidad;
      campos.contacto.value = item.contacto;
    }
    modal.showModal();
    campos.nombre.focus();
  }

  function validar() {
    ui.limpiarErrores(form);
    var valido = true;
    var valores = {
      nombre: campos.nombre.value.trim(),
      tipo: campos.tipo.value,
      ciudad: campos.ciudad.value.trim(),
      modalidad: campos.modalidad.value,
      contacto: campos.contacto.value.trim()
    };
    if (valores.nombre.length < 3) {
      ui.marcarError(campos.nombre, 'Escribe un nombre de al menos 3 caracteres.'); valido = false;
    }
    if (TIPOS.indexOf(valores.tipo) < 0) {
      ui.marcarError(campos.tipo, 'Selecciona un tipo.'); valido = false;
    }
    if (valores.ciudad.length < 2) {
      ui.marcarError(campos.ciudad, 'Escribe una ciudad.'); valido = false;
    }
    if (!valores.modalidad) {
      ui.marcarError(campos.modalidad, 'Selecciona una modalidad.'); valido = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.contacto)) {
      ui.marcarError(campos.contacto, 'Escribe un correo válido.'); valido = false;
    }
    return valido ? valores : null;
  }

  function guardar() {
    if (!EC.datos.guardarInstituciones(instituciones)) {
      ui.alerta('No se pudieron guardar los cambios en este navegador.', 'error');
      return false;
    }
    return true;
  }

  document.getElementById('btnNuevo').addEventListener('click', function () { abrir(null); });
  document.getElementById('btnRestaurar').addEventListener('click', function () {
    if (window.confirm('¿Restaurar las instituciones de ejemplo? Se perderán tus cambios.')) {
      EC.datos.reiniciar();
      window.location.reload();
    }
  });
  buscar.addEventListener('input', function () { estado.texto = buscar.value; render(); });
  filtro.addEventListener('change', function () { estado.tipo = filtro.value; render(); });
  tabla.addEventListener('click', function (evento) {
    var editar = evento.target.closest('[data-editar]');
    var eliminar = evento.target.closest('[data-eliminar]');
    if (editar) {
      var item = instituciones.find(function (i) { return i.id === Number(editar.dataset.editar); });
      if (item) abrir(item);
    }
    if (eliminar) {
      var id = Number(eliminar.dataset.eliminar);
      var encontrado = instituciones.find(function (i) { return i.id === id; });
      if (encontrado && window.confirm('¿Eliminar "' + encontrado.nombre + '"?')) {
        instituciones = instituciones.filter(function (i) { return i.id !== id; });
        if (guardar()) { render(); ui.alerta('Institución eliminada.', 'exito'); }
      }
    }
  });
  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    var valores = validar();
    if (!valores) return;
    if (estado.editandoId === null) {
      var id = instituciones.reduce(function (max, i) { return Math.max(max, i.id); }, 0) + 1;
      instituciones.push(Object.assign({ id: id, estado: 'Activa' }, valores));
    } else {
      var registro = instituciones.find(function (i) { return i.id === estado.editandoId; });
      if (registro) Object.assign(registro, valores);
    }
    if (guardar()) {
      modal.close();
      render();
      ui.alerta('Institución guardada correctamente.', 'exito');
    }
  });
  form.addEventListener('click', function (evento) {
    if (evento.target.closest('[data-cerrar]')) modal.close();
  });
  form.addEventListener('input', function (evento) {
    if (evento.target.matches('[aria-invalid="true"]')) ui.marcarError(evento.target, '');
  });
  modal.addEventListener('click', function (evento) {
    if (evento.target === modal) modal.close();
  });
  modal.addEventListener('close', function () {
    estado.editandoId = null;
    ui.limpiarErrores(form);
  });

  TIPOS.forEach(function (tipo) {
    [filtro, campos.tipo].forEach(function (select) {
      var opcion = document.createElement('option');
      opcion.value = tipo;
      opcion.textContent = tipo;
      select.appendChild(opcion);
    });
  });
  render();
})(window.EducacionCultura);
