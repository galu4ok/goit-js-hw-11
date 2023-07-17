import axios from 'axios';

const API_KEY = '38297408-262b633b3336e15c299396762';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesSearchApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  // Функція getSearchImages(), яка виконує HTTP-запит та отримує пошукове зображення

  async getSearchImages() {
    const getData = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.perPage,
      },
    });
    return getData.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get perOnePage() {
    return this.perPage;
  }

  get currentPage() {
    return this.page;
  }
}
