let $ = (elt) => document.getElementById(elt);

document.querySelector("button").addEventListener("click", (event) => {
  document.querySelector(".dropdown-menu").classList.toggle("active");
});

