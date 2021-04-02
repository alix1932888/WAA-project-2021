const APIKEY = "10ec860fd62e08b4ba5e7d6d2b5ded43";
const APITOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMGVjODYwZmQ2MmUwOGI0YmE1ZTdkNmQyYjVkZWQ0MyIsInN1YiI6IjViZTZlNmI1MGUwYTI2M2MwNjAxMTE1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iUBJ-_XRRkxw7MwD-DvClisQxaDZMI1N3DJ-zBLailk";
const POSTER_URL = "https://www.themoviedb.org/t/p/original";

let context = {
  count: 0,
};

function posterimage(image) {
  return `<img src="${POSTER_URL + image}" width="250"/>`
}

async function addtitle(id) {
  const movie = await searchMovie(id);
  $("#head").append(`<div class="jumbotron m-3 bg-dark text-white"><h1>${movie.title}<small class="h6 mx-5">${movie.date}</small></h1>${posterimage(movie.poster)}</div>`);
  addform(movie);
}

async function addcast(name, role) {
  const person = await searchCast(name, role);
  $("#head").append(`<div class="jumbotron m-3 bg-dark text-white"><h1>${cap(name)}</h1>${posterimage(person.picture)}</div>`);
  addformcast(person);
}



async function addformcast(person) {
  $("#head").append(`<form class="row g-3 mx-3">
  <div class="col-auto">
    <input type="text" class="form-control" id="cast-answer${context.count}" placeholder="Movie Name">
    <div class="invalid-feedback">
      Wrong Answer.
    </div>
  </div>
  <div class="col-auto">
    <button type="submit" class="btn btn-success mb-3" id="cast-submit${context.count}">Submit</button>
  </div>
</form>`);
  $(`#cast-submit${context.count}`).on("click", (e) => {
    e.preventDefault();
    const movie = $(`#cast-answer${context.count}`).val().toLowerCase();
    if (person.movies.map(e => e.title).includes(movie)) {
      $(`#cast-answer${context.count}`).removeClass("is-invalid");
      $(`#cast-answer${context.count}`).addClass("is-valid");
      context.count += 1;
      addtitle(findid(person.movies, movie));
    }
    else {
      $(`#cast-answer${context.count}`).addClass("is-invalid");
    }
    return false;
  });

}

async function addform(movie) {
  $("#head").append(`<form class="row g-3 mx-3">
  <div class="col-auto">
    <input type="text" class="form-control" id="answer${context.count}" placeholder="Actor or Director Name">
    <div class="invalid-feedback">
      Wrong Answer.
    </div>
  </div>
  <div class="col-auto">
    <button type="submit" class="btn btn-success mb-3" id="submit${context.count}">Submit</button>
  </div>
</form>`);
  $(`#submit${context.count}`).on("click", (e) => {
    e.preventDefault();
    const name = $(`#answer${context.count}`).val().toLowerCase();
    if (movie.cast.map(e => e.name).includes(name) || movie.director.map(e => e.name).includes(name)) {
      $(`#answer${context.count}`).removeClass("is-invalid");
      $(`#answer${context.count}`).addClass("is-valid");
      context.count += 1;
      if (movie.cast.map(e => e.name).includes(name)) {
        addcast(name, "actor");
      }
      else {
        addcast(name, "director");
      }

    }
    else {
      $(`#answer${context.count}`).addClass("is-invalid");
    }
    return false;
  });

}

function findid(movies, name) {
  for (const movie of movies) {
    if (movie.title == name) {
      return movie.id;
    }
  }
}

function cap(string) {
  return string.split(" ").map(s => s[0].toUpperCase() + s.slice(1)).join(" ");
}

async function searchMovie(id) {
  const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${APIKEY}&language=en-US`);
  const movie = await resp.json();
  const resp2 = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${APIKEY}&language=en-US`);
  const people = await resp2.json();
  return {
    title: movie.original_title,
    date: movie.release_date,
    id: movie.id,
    poster: movie.poster_path,
    cast: people.cast.map((character) => ({
      name: character.name.toLowerCase(),
      id: character.id
    })),
    director: people.crew.filter((crew) => crew.job == "Director").map((director) => ({
      name: director.name.toLowerCase(),
      id: director.id
    })),
  };
}

async function searchCast(name, role) {
  const resp = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${APIKEY}&query=${name}`);
  const infos = await resp.json();
  const resp2 = await fetch(`https://api.themoviedb.org/3/person/${infos.results[0].id}/movie_credits?api_key=${APIKEY}`);
  const infos2 = await resp2.json();
  return {

    movies: infos2[role == "actor" ? "cast" : "crew"].map((movie) => ({
      title: movie.original_title.toLowerCase(),
      id: movie.id
    })),
    picture: infos.results[0].profile_path
  };
}



addtitle(597);
