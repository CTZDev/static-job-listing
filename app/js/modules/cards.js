const d = document;

const getJobs = async () => {
  try {
    const response = await fetch("../../../data.json");
    if (!response.ok) throw { status: response.status, statusText: response.statusText };
    const data = await response.json();
    drawJobs(data);
  } catch (error) {
    let message = error.statusText || "Ocurrió un error inesperado";
    const $header = d.querySelector(".main-header");
    $header.insertAdjacentHTML("beforeend", `<div class="response-error"><p>Error ${error.status} : ${message}</p></div>`);
  }
};

const drawJobs = (data) => {
  console.log(data);
  const $template = d.getElementById("template-card").content;
  const $fragment = d.createDocumentFragment();
  const $cards = d.querySelector(".cards");

  data.forEach((el) => {
    let $clone = $template.cloneNode(true);
    $clone.querySelector(".card-main > img").setAttribute("src", el.logo);
    $clone.querySelector(".card-main > img").setAttribute("alt", el.company);
    $clone.querySelector(".card-header-title").textContent = el.company;
    el.new && $clone.querySelector(".card-header-relevant").insertAdjacentHTML("beforeend", `<li class="badge badge--new">New!</li>`);
    el.featured && $clone.querySelector(".card-header-relevant").insertAdjacentHTML("beforeend", `<li class="badge badge--featured">Featured</li>`);
    $clone.querySelector(".card-body-title").textContent = el.position;
    $clone.querySelector(".card-body-posted").textContent = el.postedAt;
    $clone.querySelector(".card-body-contract").textContent = el.contract;
    $clone.querySelector(".card-body-location").textContent = el.location;
    $clone.querySelector("[data-footer-role]").textContent = el.role;
    $clone.querySelector("[data-footer-level]").textContent = el.level;
    el.languages.forEach((lang) => {
      $clone.querySelector(".card-footer-items").insertAdjacentHTML("beforeend", `<li class="tooltip">${lang}</li>`);
    });
    el.tools.forEach((tool) => {
      $clone.querySelector(".card-footer-items").insertAdjacentHTML("beforeend", `<li class="tooltip">${tool}</li>`);
    });

    $fragment.append($clone);
  });

  $cards.append($fragment);
};

export default getJobs;
