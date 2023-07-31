'use strict';

// imports
import { sidebar } from './sidebar.js';
import { api_key, imageBaseURL, fetchDataFromServer } from './api.js';

// sidebar toggle
sidebar();

const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`;
const genreURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`;
const pageContent = document.querySelector('[page-content]');

// fetch all genres
const genreList = {
  // create genre string from genre_id
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
    }

    return newGenreList.join(', ');
  },
};

fetchDataFromServer(genreURL, function ({ genres }) {
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  fetchDataFromServer(url, heroBanner);
});

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement('section');
  banner.classList.add('banner');
  banner.ariaLabel = 'Popular Movies';

  banner.innerHTML = `
        <div class="banner-slider"></div>

        <div class="slider-control">
          <div class="control-inner"></div>
        </div>
 `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement('div');
    sliderItem.classList.add('slider-item');
    sliderItem.setAttribute('slider-item', '');

    sliderItem.innerHTML = `
            <img
              src=${imageBaseURL}w1280${backdrop_path}
              alt=${title}
              class="img-cover"
              loading=${index === 0 ? 'eager' : 'lazy'}
            />

            <div class="banner-content">
              <h2 class="heading">${title}</h2>

              <div class="meta-list">
                <div class="meta-item">${release_date.split('-')[0]}</div>
                <div class="meta-item card-badge">${vote_average.toFixed(
                  1
                )}</div>
              </div>

              <p class="genre">${genreList.asString(genre_ids)}</p>

              <p class="banner-text">${overview}</p>

              <a href="./detail.html" class="btn">
                <img
                  src="./assets/images/play_circle.png"
                  width="24"
                  height="24"
                  aria-hidden="true"
                  alt="play circle"
                />

                <span class="span">Watch Now</span>
              </a>
            </div>
    `;

    banner.querySelector('.banner-slider').appendChild(sliderItem);

    const controlItem = document.createElement('button');
    controlItem.classList.add('poster-box', 'slider-item');
    controlItem.setAttribute('slider-control', `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
              <img
                src=${imageBaseURL}w154${poster_path}
                alt=Slide to ${title}
                loading="lazy"
                draggable="false"
                class="img-cover"
              />
    `;

    banner.querySelector('.control-inner').appendChild(controlItem);
  }

  pageContent.appendChild(banner);

  addHeroSlide();
};

// hero slider functionality
const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll('[slider-item]');
  const sliderControls = document.querySelectorAll('[slider-control]');

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add('active');
  lastSliderControl.classList.add('active');

  const sliderStart = function () {
    lastSliderItem.classList.remove('active');
    lastSliderControl.classList.remove('active');

    sliderItems[Number(this.getAttribute('slider-control'))].classList.add(
      'active'
    );
    this.classList.add('active');

    lastSliderItem = sliderItems[Number(this.getAttribute('slider-control'))];
    lastSliderControl = this;
  };

  addEventOnElements(sliderControls, 'click', sliderStart);
};
