import $ from 'jquery';
import 'slick-carousel';

export default class PromoSlider {
  static get selectors() {
    return {
      main: '.b-promo-slider',
      slider: '.b-promo-slider__slides',
      prevArrow: '.b-promo-slider__arrow-left',
      nextArrow: '.b-promo-slider__arrow-right',
    };
  }

  static init($context = $(document), options = {}) {
    $(PromoSlider.selectors.main, $context)
      .each((i, elem) => {
        if (!$(elem).hasClass('js-init')) {
          return null;
        }
        if ($(elem).data('block-api')) {
          return $(elem).data('block-api');
        }
        return new PromoSlider($(elem), options);
      });
  }

  constructor($elem, options) {
    this.params = $.extend({
      selectors: PromoSlider.selectors,
    }, options);

    this.elems = {
      $main: $elem,
      $slider: $elem.find(this.params.selectors.slider),
      $prevArrow: $elem.find(this.params.selectors.prevArrow),
      $nextArrow: $elem.find(this.params.selectors.nextArrow),
    };

    this.initSlider();
    this.initEvents();
    this.exportApi();
  }

  initSlider() {
    const params = {
      infinite: true,
      fade: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: false,
      draggable: false,
      prevArrow: this.elems.$prevArrow,
      nextArrow: this.elems.$nextArrow,
      responsive: []
    };

    this.elems.$slider.slick(params);
  }

  initEvents() {
  }

  exportApi() {
    this.elems.$main.data('block-api', this);
  }
}
