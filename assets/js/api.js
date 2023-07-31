'use strict';

const api_key = 'a3f49f270b4bca21f4e4a7aefb2c0829';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

// fetch data from server

const fetchDataFromServer = function (url, callback, optionalParam) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data, optionalParam));
};

export { api_key, imageBaseURL, fetchDataFromServer };
