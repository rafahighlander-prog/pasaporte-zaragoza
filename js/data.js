window.ZGZ = window.ZGZ || {};

ZGZ.LEMA = 'Por el buen comer, el mejor beber y el noble arte de no aburrirse jamás.';

ZGZ.RUTAS = {
  tubo: {
    id: 'tubo',
    titulo: 'Ruta por el Tubo',
    unidad: 'bares',
    tituloDiploma: 'GRAN MAESTRE DEL TUBO',
    textoDiploma: 'por haber completado la Ruta por el Tubo del Pasaporte Zaragoza 2026: todos los bares sellados, todas las tapas catadas y ni una sola queja.',
    hitos: [
      { id: 1, nombre: 'El Champi', dir: 'C/ de la Libertad 16', tapa: 'Champiñones a la plancha', lat: 41.65354, lng: -0.88008 },
      { id: 2, nombre: 'Bodegas Almau', dir: 'C/ de los Estébanes 10', tapa: 'Montadito de anchoa', lat: 41.65339, lng: -0.88001 },
      { id: 3, nombre: 'Taberna Doña Casta', dir: 'C/ de los Estébanes 6', tapa: 'Croquetas caseras', lat: 41.65349, lng: -0.88014 },
      { id: 4, nombre: 'Casa Pascualillo', dir: 'C/ de la Libertad 5', tapa: 'Huevo Pascualillo', lat: 41.65322, lng: -0.88051 },
      { id: 5, nombre: 'La Miguería', dir: 'Plaza de Santiago Sas 6', tapa: 'Migas aragonesas', lat: 41.65377, lng: -0.88081 },
      { id: 6, nombre: 'Bula del Tubo', dir: 'C/ de los Mártires 8', tapa: 'Foie', lat: 41.65263, lng: -0.88026 },
      { id: 7, nombre: 'Croquearte', dir: 'C/ del Cuatro de Agosto 25', tapa: 'Surtido de croquetas', lat: 41.6528, lng: -0.88008 },
      { id: 8, nombre: 'La Ternasca', dir: 'C/ de los Estébanes 9', tapa: 'Ternasco de Aragón', lat: 41.65347, lng: -0.87999 },
      { id: 9, nombre: 'Taberna Carmela', dir: 'C/ de Cinegio 8', tapa: 'Caramelo de Carmelo', lat: 41.65273, lng: -0.87984 },
      { id: 10, nombre: 'El Truco', dir: 'C/ de los Estébanes 2', tapa: 'Brocheta de rape con langostinos, huevos rotos con carrilleras', lat: 41.65363, lng: -0.88042 },
      { id: 11, nombre: 'La Gerencia del Tubo', dir: 'C/ de Cinegio 3', tapa: 'Migas o ternasco', lat: 41.65284, lng: -0.8798 },
      { id: 12, nombre: 'La Tasca de Pablo', dir: 'C/ de la Libertad 3', tapa: 'Bravas o torreznos', lat: 41.65317, lng: -0.88055 },
      { id: 13, nombre: 'El Balcón del Tubo', dir: 'C/ de los Estébanes 7', tapa: 'Tapa del día', lat: 41.6536, lng: -0.8802 },
      { id: 14, nombre: 'La Republicana', dir: 'C/ de Casto Méndez Núñez 38', tapa: 'Migas', lat: 41.65325, lng: -0.87872 }
    ]
  },
  cultural: {
    id: 'cultural',
    titulo: 'Ruta Cultural',
    unidad: 'monumentos',
    tituloDiploma: 'CIUDADANO ILUSTRE Y CULTO',
    textoDiploma: 'por haber completado la Ruta Cultural del Pasaporte Zaragoza 2026: todos los monumentos sellados y el intelecto debidamente enriquecido.',
    hitos: [
      {
        id: 1, nombre: 'Basílica del Pilar', lat: 41.65677, lng: -0.87852, foto: 'img/hitos/1.jpg',
        credito: { autor: 'Rab Lawrence', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Zaragoza_-_Basilica_de_Nuestra_Se%C3%B1ora_del_Pilar_01.jpg' }
      },
      {
        id: 2, nombre: 'La Seo', lat: 41.6556, lng: -0.8757, foto: 'img/hitos/2.jpg',
        credito: { autor: 'Francis Raher', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:La_Seo-Zaragoza_-_P1410404.jpg' }
      },
      {
        id: 3, nombre: 'Palacio de la Aljafería', lat: 41.65649, lng: -0.89666, foto: 'img/hitos/3.jpg',
        credito: { autor: 'Fernando', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Aljafer%C3%ADa_Palace.jpg' }
      },
      {
        id: 4, nombre: 'Teatro Romano de Caesaraugusta', lat: 41.65252, lng: -0.8774, foto: 'img/hitos/4.jpg',
        credito: { autor: 'Carlos Teixidor Cadenas', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Antiguo_teatro_romano_de_Zaragoza,_Espa%C3%B1a,_Spain.jpg' }
      },
      {
        id: 5, nombre: 'Puente de Piedra', lat: 41.65719, lng: -0.87534, foto: 'img/hitos/5.jpg',
        credito: { autor: 'Carlos Teixidor Cadenas', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Puente_de_Piedra,_sobre_el_r%C3%ADo_Ebro,_en_Zaragoza,_Espa%C3%B1a.jpg' }
      },
      {
        id: 6, nombre: 'La Lonja de Zaragoza', lat: 41.65591, lng: -0.87666, foto: 'img/hitos/6.jpg',
        credito: { autor: 'Turol Jones', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:WLM14ES_-_02012006_120657_ZGZ_0879_-_.jpg' }
      },
      {
        id: 7, nombre: 'Mercado Central de Zaragoza', lat: 41.65611, lng: -0.88288, foto: 'img/hitos/7.jpg',
        credito: { autor: 'Francis Raher', licencia: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Mercado_Central-Zaragoza_-_PC281634.jpg' }
      }
    ]
  }
};

ZGZ.EQUIPO = [
  { nombre: 'Rafael', cargo: 'Sumiller del Aperitivo', foto: 'img/equipo/rafael.jpg', desc: 'Máxima autoridad en vermuts, tapas, barras y liturgias del aperitivo.' },
  { nombre: 'Leonardo Federico', cargo: 'Intendente de la Noche', foto: 'img/equipo/leonardo.jpg', desc: 'Responsable de bares, copas, locales, juergas y demás actividades posteriores al ocaso.' },
  { nombre: 'Ramón Santiago', cargo: 'Comisario de Deportes y Espectáculos', foto: 'img/equipo/ramon.jpg', desc: 'Encargado de competiciones deportivas, conciertos y espectáculos.' },
  { nombre: 'Alfonso', cargo: 'Custodio del Saber y la Cultura', foto: 'img/equipo/alfonso.jpg', desc: 'Experto en exposiciones, museos, monumentos y otras formas de enriquecimiento intelectual.' }
];
