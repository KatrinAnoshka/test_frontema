import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import 'select2/dist/js/select2.js';
import PerfectScrollbar from 'perfect-scrollbar';

export class Tools {
  static initSvgPolyfill() {
    svg4everybody();
  }

  static initSelect2() {
    $('.js-select').each(function () {
      const params = $(this).data('params');
      $(this).select2({
        minimumResultsForSearch: -1,
        ...params
      });
    });
  }

  static initModal($context = $(document)) {
    /* Надо переписать, чтобы все было в рамках только u-modal (-u-modal-close, -modal-active)*/
    const options = $.extend({
      mainClass: 'u-modal',
      activeItem: 'u-modal_active',
      closeBtn: 'u-modal-close',
      bodyServiceClass: 'modal-active'
    }, {});

    const showModal = ($modal) => {
      $modal.addClass(options.activeItem);
      $('body').addClass(options.bodyServiceClass);
      $(window).trigger('resize');
    };

    const hideModal = ($modal) => {
      $modal.removeClass(options.activeItem);
      $('body').removeClass(options.bodyServiceClass);
    };

    $('body').on('click', '[data-modal]', (e) => {
      e.preventDefault();
      const target = $(e.currentTarget).attr('href');
      const $target = $(target);

      if ($target.length > 0) {
        showModal($target)
      }
    });

    $('body').on('click', '.' + options.closeBtn, (e) => {
      const $modal = $(e.currentTarget).closest('.' + options.mainClass);
      hideModal($modal);
      e.preventDefault();
    });

    const urlHash = window.location.hash.split('#')[1];

    if (urlHash) {
      const $targetModal = $(`#${urlHash}`);
      if ($targetModal.length > 0 && $targetModal.hasClass(options.mainClass)) {
        showModal($targetModal);
      }
    }
  }

  static initScrollFixer() {
    const getScrollbarWidth = () => {
      const outer = document.createElement("div");
      outer.style.visibility = "hidden";
      outer.style.width = "100px";
      outer.style.msOverflowStyle = "scrollbar";

      document.body.appendChild(outer);

      const widthNoScroll = outer.offsetWidth;
      outer.style.overflow = "scroll";

      const inner = document.createElement("div");
      inner.style.width = "100%";
      outer.appendChild(inner);

      const widthWithScroll = inner.offsetWidth;

      outer.parentNode.removeChild(outer);

      return widthNoScroll - widthWithScroll;
    };

    const setScrollbarFixer = () => {
      const barWidth = getScrollbarWidth();
      let $styleTag = $('#scroll-styler');

      if ($styleTag.length === 0) {
        $styleTag = $('<style id="scroll-styler"></style>');
        $styleTag.appendTo(document.head);
      }
      $styleTag.text(`
        .u-modal { padding-right: ${barWidth}px; }
        .modal-active { padding-right: ${barWidth}px; }
        .u-overlay_scroll-fix { padding-right: ${barWidth}px; }
        .u-overlay_scroll-fix .u-fixpos { padding-right: ${barWidth}px; }
      `);
    }

    setScrollbarFixer();
    $(window).on('resize', setScrollbarFixer);
  }

  static initCollapser() {
    $('body').on('click', '.js-collapser', (e) => {
      const $link = $(e.currentTarget);
      const target = $link.data('collapser-id');
      let $targets = $([]);
      let _scope = $link.parent();
      const openClass = $link.data('open-class');

      const toggleContextSelector = $link.data('toggle-context');
      const toggleTargetSelector = $link.data('toggle-target');
      const $toggleContext = $link.closest(toggleContextSelector);
      let $toggleTarget = {};

      if (!toggleContextSelector) {
        $toggleTarget = $link.closest(toggleTargetSelector);
      } else {
        $toggleTarget = $toggleContext.find(toggleTargetSelector);
      }

      const toggleClass = $link.data('toggle-class');

      const preventDoubleClicking = () => false;
      $link.on('click', preventDoubleClicking);
      setTimeout(() => $link.off('click', preventDoubleClicking), 400);

      e.preventDefault();

      if (target === undefined) {
        while ($targets.length === 0) {
          $targets = _scope.find('.u-collapser').eq(0);
          _scope = _scope.parent();
          if (_scope.prop("tagName") === 'HTML') {
            break;
          }
        }
      } else {
        $targets = $('.u-collapser').filter(`[data-target=${target}]`);
      }

      $targets.toggleClass('u-collapser_open');
      $toggleTarget.toggleClass(toggleClass);

      if ($link.hasClass('b-small-collapser__item-header')) {
        $link.closest('.b-small-collapser__item').toggleClass('b-small-collapser__item_collapsed');
      }
      if ($link.hasClass('b-services-contacts__services')) {
        $link.find('.b-services-contacts__services-title').toggleClass('b-services-contacts__services-title_close');
      }

      if (openClass) {
        $link.toggleClass(openClass);
      }
    });
  }

