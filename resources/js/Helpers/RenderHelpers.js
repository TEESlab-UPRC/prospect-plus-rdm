export const postAnimFrame = callback => window.requestAnimationFrame(() => setTimeout(callback, 0));

export const getCSSVar = varName => getComputedStyle(document.body).getPropertyValue(`--${varName}`);

export const getTextWidth = (text, fontSize, fontFamily, fontWeight = "", fontStyle = "", fontVariant = "") => {
    if(!isNaN(fontSize)) fontSize += "px";  // if number, assume px
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`.trim();
    return ctx.measureText(text).width;
};

export default {
    postAnimFrame,
    getCSSVar,
    getTextWidth
};
