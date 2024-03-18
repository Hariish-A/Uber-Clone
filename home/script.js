let $ = (elt) => document.getElementById(elt);

document.querySelectorAll("button").forEach((x) =>
  x.addEventListener("click", (event) => {
    selector = `#${x.id}+.dropdown-menu`;
    document.querySelector(selector).classList.toggle("active");
  })
);
