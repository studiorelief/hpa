import './index.css';

import { disableButtonIfRequired, disabledTabInForm, signUpLoad } from '$utils/campingDatabase';
import { mirrorPopupInfo } from '$utils/dashboard';
import { decorativeAnim } from '$utils/gsap';
import { swipeElement } from '$utils/jquery';
import { loadScript } from '$utils/loadScript';
import {
  confirmPasswordInput,
  displayCurrentMemberData,
  passwordValidation,
  redirectIfNotOnValidatedPlan,
  redirectNotLog,
  showHidePassword,
} from '$utils/memberstack';
import { swiperHome, swiperMember } from '$utils/swiper';

window.Webflow ||= [];
window.Webflow.push(() => {
  // Load scripts
  Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-inputactive@1/inputactive.js'),
    loadScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-combobox@1/combobox.js'),
    loadScript('https://cdn.jsdelivr.net/npm/@finsweet/attributes-selectcustom@1/selectcustom.js'),
  ]);

  swipeElement();

  /**
   * * Call Memberstack Function
   * TODO : Check Air Picker : https://air-datepicker.com/examples
   */

  /**
   * ! Signup
   */
  if (window.location.pathname.includes('/inscription')) {
    confirmPasswordInput();
    passwordValidation();
    signUpLoad();
    disabledTabInForm();
    disableButtonIfRequired();
  }

  showHidePassword();

  /**
   * ! Dashboard
   */
  mirrorPopupInfo();
  displayCurrentMemberData();

  /**
   * ! Others
   */
  swiperMember();
  swiperHome();

  redirectNotLog();
  redirectIfNotOnValidatedPlan();
  decorativeAnim();
});
