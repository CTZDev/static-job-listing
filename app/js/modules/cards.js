const d = document;
const $fragment = d.createDocumentFragment();
let jobsFilter = [];
const jobs = [];

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

const deleteDuplicates = (array) => (array = [...new Set([...array])]);

const drawJobs = (data) => {
  const $template = d.getElementById("template-card").content;
  const $cards = d.querySelector(".cards");

  data.forEach((el) => {
    const jobsData = [];
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
      $clone.querySelector(".card-footer-items").insertAdjacentHTML("beforeend", `<button type="button" class="tooltip">${lang}</button>`);
      jobsData.push(lang);
    });
    el.tools.forEach((tool) => {
      $clone.querySelector(".card-footer-items").insertAdjacentHTML("beforeend", `<button type="button" class="tooltip">${tool}</button>`);
      jobsData.push(tool);
    });
    jobsData.push(el.role, el.level);
    jobs.push(jobsData);
    $fragment.append($clone);
  });

  $cards.append($fragment);
};

const generateFeature = (text) => {
  const $template = d.getElementById("template-filter-tooltip").content;
  const $filterContainer = d.querySelector(".tooltip-control");

  jobsFilter.push(text);
  const jobsClean = deleteDuplicates(jobsFilter);
  $filterContainer.innerHTML = "";

  jobsClean.forEach((job) => {
    let $clone = $template.cloneNode(true);
    $clone.querySelector(".tooltip > p").textContent = job;
    $fragment.appendChild($clone);
  });

  $filterContainer.append($fragment);
};

d.addEventListener("click", (e) => {
  const $filter = d.querySelector(".filter");

  //CAPTURE FILTER JOBS
  if (e.target.matches(".card-footer-items > *")) {
    const $textFeatures = e.target.textContent;
    $filter.classList.add("is-active");
    generateFeature($textFeatures);

    jobs.forEach((job, i) => {
      let acumJobs = 0;
      for (const jobFilter of jobsFilter) {
        if (job.includes(jobFilter)) {
          acumJobs++;
          if (acumJobs === jobsFilter.length) {
            d.querySelectorAll(".card")[i].classList.add("active-featured");
          } else {
            d.querySelectorAll(".card")[i].classList.remove("active-featured");
          }
        } else {
          d.querySelectorAll(".card")[i].classList.add("is-active");
        }
      }
    });
  }

  //DELETE FILTER JOBS
  if (e.target.matches("#btnclose-tooltip")) {
    const $tooltip = e.target.parentElement;
    const $tooltipText = e.target.previousElementSibling.textContent;
    jobsFilter = jobsFilter.filter((job) => job !== $tooltipText);
    $tooltip.remove();

    jobs.forEach((job, i) => {
      let acumJobs = 0;
      for (const jobFilter of jobsFilter) {
        if (job.includes(jobFilter)) {
          acumJobs++;
          if (acumJobs === jobsFilter.length) {
            d.querySelectorAll(".card")[i].classList.add("active-featured");
            d.querySelectorAll(".card")[i].classList.remove("is-active");
          } else {
            d.querySelectorAll(".card")[i].classList.add("is-active");
            d.querySelectorAll(".card")[i].classList.remove("active-featured");
          }
        }
      }
    });

    if (jobsFilter.length === 0) {
      d.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("is-active");
        card.classList.remove("active-featured");
      });
      $filter.classList.remove("is-active");
    }
  }
});

export default getJobs;
