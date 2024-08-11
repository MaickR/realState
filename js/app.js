const imagenes = document.querySelectorAll(".propiedad-imagen");

window.addEventListener("scroll", () => {
  const scroll = this.scrollY /-20;
    console.log(scroll);

  imagenes.forEach((imagen) => {
    imagen.style.backgroundPositionY = `${scroll}px`;
  });
});
