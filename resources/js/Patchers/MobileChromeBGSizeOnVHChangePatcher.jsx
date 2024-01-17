/**
 * Patch to counteract mobile Chrome background image size glitch when the viewport height changes (due to address bar hiding when scrolling).
 * This patch applies a different CSS style, to render the background image differently and scale it up enough to still cover the screen on VH change.
 */
import { setCSSVar } from '@/Helpers/RenderHelpers';

;(() => {
    if(!navigator.userAgent.match(/(Android|iPhone|Mobi|Tablet|TV)/i)) return;
    if(!navigator.userAgent.match(/(CriOS|Chrome|Safari)/i) || !!navigator.userAgent.match(/(Firefox|FxiOS)/i)) return;

    const setPScale = s => setCSSVar("pp-chrome-patch-scale-p", s);
    const setLScale = s => setCSSVar("pp-chrome-patch-scale-l", s);

    var lastPVH = null;
    var lastLVH = null;
    document.addEventListener("resize", () => {
        let newVG = window.innerHeight;
        let isPortrait = newVG > window.innerWidth;
        let lastVH = isPortrait ? lastPVH : lastLVH;
        if(lastVH != null){
            let setScale = isPortrait ? setPScale : setLScale;
            if(lastVH > newVG) setScale(lastVH / newVG);
            else if(newVG > lastVH) setScale(1);
            else return;
        };
        if(isPortrait) lastPVH = newVG;
        else lastLVH = newVG;
    });
    document.body.classList.add("pp-chrome-patch");
})();
