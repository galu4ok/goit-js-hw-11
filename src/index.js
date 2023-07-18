import './sass/index.scss';
import { refs } from './js/refs';
import { createMarkup } from './js/markup';
import ImagesSearchApi from './js/image-search-api';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.loadButton.style.display = 'none';
let totalPages = 1;
const imagesSearchApi = new ImagesSearchApi();

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadButton.addEventListener('click', onMoreBtnClick);

async function onSearchFormSubmit(e) {
  e.preventDefault();
  imagesSearchApi.resetPage();
  clearGallery();

  imagesSearchApi.query = e.currentTarget.elements.searchQuery.value.trim();

  if (imagesSearchApi.query === '') {
    onFetchWarning();
    return;
  }

  imagesSearchApi
    .getSearchImages()
    .then(data => {
      // console.log('DATA:', data);
      const hitsImages = data.hits;
      const totalImages = data.totalHits;

      if (!hitsImages.length) {
        refs.loadButton.style.display = 'none';
        onFetchError();
        return;
      }
      onFetchSuccess(totalImages);

      refs.gallery.innerHTML = createMarkup(hitsImages);
      lightbox.refresh();

      totalPages = Math.ceil(
        Number(data.totalHits / imagesSearchApi.perOnePage)
      );
      if (imagesSearchApi.currentPage === totalPages) {
        refs.loadButton.style.display = 'none';
        setTimeout(() => {
          onFetchInfo();
        }, 3000);
      } else {
        refs.loadButton.style.display = 'block';
        onMoreBtnClick();
      }
    })
    .catch(onFetchError);
}
async function onMoreBtnClick() {
  imagesSearchApi.incrementPage();
  lightbox.refresh();

  imagesSearchApi.getSearchImages().then(data => {
    totalPages = Math.ceil(Number(data.totalHits / imagesSearchApi.perOnePage));
    if (imagesSearchApi.currentPage === totalPages) {
      refs.loadButton.style.display = 'none';
      onFetchInfo();
    } else {
      refs.loadButton.style.display = 'block';
    }
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));

    const { height: cardHeight } =
      refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

const notiflixOptions = {
  position: 'center-center',
  titleMaxLength: '100',
  width: '400px',
};
function onFetchWarning() {
  Notiflix.Report.warning(
    'Please,enter valid value.Input field is empty or contains only spaces.',
    '',
    'Ok',
    notiflixOptions
  );
}

function onFetchSuccess(totalImages) {
  Notiflix.Report.success(
    `Hooray!We found ${totalImages} images.`,
    '',
    'Ok',
    notiflixOptions
  );
}

function onFetchError() {
  Notiflix.Report.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    '',
    'Ok',
    notiflixOptions
  );
}

function onFetchInfo() {
  console.log('OK0');
  Notiflix.Report.info(
    'We are sorry, but you have reached the end of search results.',
    '',
    'Ok',
    notiflixOptions
  );
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
