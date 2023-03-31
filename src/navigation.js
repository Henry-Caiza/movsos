let pageSerie = 1;
let pageMovie = 1;
let pageUp = 1;
let page = 1;
let infiniteScroll;

listIdiomas.addEventListener('click', () => {
    lang = listIdiomas.value;
    homePage();
})
searchFormBtn.addEventListener('click', () => {
    //location.hash = '#search=' + searchFormInput.value;
    if (location.hash === '#series' || location.hash.startsWith('#searchS=')) {
        location.hash = '#searchS=' + searchFormInput.value;
    } else if (location.hash === '#movies' || location.hash.startsWith('#searchM=')) {
        location.hash = '#searchM=' + searchFormInput.value;
    } else {
        location.hash = '#searchM=' + searchFormInput.value;
    }
});

trendingBtn.addEventListener('click', () => {
    // location.hash === '' ? location.hash = '#upComming':
    location.hash === '#series' ? location.hash = '#trendSerie' :
        location.hash === '#movies' ? location.hash = '#trendMovie' :
            location.hash = '#upComming'
})

arrowBtn.addEventListener('click', () => history.back())

headerPlay.addEventListener('click', () => {
    const [_, id] = location.hash.split('=');
    if (location.hash.startsWith('#movie=')) {
        getVideoById(id);
        console.log(videoMovie.contentWindow);
        dialogModal.showModal();
    } else if (location.hash.startsWith('#serie=')) {
        getSerieVideoById(id);
        console.log(videoMovie.contentWindow);
        dialogModal.showModal();
    }


});

headerClose.addEventListener('click', () => {
    dialogModal.close();
    videoMovie.setAttribute('src', '');
});

btnDerecha.addEventListener('click', () => {
    trendingMoviesPreviewList.scrollLeft += trendingMoviesPreviewList.offsetWidth;
})

btnIzquierda.addEventListener('click', () => {
    trendingMoviesPreviewList.scrollLeft -= trendingMoviesPreviewList.offsetWidth;
})

moviesContainerBtn.addEventListener('click', () => location.hash = '#movies')
seriesContainerBtn.addEventListener('click', () => location.hash = '#series')

btnNavSeries.addEventListener('click', () => location.hash = '#series')
btnNavPeliculas.addEventListener('click', () => location.hash = '#movies')
// btnIdiomas.addEventListener('click', () => {
//     listIdiomas.classList.toggle('inactive');
// })

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

function navigator() {
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false });
        infiniteScroll = undefined;
    }

    location.hash.startsWith('#upComming') ? upComingPage() :
        location.hash.startsWith('#trendMovie') ? trendsPageM() :
            location.hash.startsWith('#trendSerie') ? trendsPageS() :
                location.hash.startsWith('#searchM=') ? searchPageMovies() :
                    location.hash.startsWith('#searchS=') ? searchPageSeries() :

                        location.hash.startsWith('#movie=') ? movieDetailPage() :
                            location.hash.startsWith('#serie=') ? serieDetailPage() :
                                location.hash.startsWith('#genre=') ? genresPage() :
                                    location.hash.startsWith('#genreSerie=') ? genresPageSerie() :
                                        location.hash.startsWith('#movies') ? moviesPage() :
                                            location.hash.startsWith('#series') ? seriesPage() : homePage();

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false });
    }
}

