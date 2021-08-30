const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12
let filteredMovies = []
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || [] //收藏清單

const dataPanel = document.querySelector('#data-panel')
const searchInput = document.querySelector('#search-input')
const seachForm = document.querySelector('#seach-form')
const paginator = document.querySelector('#paginator')

function renderMovieList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    // title, image, id
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id
      }">More</button>
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id
      }">X</button>
        </div>
      </div>
    </div>
  </div>`
  })

  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function removeFromFavorite(id) {
  if (!movies) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

function getMoviesByPage(page) {
  // console.log(page)
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const page = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let i = 1; i <= page; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-id="${i}">${i}</a></li>`
  }
  paginator.innerHTML = rawHTML
}



//listen to data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(e) {
  if (e.target.tagName === 'A') {
    const page = Number(e.target.dataset.id)
    renderMovieList(getMoviesByPage(page))
  }
})

renderPaginator(movies.length)
renderMovieList(getMoviesByPage(1))
