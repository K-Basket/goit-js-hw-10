import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1/';
const FILTER_URL = 'fields=name,capital,population,flags,languages';

const inputSearch = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  const dataInput = evt.target.value.toLowerCase().trim();

  if (dataInput === '') {
    return clearMarkup();
  }

  const url = `${BASE_URL}name/${dataInput}?${FILTER_URL}`;

  fetchCountries(url).then(makeMarkup).catch(handlesErrors);
}

function createCountrylist(data) {
  return data
    .map(el => {
      return `
      <li class="list_item">
        <img src="${el.flags.svg}" alt="Flag"></img>
        <h2>${el.name.common}</h2>
      </li>
    `;
    })
    .join('');
}

function createCountryInfo(data) {
  return data
    .map(el => {
      return `
       <div class="title_country_info">
         <img src="${el.flags.svg}" alt="Flag"></img>
         <h2>${el.name.common}</h2>
       </div>
       <p><span>Capital:</span>${el.capital}</p>
       <p><span>Population:</span>${el.population.toLocaleString()}</p>
       <p><span>Languages:</span>${Object.values(el.languages)}</p>
     `;
    })
    .join('');
}

function makeMarkup(data) {
  clearMarkup();

  if (data.length < 10 && data.length > 1) {
    countryListEl.insertAdjacentHTML('beforeend', createCountrylist(data));
    return;
  }

  if (data.length === 1) {
    countryInfoEl.insertAdjacentHTML('beforeend', createCountryInfo(data));
    return;
  }

  Notify.info('Too many matches found. Please enter a more specific name.');
}

function clearMarkup() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function handlesErrors() {
  clearMarkup();
  Notify.failure('Oops, there is no country with that name');
}
