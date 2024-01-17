export const postAnimFrame = callback => window.requestAnimationFrame(() => setTimeout(callback, 0));

export const getCSSVar = varName => getComputedStyle(document.body).getPropertyValue(`--${varName}`);
export const setCSSVar = (varName, val) => document.documentElement.style.setProperty(`--${varName}`, val);

export const getTextWidth = (text, fontSize, fontFamily, fontWeight = "", fontStyle = "", fontVariant = "") => {
    if(!isNaN(fontSize)) fontSize += "px";  // if number, assume px
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`.trim();
    return ctx.measureText(text).width;
};

export const num2Letter = n => (n + 9).toString(36);

export const debounce = (callback, delay) => {
    let debounceTimeout;
    return () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(callback, delay);
    };
}

export default {
    postAnimFrame,
    getCSSVar,
    setCSSVar,
    getTextWidth,
    num2Letter,
    debounce
};
