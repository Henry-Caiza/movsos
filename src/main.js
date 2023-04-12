let maxPageMovie;
let maxPageSerie;
let lang = 'es';
listIdiomas.addEventListener('click', () => {
    lang = listIdiomas.value;
    // homePage();
})
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json:charset=utf-8'
    },
    params: {
        'api_key': '973c4010f92c5b12f8f9dd9872b69d3a',
        "language": lang
    }
});


function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    item ? movies = item : movies = {};
    return movies;
}

function likedMovie(movie) {
    const likedMovies = likedMoviesList();
    likedMovies[movie.id] ? likedMovies[movie.id] = undefined
        : likedMovies[movie.id] = movie;
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}

function likedSeriesList() {
    const item = JSON.parse(localStorage.getItem('liked_series'));
    //console.log(item);
    let series;
    item ? series = item : series = {};
    return series;
}

function likedSerie(serie) {
    const likedSeries = likedSeriesList();
    likedSeries[serie.id] ? likedSeries[serie.id] = undefined
        : likedSeries[serie.id] = serie;
    localStorage.setItem('liked_series', JSON.stringify(likedSeries));
}

//utils
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    })
})

function createMovies(data, container, {
    lazyLoad = false,
    clean = true }) {
    if (clean) {
        container.innerHTML = '';
    }
    //container.innerHTML = "";
    data.forEach(movie => {
        if (movie.poster_path !== null) {
            const movieContainer = document.createElement('div');
            movieContainer.classList.add('movie-container');

            const movieImg = document.createElement('img');

            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', movie.title);
            movieImg.setAttribute(
                lazyLoad ? 'data-img' : 'src',
                'https://image.tmdb.org/t/p/w300' + movie.poster_path);
            movieImg.addEventListener('error', () => {
                movieImg.setAttribute('src', '../img/error.png');
            });
            movieContainer.addEventListener('click', () => {
                location.hash = '#movie=' + movie.id;
                console.log(movie);
            })

            const movieBtn = document.createElement('button');
            movieBtn.classList.add('movie-btn');

            likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');

            movieBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                movieBtn.classList.toggle('movie-btn--liked');
                likedMovie(movie);
                getLikedMovies();
            })
            if (lazyLoad) {
                lazyLoader.observe(movieImg);
            }
            movieContainer.appendChild(movieBtn);
            movieContainer.appendChild(movieImg);
            container.appendChild(movieContainer);
        }
    })
}

function createSeries(data, container, {
    lazyLoad = false,
    clean = true }) {
    if (clean) {
        container.innerHTML = '';
    }
    //container.innerHTML = "";
    data.forEach(serie => {
        if (serie.poster_path !== null) {
            const movieContainer = document.createElement('div');
            movieContainer.classList.add('movie-container');

            const movieImg = document.createElement('img');

            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', serie.title);
            movieImg.setAttribute(
                lazyLoad ? 'data-img' : 'src',
                'https://image.tmdb.org/t/p/w300' + serie.poster_path);
            movieContainer.addEventListener('click', () => {
                location.hash = '#serie=' + serie.id;
                console.log(serie);
            })
            const serieBtn = document.createElement('button');
            serieBtn.classList.add('serie-btn');

            likedSeriesList()[serie.id] && serieBtn.classList.add('serie-btn--liked');

            serieBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                serieBtn.classList.toggle('serie-btn--liked');
                likedSerie(serie);
                getLikedSeries();
            })

            if (lazyLoad) {
                lazyLoader.observe(movieImg);
            }
            movieContainer.appendChild(serieBtn);
            movieContainer.appendChild(movieImg);
            container.appendChild(movieContainer);
        }
    })
}

