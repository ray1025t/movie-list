const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12
const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const seachForm = document.querySelector('#seach-form')
const seachInput = document.querySelector('#search-input')
const pagination = document.querySelector('.pagination')
const showModel = document.querySelector('#show-model')
const showCard = document.querySelector('#show-card')
const showList = document.querySelector('#show-list')

function renderMovieCard(data) {
  let rawHTML = ''
  data.forEach(item => {
    // title image
    rawHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3">
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
          <button class="btn btn-info btn-add-favorite" data-id="${item.id
      }">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `<div class="col-12 mb-3 pb-2 border-bottom">
      <div class="row">
        <div class="col-8">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="col-4">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id
      }">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-data')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios
    .get(INDEX_URL + id).then(response => {
      const data = response.data.results
      console.log(data)
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image
        }"  alt="Movie Poster" class="img-fulid">`

    })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已在清單中')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  // //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  // //製作 template 
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" id="card-page" href="#" data-page="${page}">${page}</a></li>`
  }
  // //放回 HTML
  paginator.innerHTML = rawHTML
}

function renderListPaginator(amount) {
  // //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  // //製作 template 
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" id="list-page" href="#" data-page="${page}">${page}</a></li>`
  }
  // //放回 HTML
  paginator.innerHTML = rawHTML
}

// function renderPaginator(amount) {
// //計算總頁數
// const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
// //製作 template 
// let rawHTML = ''

// for (let page = 1; page <= numberOfPages; page++) {
//   rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
// }
// //放回 HTML
// paginator.innerHTML = rawHTML
// }

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    // render Pagination
    renderPaginator(movies.length)
    // render Movies
    renderMovieCard(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

seachForm.addEventListener('submit', function onSeachFormSubmited(event) {
  event.preventDefault()
  const keyword = seachInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword))

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  //重製分頁器
  renderPaginator(filteredMovies.length)
  //預設顯示第 1 頁的搜尋結果
  renderMovieCard(getMoviesByPage(1))  //修改這裡
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  // if (event.target.tagName !== 'A') return
  if (event.target.tagName === 'A') {
    //透過 dataset 取得被點擊的頁數
    if (event.target.id == 'card-page') {
      const page = Number(event.target.dataset.page)
      //更新畫面
      renderMovieCard(getMoviesByPage(page))
    } else if (event.target.id == 'list-page') {
      const page = Number(event.target.dataset.page)
      //更新畫面
      renderMovieList(getMoviesByPage(page))
    }

    // filteredMovies 兩種做法
    // for (movie of movies) {
    //   if (movie.title.toLowerCase().includes(keyword)) {
    //     filteredMovies.push(movie)
    //   }
    // }
  }
})

showModel.addEventListener('click', function onShowModelClicked(e) {
  const target = e.target
  const data = filteredMovies.length ? filteredMovies : movies
  if (target.matches('#show-card')) {
    // render Pagination
    renderPaginator(data.length)
    // render Movies
    renderMovieCard(getMoviesByPage(1))
  } else if (target.matches('#show-list')) {
    // render Pagination
    renderListPaginator(data.length)
    // render Movies
    renderMovieList(getMoviesByPage(1))
  }
})


