/* Panel general de Educación y Cultura. */
(function (EC) {
  'use strict';
  var ui = EC.ui;
  var instituciones = EC.datos.instituciones();
  var porTipo = {};
  EC.datos.TIPOS.forEach(function (tipo) { porTipo[tipo] = 0; });
  instituciones.forEach(function (item) { porTipo[item.tipo] = (porTipo[item.tipo] || 0) + 1; });

  document.getElementById('statInstituciones').textContent = instituciones.length;
  document.getElementById('statTipos').textContent = EC.datos.TIPOS.length;
  document.getElementById('statActivas').textContent = instituciones.filter(function (i) { return i.estado === 'Activa'; }).length;
  document.getElementById('statRevision').textContent = instituciones.filter(function (i) { return i.estado === 'En revisión'; }).length;

  var cuerpo = document.getElementById('tablaResumen');
  cuerpo.innerHTML = EC.datos.TIPOS.map(function (tipo) {
    return '<tr><td>' + ui.escapar(tipo) + '</td><td class="num">' + (porTipo[tipo] || 0) + '</td></tr>';
  }).join('');

  var recientes = document.getElementById('tablaRecientes');
  recientes.innerHTML = instituciones.slice().reverse().slice(0, 5).map(function (item) {
    var clase = item.estado === 'Activa' ? 'badge--ok' : 'badge--aviso';
    return '<tr><td><span class="celda-principal">' + ui.escapar(item.nombre) +
      '</span><span class="celda-secundaria">' + ui.escapar(item.ciudad) + '</span></td>' +
      '<td>' + ui.escapar(item.tipo) + '</td><td><span class="badge ' + clase + '">' +
      ui.escapar(item.estado) + '</span></td></tr>';
  }).join('');
})(window.EducacionCultura);
