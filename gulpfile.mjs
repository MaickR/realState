//? Dependencias de gulp
import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;

//? CSS y SASS
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'cssnano';

//? Importa el compilador Sass
import dartSass from 'sass';

//? Crea una instancia de gulp-sass con el compilador Sass
const sassCompiler = sass(dartSass);

//? Imagenes
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

//* Herramienta que evita que se detenga el proceso de compilación
import plumber from 'gulp-plumber';

//? Mejora estructura y SEO del HTML
import htmlhint from 'gulp-htmlhint';

//? Ve los cambios en el navegador
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const browserSync = require('browser-sync').create();

//* Función para compilar el SASS
function css(done) {
    src('src/scss/app.scss') // Selecciona el archivo principal SCSS
        .pipe(plumber()) // Previene que el proceso se detenga en caso de error
        .pipe(sourcemaps.init()) // Inicializa los sourcemaps
        .pipe(sassCompiler()) // Compila SCSS a CSS
        .pipe(postcss([autoprefixer(), cssnano()])) // Aplica autoprefixer y minificación
        .pipe(sourcemaps.write('.')) // Escribe los sourcemaps
        .pipe(dest('build/css')) // Guarda el CSS en la carpeta build
        .pipe(browserSync.stream()); // Recarga el navegador
    done();
}

//* Función para optimizar las imágenes
function imagenes() {
    return src('src/img/**/*') // Selecciona todas las imágenes
        .pipe(imagemin({ optimizationLevel: 3 })) // Optimiza las imágenes
        .pipe(dest('build/img')); // Guarda las imágenes optimizadas
}

//! Función para convertir imágenes a WebP
function versionWebp() {
    const opciones = { quality: 50 }; // Opciones de calidad
    return src('src/img/**/*.{png,jpg}') // Selecciona imágenes PNG y JPG
        .pipe(webp(opciones)) // Convierte a WebP
        .pipe(dest('build/img')); // Guarda las imágenes WebP
}

//! Función para convertir imágenes a AVIF
function versionAvif() {
    const opciones = { quality: 50 }; // Opciones de calidad
    return src('src/img/**/*.{png,jpg}') // Selecciona imágenes PNG y JPG
        .pipe(avif(opciones)) // Convierte a AVIF
        .pipe(dest('build/img')); // Guarda las imágenes AVIF
}

//? Función para validar HTML con HTMLHint
//? Función para validar HTML con HTMLHint
function validarHTML() {
    return src('*.html') // Selecciona todos los archivos HTML
        .pipe(htmlhint('.htmlhintrc')) // Valida el HTML con HTMLHint
        .pipe(htmlhint.reporter()); // Muestra los errores en la consola
}


//? Configuración de BrowserSync
function servidor(done) {
    browserSync.init({
        server: {
            baseDir: './' // Define el directorio base para el servidor
        }
    });
    done();
}

//? Función para recargar BrowserSync
function recargar(done) {
    browserSync.reload(); // Recarga el navegador
    done();
}

//? Tarea de desarrollo
function dev() {
    watch('src/scss/**/*.scss', css); // Observa cambios en archivos SCSS
    watch('src/img/**/*', imagenes); // Observa cambios en imágenes
    watch('*.html', series(validarHTML, recargar)); // Observa cambios en HTML y recarga el navegador
}

//* Exportar tareas
// Tareas que se ejecutan de manera constante
const _css = css;
export { _css as css };

const _dev = series(servidor, dev);
export { _dev as dev };

// Tareas que se ejecutan una única vez
const _imagenes = imagenes;
export { _imagenes as imagenes };

const _versionWebp = versionWebp;
export { _versionWebp as versionWebp };

const _versionAvif = versionAvif;
export { _versionAvif as versionAvif };

const _validarHTML = validarHTML;
export { _validarHTML as validarHTML };

// Tarea por defecto que ejecuta tareas una vez y luego las constantes
const _default = series(imagenes, versionWebp, versionAvif, css, validarHTML, servidor, dev);
export { _default as default };
