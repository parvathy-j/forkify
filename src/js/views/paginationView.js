import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) return this._generateMarkupBtn('next');

    //Last
    if (curPage === numPages && numPages > 1)
      return this._generateMarkupBtn('prev');

    //Other page
    if (curPage < numPages)
      return `${this._generateMarkupBtn('prev')}${this._generateMarkupBtn(
        'next'
      )}`;
    //Page 1 and there are no other pages
    return ` `;
  }
  _generateMarkupBtn(type) {
    let pageNumber = this._data.page;
    return `
      <button  data-goto="${
        type === 'next' ? (pageNumber += 1) : (pageNumber -= 1)
      }"class="btn--inline pagination__btn--${type}">
        ${type === 'next' ? `<span>Page ${pageNumber}</span>` : ''}
        <svg class="search__icon">
           <use href="${icons}#icon-arrow-${
      type === 'next' ? 'right' : 'left'
    }"></use>
        </svg>
        ${type === 'prev' ? `<span>Page ${pageNumber}</span>` : ''}
      </button>
    `;
  }
}
export default new PaginationView();
