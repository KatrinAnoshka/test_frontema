import $ from 'jquery';
import 'slick-carousel';

export default class AdvList {
  static get selectors() {
    return {
      main: '.b-adv-list',
      items: '.b-adv-list__items',
    };
  }

  static init($context = $(document), options = {}) {
    $(AdvList.selectors.main, $context)
      .each((i, elem) => {
        if (!$(elem).hasClass('js-init')) {
          return null;
        }
        if ($(elem).data('block-api')) {
          return $(elem).data('block-api');
        }
        return new AdvList($(elem), options);
      });
  }

  constructor($elem, options) {
    this.params = $.extend({
      selectors: AdvList.selectors,
    }, options);

    this.elems = {
      $main: $elem,
      $items: $elem.find(this.params.selectors.items),
    };

    this.state = { isMobileSliderInitialized: false };

    if (this.elems.$main.hasClass('b-adv-list_mobile-slider')) {
      this.initMobileSlider();
    }

    this.initEvents();
    this.exportApi();
  }

  initMobileSlider() {
    const width = $(window).width();

    if (width < 768) {
      this.buildMobileSlider();
    } else {
      this.destroyMobileSlider();
    }
  }

  buildMobileSlider() {
    if (!this.state.isMobileSliderInitialized) {
      const params = {
        slidesToShow: 2,
        slidesToScroll: 2,
        adaptiveHeight: false,
        draggable: false,
        infinite: true,
        swipeToSlide: true,
        variableWidth: true,
        arrows: false,
      };

      this.elems.$items.slick(params);
      this.state.isMobileSliderInitialized = true;
    }
  }

  destroyMobileSlider() {
    if (this.state.isMobileSliderInitialized) {
      this.elems.$items.slick('unslick');
      this.state.isMobileSliderInitialized = false;
    }
  }

  initEvents() {
    if (this.elems.$main.hasClass('b-adv-list_mobile-slider')) {
      $(window).on('resize', () => this.initMobileSlider());
    }
  }

  exportApi() {
    this.elems.$main.data('block-api', this);
  }
}
