import $ from 'jquery';
import { Tools } from './_tools';
import PromoSlider from '../../blocks/project/b-promo-slider/b-promo-slider';
import PlatesSlider from '../../blocks/project/b-plates-slider/b-plates-slider';
import InputSelect from '../../blocks/project/b-input-select/b-input-select';
import AdvList from '../../blocks/project/b-adv-list/b-adv-list';
import AsideMenu from '../../blocks/project/b-aside-menu/b-aside-menu';


Tools.initSvgPolyfill();

$(() => {
  Tools.initSelect2();
  Tools.initCollapser();
  Tools.initCustomScroll();
  Tools.initFixerFooter();
  Tools.initReplacer();
  Tools.initMenuToggler();
  Tools.initScroller();

  PromoSlider.init();
  PlatesSlider.init();
  InputSelect.init();
  AdvList.init();
  AsideMenu.init();
});