function createGenres(data, container) {
    container.innerHTML = "";

    data.forEach(genre => {

        const genreTitle = document.createElement('h3');
        genreTitle.classList.add('genre-title');

        const categoryP = document.createElement('p');
        categoryP.classList.add('genre-p');

        const genreSection = document.createElement('section');
        genreSection.classList.add('genresPreview-list');

        genreSection.setAttribute('id', 'id' + genre.id);
        genreSection.addEventListener('click', () => {
            location.hash = `#genre=${genre.id}-${genre.name}`;
            headerP.classList.add('inactive');
        })
        const categoryTitleText = document.createTextNode(genre.name);

        genreTitle.appendChild(categoryTitleText);
        genreSection.appendChild(genreTitle);
        genreSection.appendChild(categoryP);
        container.appendChild(genreSection);
    })
}


function createGenresSerie(data, container) {
    container.innerHTML = "";

    data.forEach(genre => {

        const genreTitle = document.createElement('h3');
        genreTitle.classList.add('genre-title');

        const categoryP = document.createElement('p');
        categoryP.classList.add('genre-p');

        const genreSection = document.createElement('section');
        genreSection.classList.add('genresPreview-list');

        genreSection.setAttribute('id', 'ids' + genre.id);
        genreSection.addEventListener('click', () => {
            location.hash = `#genreSerie=${genre.id}-${genre.name}`;
            headerP.classList.add('inactive');
        })
        const categoryTitleText = document.createTextNode(genre.name);

        genreTitle.appendChild(categoryTitleText);
        genreSection.appendChild(genreTitle);
        genreSection.appendChild(categoryP);
        container.appendChild(genreSection);
    })
}


async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    titleTrend.innerHTML = 'Tendencias';
    headerP.innerHTML = 'Encuentra tu película favorita 🎬'
    createMovies(movies, trendingMoviesPreviewList, true);
}


async function getTrendingSeriesPreview() {
    const { data } = await api('trending/tv/day');
    const series = data.results;
    titleTrend.innerHTML = 'Tendencias';
    headerP.innerHTML = 'Encuentra tu serie favorita 🍿'
    createSeries(series, trendingMoviesPreviewList, true);
}

async function getTopMoviesPreview() {
    const { data } = await api('movie/top_rated');
    const movies = data.results;
    createMovies(movies, topMoviesPreviewList, true);
}
async function getTopSeriesPreview() {
    const { data } = await api('tv/top_rated');
    const series = data.results;
    createSeries(series, topMoviesPreviewList, true);
}


async function getGenresPreview() {
    const { data } = await api('genre/movie/list', {
        params: {
            language: lang,
        },
    });
    const genres = data.genres;

    createGenres(genres, genresContain);
}

async function getGenresPreviewSeries() {
    const { data } = await api('genre/tv/list', {
        params: {
            "language": lang
        }
    });
    const genres = data.genres;
    console.log(genres);
    createGenresSerie(genres, genresContain);
}