  static overlayBody(type, options) {
    const { mod, preventPosFix } = options;
    let className = mod ? `u-overlay u-overlay_${mod}` : 'u-overlay';

    if ($(document).height() > $(window).height() && !preventPosFix) {
      className = `${className} u-overlay_scroll-fix`;
    }

    switch (type) {
      case 'open':
        $('body').addClass(className);
        break;
      case 'close':
        $('body').removeClass(className);
        $('body').attr('class', $('body').attr('class').replace(/\bu-overlay_\.+\b/g, ''));
        break;
      default:
        $('body').toggleClass(className);
    }
  }

  static initYMap() {
    window.ymapAPIready = false;
    if (typeof window.ymaps !== 'undefined') {
      window.ymaps.ready(() => {
        window.ymapAPIready = true;
        $(document).trigger('ymapAPIready');
      });
    }
  }

  static initCustomScroll() {
    if (!Tools.isTouch()) {
      $('.js-custom-scrolls').each((i, elem) => {
        new PerfectScrollbar(elem, {
          suppressScrollX: true
        });
      });
    }
  }

  static isTouch() {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

    const mq = (query) => {
      return window.matchMedia(query).matches;
    };

    if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
      return true;
    }

    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');

    return mq(query);
  }

  static initFixerFooter() {
    const $footer = $('.b-page__footer');
    const $wrap = $('.b-page__main-wrap');

    const fixFooter = () => {
      const height = $footer.outerHeight(true);
      $wrap.css({
        paddingBottom: height,
        marginBottom: -height,
      });
    };

    fixFooter();

    $(window).on('resize', () => {
      fixFooter();
    });
  }

  static checkReplacers({ currentBreakpoint }) {
    const $replacers = $('.js-replacer');
    $replacers.filter('[data-active]').each((i, elem) => {
      const $replacer = $(elem);
      const points = $replacer.data('points').breakpoints;
      const id = $replacer.data('id');

      if (points.indexOf(currentBreakpoint) !== -1) {
        return;
      }

      const $content = $replacer.children();

      $replacers.filter(`[data-id=${id}]`).each((i, elem) => {
        const $item = $(elem);
        const points = $item.data('points').breakpoints;
        if (points.indexOf(currentBreakpoint) !== -1) {
          $replacer.removeAttr('data-active');
          $item.attr('data-active', 'true');
          $item.append($content);
        }
      });
    });
  }

  static initReplacer() {
    const breakpoints = {
      mobile: [0, 767],
      tablet: [768, 1279],
      desktop_sm: [768, 1279],
      desktop: [1280, Infinity]
    };

    const defineBreakPoint = (breakpoints) => {
      const width = $(window).width();
      for (const point in breakpoints) {
        if (!breakpoints.hasOwnProperty(point)) {
          continue;
        }

        if (width >= breakpoints[point][0] && width <= breakpoints[point][1]) {
          return point;
        }
      }

      return '';
    };

    let currentBreakpoint = defineBreakPoint(breakpoints);

    Tools.checkReplacers({ currentBreakpoint });

    $(window).on('resize', () => {
      const newPoint = defineBreakPoint(breakpoints);
      if (newPoint !== currentBreakpoint) {
        currentBreakpoint = newPoint;
        Tools.checkReplacers({ currentBreakpoint });
      }
    });
  }

  static initMenuToggler() {
    $('body').on('click', '.js-menu-toggler', (e) => {
      $('.b-page__fixed-holder').toggleClass('b-page__fixed-holder_active');
      $('.b-page').toggleClass('b-page_fix-opened');
      $('.b-header').toggleClass('b-header_fix-opened');
    });
  }

  static initScroller() {
    $('body').on('click', '.js-scroll-to-top', (e) => {
      $('html, body').animate({
        scrollTop: 0
      }, 300);
    });
  }
}
