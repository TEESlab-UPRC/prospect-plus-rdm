/**
 * Patch to counteract mobile Firefox bug when using "position: sticky" in css and placing at the bottom (above the address bar).
 * The bug makes the element render at the correct place but actually be (its hitbox included) higher,
 * depending on if the address bar is hidden or not (which changes automatically when scrolling).
 * This patch mimics normal behavior by instead alternating between fixed & relative positioning using JS.
 * Currently only applies to the locale button, since it's the only element using sticky positioning.
 */
import { debounce } from '@/Helpers/RenderHelpers';

;(() => {
    if(!navigator.userAgent.match(/(Android|iPhone|Mobi|Tablet|TV)/i)) return;
    if(!navigator.userAgent.match(/(Firefox|FxiOS)/i) || !!navigator.userAgent.match(/(CriOS|Chrome|Safari)/i)) return;

    var stickyEl = document.getElementById("locale-btn-wrapper");
    var innerEl = stickyEl?.children[0];
    if(!innerEl) return;

    var isInit = false;
    var against, halfRem;
    const initAgainst = () => against = stickyEl.nextSibling ? [stickyEl.nextSibling, "top"] : [stickyEl.parentNode, "bottom"];
    const initHalfRem = () => halfRem = parseFloat(getComputedStyle(document.documentElement).fontSize) / 2;
    const init = () => {
        stickyEl = document.getElementById("locale-btn-wrapper");
        initAgainst();
        initHalfRem();
        isInit = true;
    };

    init();
    document.addEventListener("inertia:navigate", () => {
        init();
        isInit = false;
    });
    document.addEventListener("resize", debounce(initHalfRem, 100));

    function runPatch(){
        if(!isInit) init();
        stickyEl = document.getElementById("locale-btn-wrapper");
        innerEl = stickyEl?.children[0];
        if(against[0].getBoundingClientRect()[against[1]] - halfRem > visualViewport.height){
            stickyEl.style.position = "fixed";
            innerEl.style.bottom = "3rem";
        }else{
            stickyEl.style.position = "relative";
            innerEl.style.bottom = "3.5rem";
        }
    }

    ["scroll", "resize"].forEach(e => document.addEventListener(e, debounce(runPatch, 10)));
    runPatch();
})();