function homePage() {
    console.log('Home!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    headerP.classList.remove('inactive');
    headerLog.classList.remove('inactive');
    headerPlay.classList.add('inactive');
    dialogModal.classList.add('inactive');

    topPreviexList.classList.add('inactive');
    slideContainer.classList.remove('inactive');

    footer.classList.remove('inactive');
    navHeader.classList.remove('inactive');

    categoryContain.classList.remove('inactive');
    genresContainer.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    // categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    likedSection.classList.remove('inactive');
    likedSSection.classList.remove('inactive');

    titleTrend.innerHTML = 'En camino';
    headerP.innerHTML = 'Qué quieres ver?'
    getMoviesUpCommingPreview();
    // getTotalMovies();
    // getTotalSeries();
    getGenresPreview();
    getLikedMovies();
    getLikedSeries();
}

function genre() {
    console.log('Generos!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    headerLog.classList.remove('inactive');
    headerPlay.classList.add('inactive');

    slideContainer.classList.add('inactive');
    topPreviexList.classList.add('inactive');
    navHeader.classList.add('inactive');

    footer.classList.remove('inactive');

    categoryContain.classList.add('inactive');
    genresContainer.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    //categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    likedSection.classList.add('inactive');
    likedSSection.classList.add('inactive');
}

function genresPage() {
    page = 1;
    genre();
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerHTML = categoryName;
    getMoviesByGenre(categoryId);
    infiniteScroll = getPaginatedMovieGenreBySearch(categoryId);
}

function genresPageSerie() {
    page = 1;
    genre();
    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerHTML = categoryName;
    getSeriesByGenre(categoryId);
    infiniteScroll = getPaginatedSerieGenreBySearch(categoryId);
}

function viewPageAlternate() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    headerP.classList.add('inactive');
    headerLog.classList.remove('inactive');
    headerPlay.classList.add('inactive')

    footer.classList.remove('inactive');
    slideContainer.classList.add('inactive');
    topPreviexList.classList.add('inactive');
    navHeader.classList.add('inactive');

    categoryContain.classList.add('inactive');
    genresContainer.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    //categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    likedSection.classList.add('inactive');
    likedSSection.classList.add('inactive');
}

function trendsPageM() {
    page = 1;
    console.log('TrendsM!!');
    viewPageAlternate();
    headerCategoryTitle.innerHTML = 'Tendencias';
    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;
}
function trendsPageS() {
    page = 1;
    console.log('TrendsS!!');
    viewPageAlternate();
    headerCategoryTitle.innerHTML = 'Tendencias';
    getTrendingSeries();
    infiniteScroll = getPaginatedTrendingSeries;
    // infiniteScroll = getPaginatedTrendingMovies();
}

function upComingPage() {
    page = 1;
    console.log('UP!!');
    viewPageAlternate();
    headerCategoryTitle.innerHTML = 'En camino';
    getMoviesUpComming();
    infiniteScroll = getPaginatedUpCommingMovies;
}

function detailPage() {
    console.log('Movie!!');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    headerP.classList.add('inactive');
    headerLog.classList.add('inactive');
    headerPlay.classList.remove('inactive');
    dialogModal.classList.remove('inactive');

    slideContainer.classList.add('inactive');
    footer.classList.add('inactive');
    topPreviexList.classList.add('inactive');
    navHeader.classList.add('inactive');

    categoryContain.classList.add('inactive');
    genresContainer.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    likedSection.classList.add('inactive');
    likedSSection.classList.add('inactive');
}

function movieDetailPage() {

    detailPage();
    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}

function serieDetailPage() {

    detailPage();
    const [_, seriId] = location.hash.split('=');
    getSerieById(seriId);
}
function searchTitulos() {
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    headerP.classList.add('inactive');
    headerPlay.classList.add('inactive');
    headerLog.classList.remove('inactive');
    slideContainer.classList.add('inactive');

    topPreviexList.classList.add('inactive');
    footer.classList.remove('inactive');
    categoryContain.classList.add('inactive');
    genresContainer.classList.add('inactive');

    navHeader.classList.add('inactive');

    navHeader.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    likedSection.classList.add('inactive');
    likedSSection.classList.add('inactive');
}
function searchPageMovies() {
    page = 1;
    searchTitulos();
    navHeader.classList.add('inactive');
    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);
    infiniteScroll = getPaginatedMoviesBySearch(query);

}
function searchPageSeries() {
    page = 1;
    searchTitulos();
    navHeader.classList.add('inactive');
    const [_, query] = location.hash.split('=');
    getSeriesBySearch(query);
    infiniteScroll = getPaginatedSeriesBySearch(query);
}


////////////////////////////////pages-////////////////////


function pagesView() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    headerP.classList.remove('inactive');
    headerLog.classList.remove('inactive');
    headerPlay.classList.add('inactive');
    dialogModal.classList.add('inactive');

    navHeader.classList.add('inactive');
    footer.classList.remove('inactive');

    categoryContain.classList.add('inactive');
    genresContainer.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    slideContainer.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

}
function moviesPage() {
    topPreviexList.classList.remove('inactive');
    likedSection.classList.remove('inactive');
    likedSSection.classList.add('inactive');

    pagesView();
    getTrendingMoviesPreview();
    getTopMoviesPreview();
    getGenresPreview();
    getLikedMovies();
}
function seriesPage() {
    topPreviexList.classList.remove('inactive');
    likedSSection.classList.remove('inactive');
    likedSection.classList.add('inactive');

    pagesView();
    getTrendingSeriesPreview();
    getTopSeriesPreview();
    getGenresPreviewSeries();
    getLikedSeries();
}