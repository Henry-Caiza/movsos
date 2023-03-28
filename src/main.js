const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json:charset=utf-8'
    },
    params: {
        'api_key': '973c4010f92c5b12f8f9dd9872b69d3a'
    }
});

function createMovies(data, container) {

    container.innerHTML = "";
    data.forEach(movie => {
        if (movie.poster_path !== null) {
            const movieContainer = document.createElement('div');
            movieContainer.classList.add('movie-container');
            movieContainer.addEventListener('click', () => {
                location.hash = '#movie=' + movie.id;
                console.log(movie);
            })
            const movieImg = document.createElement('img');

            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', movie.title);
            movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
            movieContainer.appendChild(movieImg);
            container.appendChild(movieContainer);
        }
    })
}

function createSeries(data, container) {

    container.innerHTML = "";
    data.forEach(serie => {
        if (serie.poster_path !== null) {
            const movieContainer = document.createElement('div');
            movieContainer.classList.add('movie-container');
            movieContainer.addEventListener('click', () => {
                location.hash = '#serie=' + serie.id;
                console.log(serie);
            })
            const movieImg = document.createElement('img');

            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', serie.title);
            movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + serie.poster_path);
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
    createMovies(movies, trendingMoviesPreviewList);
}


async function getTrendingSeriesPreview() {
    const { data } = await api('trending/tv/day');
    const series = data.results;
    titleTrend.innerHTML = 'Tendencias';
    headerP.innerHTML = 'Encuentra tu serie favorita 🍿'
    createSeries(series, trendingMoviesPreviewList);
}

async function getTopMoviesPreview() {
    const { data } = await api('movie/top_rated');
    const movies = data.results;
    createMovies(movies, topMoviesPreviewList);
}
async function getTopSeriesPreview() {
    const { data } = await api('tv/top_rated');
    const series = data.results;
    createSeries(series, topMoviesPreviewList);
}


async function getGenresPreview() {
    const { data } = await api('genre/movie/list');
    const genres = data.genres;

    createGenres(genres, genresContain);
}

async function getGenresPreviewSeries() {
    const { data } = await api('genre/tv/list');
    const genres = data.genres;
    console.log(genres);
    createGenresSerie(genres, genresContain);
}

async function getMoviesByGenre(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id
        }
    });
    const movies = data.results;

    createMovies(movies, genericSection);
}

async function getSeriesByGenre(id) {
    const { data } = await api('discover/tv', {
        params: {
            with_genres: id
        }
    });
    const series = data.results;

    createSeries(series, genericSection);
}

async function getTrendingMovies() {
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    createMovies(movies, genericSection);
}

async function getTrendingSeries() {
    const { data } = await api('trending/tv/day');
    const series = data.results;

    createSeries(series, genericSection);
}

async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;

    createMovies(movies, genericSection);
}

async function getSeriesBySearch(query) {
    const { data } = await api('search/tv', {
        params: {
            query,
        }
    });
    const series = data.results;

    createSeries(series, genericSection);
}

async function getMovieById(id) {
    const { data: movie } = await api('movie/' + id);
    movieDetailTitle.textContent = movie.title
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),url(${movieImgUrl})`;
    createGenres(movie.genres, movieDetailCategoriesList);
    getRelatedMoviesById(id);
}

async function getSerieById(id) {
    const { data: serie } = await api('tv/' + id);
    movieDetailTitle.textContent = serie.name
    movieDetailDescription.textContent = serie.overview;
    movieDetailScore.textContent = serie.vote_average;

    const serieImgUrl = 'https://image.tmdb.org/t/p/w500' + serie.poster_path;
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),url(${serieImgUrl})`;
    createGenresSerie(serie.genres, movieDetailCategoriesList);
    getRelatedSeriesById(id);
}


async function getRelatedMoviesById(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);

}
async function getRelatedSeriesById(id) {
    const { data } = await api(`tv/${id}/recommendations`);
    const relatedSeries = data.results;

    createSeries(relatedSeries, relatedMoviesContainer);

}

async function getVideoById(id) {
    const { data } = await api('movie/' + id + '/videos');
    const video = data.results;
    const urlVideo = 'https://www.youtube.com/embed/' + video[0].key;
    videoMovie.setAttribute('src', urlVideo);
    console.log(dialogModal);
}

async function getSerieVideoById(id) {
    const { data } = await api('tv/' + id + '/videos');
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
    const { data } = await api('movie/upcoming');
    const upMovies = data.results;

    createMovies(upMovies, trendingMoviesPreviewList);
}

async function getMoviesUpComming() {
    const { data } = await api('movie/upcoming');
    const upMovies = data.results;

    createMovies(upMovies, genericSection);
}


//getVideo(550);