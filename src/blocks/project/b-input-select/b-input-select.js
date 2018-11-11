import $ from 'jquery';
import 'slick-carousel';

export default class InputSelect {
  static get selectors() {
    return {
      main: '.b-input-select',
      select: '.b-input-select__select',
    };
  }

  static init($context = $(document), options = {}) {
    $(InputSelect.selectors.main, $context)
      .each((i, elem) => {
        if (!$(elem).hasClass('js-init')) {
          return null;
        }
        if ($(elem).data('block-api')) {
          return $(elem).data('block-api');
        }
        return new InputSelect($(elem), options);
      });
  }

  constructor($elem, options) {
    this.params = $.extend({
      selectors: InputSelect.selectors,
    }, options);

    this.elems = {
      $main: $elem,
      $select: $elem.find(this.params.selectors.select),
    };
    this.updateSelectState();
    this.initEvents();
    this.exportApi();
  }

  updateSelectState = () => {
    const val = this.elems.$select.val();
    this.elems.$main.toggleClass('b-input-select_has-value', val !== undefined && val !== '');
  }

  initEvents() {
    this.elems.$select.on('change', this.updateSelectState);
  }

  exportApi() {
    this.elems.$main.data('block-api', this);
  }
}
