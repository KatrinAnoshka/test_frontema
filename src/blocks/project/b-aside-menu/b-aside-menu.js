import $ from 'jquery';
import 'slick-carousel';

export default class AsideMenu {
  static get selectors() {
    return {
      main: '.b-aside-menu',
      more: '.b-aside-menu__more-btn',
    };
  }

  static init($context = $(document), options = {}) {
    $(AsideMenu.selectors.main, $context)
      .each((i, elem) => {
        if (!$(elem).hasClass('js-init')) {
          return null;
        }
        if ($(elem).data('block-api')) {
          return $(elem).data('block-api');
        }
        return new AsideMenu($(elem), options);
      });
  }

  constructor($elem, options) {
    this.params = $.extend({
      selectors: AsideMenu.selectors,
    }, options);

    this.elems = {
      $main: $elem,
      $more: $elem.find(this.params.selectors.more),
    };

    this.initEvents();
    this.exportApi();
  }

  toggleView() {
    this.elems.$main.toggleClass('b-aside-menu_view-all');
  }

  initEvents() {
    this.elems.$more.on('click', (e) => {
      this.toggleView();
      e.preventDefault();
    });
  }

  exportApi() {
    this.elems.$main.data('block-api', this);
  }
}
