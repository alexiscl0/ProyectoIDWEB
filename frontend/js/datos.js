/* Datos de demostración de Educación y Cultura. Persistencia temporal
   en localStorage; se reemplazará por la API cuando exista backend. */
window.EducacionCultura = window.EducacionCultura || {};

(function (EC) {
  'use strict';
  var CLAVES = {
    instituciones: 'educultura.instituciones',
    categorias: 'educultura.categorias'
  };
  var TIPOS = [
    'Academias e institutos',
    'Bibliotecas',
    'Colegios',
    'Guarderías y Nidos',
    'Idiomas'
  ];
  var INSTITUCIONES = [
    { id: 1, nombre: 'Academia Horizonte', tipo: 'Academias e institutos', ciudad: 'Lima', modalidad: 'Presencial', contacto: 'informes@horizonte.edu', estado: 'Activa' },
    { id: 2, nombre: 'Biblioteca Central', tipo: 'Bibliotecas', ciudad: 'Arequipa', modalidad: 'Presencial', contacto: 'contacto@bibliotecacentral.pe', estado: 'Activa' },
    { id: 3, nombre: 'Colegio Nuevo Mundo', tipo: 'Colegios', ciudad: 'Lima', modalidad: 'Presencial', contacto: 'admision@nuevomundo.edu', estado: 'Activa' },
    { id: 4, nombre: 'Nido Pequeños Pasos', tipo: 'Guarderías y Nidos', ciudad: 'Cusco', modalidad: 'Presencial', contacto: 'hola@pequenospasos.edu', estado: 'Activa' },
    { id: 5, nombre: 'Centro de Idiomas Global', tipo: 'Idiomas', ciudad: 'Trujillo', modalidad: 'Híbrida', contacto: 'info@globalidiomas.edu', estado: 'Activa' },
    { id: 6, nombre: 'Instituto Técnico Andino', tipo: 'Academias e institutos', ciudad: 'Huancayo', modalidad: 'Híbrida', contacto: 'matricula@andino.edu', estado: 'En revisión' },
    { id: 7, nombre: 'Colegio Valle Verde', tipo: 'Colegios', ciudad: 'Piura', modalidad: 'Presencial', contacto: 'secretaria@valleverde.edu', estado: 'Activa' },
    { id: 8, nombre: 'Biblioteca La Estación', tipo: 'Bibliotecas', ciudad: 'Lima', modalidad: 'Virtual', contacto: 'hola@laestacion.pe', estado: 'En revisión' }
  ];

  function clonar(valor) { return JSON.parse(JSON.stringify(valor)); }
  function leer(clave, inicial) {
    try {
      var valor = localStorage.getItem(clave);
      return valor ? JSON.parse(valor) : clonar(inicial);
    } catch (error) {
      console.warn('No se pudieron leer los datos guardados.', error);
      return clonar(inicial);
    }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); return true; }
    catch (error) { console.error('No se pudieron guardar los datos.', error); return false; }
  }

  EC.datos = {
    TIPOS: TIPOS,
    instituciones: function () { return leer(CLAVES.instituciones, INSTITUCIONES); },
    guardarInstituciones: function (lista) { return guardar(CLAVES.instituciones, lista); },
    reiniciar: function () {
      Object.keys(CLAVES).forEach(function (clave) { localStorage.removeItem(CLAVES[clave]); });
    }
  };
})(window.EducacionCultura);