async function getMoviesByGenre(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
            "language": lang
        }
    });
    const movies = data.results;
    maxPageMovie = data.total_pages;
    createMovies(movies, genericSection, {
        lazyLoad: true,
    });
}
function getPaginatedMovieGenreBySearch(query) {
    return async () => {
        const pageIsNotMax = page < maxPageMovie;
        const isScrollBottom = scrollIsBottom();
        if (isScrollBottom && pageIsNotMax) {
            page++;
            const { data } = await api('discover/movie', {
                params: {
                    query,
                    page,
                    "language": lang
                }
            });
            const movies = data.results;

            createSeries(movies, genericSection, {
                lazyLoad: true,
                clean: false
            });
        }
    }
}
async function getSeriesByGenre(id) {
    const { data } = await api('discover/tv', {
        params: {
            with_genres: id,
            "language": lang
        }
    });
    const series = data.results;
    maxPageSerie = data.total_pages;
    createSeries(series, genericSection, {
        lazyLoad: true,
        clean: true
    });
}
function getPaginatedSerieGenreBySearch(query) {
    return async () => {
        const pageIsNotMax = page < maxPageSerie;
        const isScrollBottom = scrollIsBottom();
        if (isScrollBottom && pageIsNotMax) {
            page++;
            const { data } = await api('discover/tv', {
                params: {
                    query,
                    page,
                    "language": lang
                }
            });
            const series = data.results;

            createSeries(series, genericSection, {
                lazyLoad: true,
                clean: false
            });
        }
    }
}
async function getTrendingMovies() {
    const { data } = await api('trending/movie/day', {
        params: {
            "language": lang
        }
    });
    const movies = data.results;
    maxPageMovie = data.total_pages;
    createMovies(movies, genericSection, {
        lazyLoad: true,
        clean: true
    });

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = "cargar mas";
    // genericSection.appendChild(btnLoadMore);
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
}
function scrollIsBottom() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isScrollBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    return isScrollBottom;
}
async function getPaginatedTrendingMovies() {
    const pageIsNotMax = page < maxPageMovie;
    const isScrollBottom = scrollIsBottom();
    if (isScrollBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
                page,
                "language": lang
            }
        });
        const movies = data.results;

        createMovies(movies, genericSection, {
            lazyLoad: true,
            clean: false
        });
    }
}
async function getTrendingSeries() {
    const { data } = await api('trending/tv/day', {
        params: {
            "language": lang
        }
    });
    const series = data.results;
    maxPageSerie = data.total_pages;
    createSeries(series, genericSection, {
        lazyLoad: true,
        clean: true
    });
}
async function getPaginatedTrendingSeries() {
    const pageIsNotMax = page < maxPageSerie;

    const isScrollBottom = scrollIsBottom();
    if (isScrollBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/tv/day', {
            params: {
                page,
                "language": lang
            }
        });
        const series = data.results;

        createSeries(series, genericSection, {
            lazyLoad: true,
            clean: false
        });
    }
}



async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query,
            "language": lang
        }
    });
    const movies = data.results;
    maxPageMovie = data.total_pages;
    createMovies(movies, genericSection, true);
}

async function getSeriesBySearch(query) {
    const { data } = await api('search/tv', {
        params: {
            query,
            "language": lang
        }
    });
    const series = data.results;
    maxPageSerie = data.total_pages;
    createSeries(series, genericSection, true);
}

function getPaginatedMoviesBySearch(query) {
    return async () => {
        const pageIsNotMax = page < maxPageMovie;
        const isScrollBottom = scrollIsBottom();
        if (isScrollBottom && pageIsNotMax) {
            page++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                    "language": lang
                }
            });
            const movies = data.results;

            createSeries(movies, genericSection, {
                lazyLoad: true,
                clean: false
            });
        }
    }
}

function getPaginatedSeriesBySearch(query) {
    return async () => {
        const pageIsNotMax = page < maxPageSerie;
        const isScrollBottom = scrollIsBottom();
        if (isScrollBottom && pageIsNotMax) {
            page++;
            const { data } = await api('search/tv', {
                params: {
                    query,
                    page,
                    "language": lang
                }
            });
            const series = data.results;

            createSeries(series, genericSection, {
                lazyLoad: true,
                clean: false
            });
        }
    }
}

async function getMovieById(id) {
    const { data: movie } = await api('movie/' + id, {
        params: {
            "language": lang
        }
    });
    movieDetailTitle.textContent = movie.title
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
    console.log(lang);
    if (window.matchMedia('(max-width: 750px)').matches) {
        const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
        headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),url(${movieImgUrl})`;

    } else {
        const movieImgUrl = 'https://image.tmdb.org/t/p/w1280' + movie.backdrop_path;
        headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),url(${movieImgUrl})`;
    }


    createGenres(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesById(id);
}

