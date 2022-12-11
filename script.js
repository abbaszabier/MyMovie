//Inisiasi
const API_KEY = "api_key=d40834813c252d268962c718001ddadd";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const bgColor = "text-bg-";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const searchURL = BASE_URL + "/search/movie?" + API_KEY;
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const current = document.getElementById("current");
const button = document.querySelectorAll("#btn-more");
const buttonSearch = document.getElementById("btn-seacrh");
let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = "";
let totalPage = 100;

//Mengambil data movie
function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      currentPage = data.page;
      nextPage = currentPage + 1;
      prevPage = currentPage - 1;
      totalPage = data.total_pages;
      showMovies(data.results);
      current.innerHTML = currentPage;
      if (currentPage <= 1) {
        prev.classList.add("disabled");
        next.classList.remove("disabled");
      } else if (currentPage >= totalPage) {
        prev.classList.remove("disabled");
        next.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
        next.classList.remove("disabled");
      }
    });
}
getMovies(API_URL);

// Menampilkan data movie ke html
function showMovies(data) {
  main.innerHTML = "";
  data.forEach((movie) => {
    const { title, poster_path, vote_average, release_date, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("col-md-3");
    movieEl.innerHTML = `
          <div class="card shadow mb-4">
            <img src="${IMG_URL + poster_path}" class="card-img-top" alt="${title}" />
            <span class="badge ${bgColor + getColor(vote_average)} rounded-0">${vote_average}</span>
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <small><p class="text-muted" style="margin: 0">${release_date}</p></small>
            </div>
            <div class="overview m-2 d-grid gap-2">
              <button class="btn btn-sm" id="${id}" style="color: aliceblue; font-size: 12px; background-color: rgb(12, 6, 43)" type="button">Detail</button>
            </div>
          </div>`;
    main.appendChild(movieEl);
    document.getElementById(id).addEventListener("click", function () {
      swal("Wait a minute!", "More details are under development!", "info");
    });
  });
}

// Membuat kondisi vote
function getColor(vote) {
  if (vote >= 8) {
    return "success";
  } else if (vote >= 5) {
    return "warning";
  } else {
    return "danger";
  }
}

// Fitur search dengan event submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});
buttonSearch.addEventListener("click", () => {
  const searchTerm = search.value;
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm);
  } else {
    getMovies(API_URL);
  }
});

// Next page dan Prev page
prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPage) {
    pageCall(nextPage);
  }
});

function pageCall(page) {
  let urlSplitt = lastUrl.split("?");
  let queryParams = urlSplitt[1].split("&");
  let key = queryParams[queryParams.length - 1].split("=");
  if (key[0] != "page") {
    let url = lastUrl + "&page=" + page;
    getMovies(url);
  } else {
    key[1] = page.toString();
    let a = key.join("=");
    queryParams[queryParams.length - 1] = a;
    let b = queryParams.join("&");
    let url = urlSplitt[0] + "?" + b;
    getMovies(url);
  }
}
