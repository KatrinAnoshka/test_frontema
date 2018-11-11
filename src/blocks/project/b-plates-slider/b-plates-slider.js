import $ from 'jquery';
import 'slick-carousel';

export default class PlatesSlider {
  static get selectors() {
    return {
      main: '.b-plates-slider',
      slider: '.b-plates-slider__slides',
      prevArrow: '.b-plates-slider__prev',
      nextArrow: '.b-plates-slider__next',
    };
  }

  static init($context = $(document), options = {}) {
    $(PlatesSlider.selectors.main, $context)
      .each((i, elem) => {
        if (!$(elem).hasClass('js-init')) {
          return null;
        }
        if ($(elem).data('block-api')) {
          return $(elem).data('block-api');
        }
        return new PlatesSlider($(elem), options);
      });
  }

  constructor($elem, options) {
    this.params = $.extend({
      selectors: PlatesSlider.selectors,
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
      slidesToShow: 4,
      slidesToScroll: 1,
      adaptiveHeight: false,
      draggable: false,
      prevArrow: this.elems.$prevArrow,
      nextArrow: this.elems.$nextArrow,
      responsive: [{
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          swipeToSlide: true,
          variableWidth: true
        }
      }]
    };

    this.elems.$slider.slick(params);
  }

  initEvents() {
  }

  exportApi() {
    this.elems.$main.data('block-api', this);
  }
}