async function getSerieById(id) {
    const { data: serie } = await api('tv/' + id, {
        params: {
            "language": lang
        }
    });
    movieDetailTitle.textContent = serie.name
    movieDetailDescription.textContent = serie.overview;
    movieDetailScore.textContent = serie.vote_average;
    if (window.matchMedia('(max-width: 768px)').matches) {
        const serieImgUrl = 'https://image.tmdb.org/t/p/w500' + serie.poster_path;
        headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),url(${serieImgUrl})`;
    } else {
        const serieImgUrl = 'https://image.tmdb.org/t/p/w1280' + serie.backdrop_path;
        headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),url(${serieImgUrl})`;
    }

    createGenresSerie(serie.genres, movieDetailCategoriesList);
    getRelatedSeriesById(id);
}


async function getRelatedMoviesById(id) {
    const { data } = await api(`movie/${id}/recommendations`, {
        params: {
            "language": lang
        }
    });
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer, {
        lazyLoad: false,
        clean: true,
    });

}
async function getRelatedSeriesById(id) {
    const { data } = await api(`tv/${id}/recommendations`, {
        params: {
            "language": lang
        }
    });
    const relatedSeries = data.results;

    createSeries(relatedSeries, relatedMoviesContainer, {
        lazyLoad: false,
        clean: true
    });

}

async function getVideoById(id) {
    const { data } = await api('movie/' + id + '/videos', {
        params: {
            "language": lang
        }
    });
    const video = data.results;
    if (video.length == 0) {
        videoMovie.setAttribute('src', '../img/error.png');
    } else {
        const urlVideo = 'https://www.youtube.com/embed/' + video[0].key;

        videoMovie.setAttribute('src', urlVideo);


        console.log(dialogModal);
    }

}

async function getSerieVideoById(id) {
    const { data } = await api('tv/' + id + '/videos', {
        params: {
            "language": lang
        }
    });
    const video = data.results;
    const urlVideo = 'https://www.youtube.com/embed/' + video[0].key;
    videoMovie.setAttribute('src', urlVideo);
    console.log(dialogModal);
}

async function getTotalMovies() {
    const { data } = await api('trending/movie/day');
    const total = data.total_results - 18537;
    totalMoviesP.innerHTML = ''
    const totalText = document.createTextNode(total + ' Títulos');
    totalMoviesP.appendChild(totalText);
}

async function getTotalSeries() {
    const { data } = await api('trending/tv/day');
    const total = data.total_results - 19377;
    totalSeriesP.innerHTML = ''
    const totalText = document.createTextNode(total + ' Títulos');
    totalSeriesP.appendChild(totalText);
}

async function getMoviesUpCommingPreview() {
    const { data } = await api('movie/upcoming', {
        params: {
            "language": lang
        }
    });
    const upMovies = data.results;

    createMovies(upMovies, trendingMoviesPreviewList, true);
}

async function getMoviesUpComming() {
    const { data } = await api('movie/upcoming', {
        params: {
            "language": lang
        }
    }
    );
    const upMovies = data.results;
    maxPageMovie = data.total_pages;
    createMovies(upMovies, genericSection, {
        lazyLoad: true,
        clean: true
    });
}

async function getPaginatedUpCommingMovies() {
    const pageIsNotMax = pageUp < maxPageMovie;
    const isScrollBottom = scrollIsBottom();
    if (isScrollBottom && pageIsNotMax) {
        pageUp++;
        const { data } = await api('movie/upcoming', {
            params: {
                page: pageUp,
                "language": lang
            }
        });
        const movies = data.results;

        createSeries(movies, genericSection, {
            lazyLoad: true,
            clean: false
        });
    }
}

function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);
    if (moviesArray.length == 0) {
        likedContainer.innerHTML = `Aún no tines películas agregadas a esta sección 📲`
    } else
        createMovies(moviesArray, likedContainer, { lazyLoad: true, clean: true })
}
function getLikedSeries() {
    const likedSeries = likedSeriesList();
    const seriesArray = Object.values(likedSeries);
    if (seriesArray.length == 0) {
        likedSContainer.innerHTML = `Aún no tines series agregadas a esta sección 📲`
    } else
        createSeries(seriesArray, likedSContainer, { lazyLoad: true, clean: true })
}

//getVideo(550);
