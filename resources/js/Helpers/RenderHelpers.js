export const postAnimFrame = callback => window.requestAnimationFrame(() => setTimeout(callback, 0));

export const getCSSVar = varName => getComputedStyle(document.body).getPropertyValue(`--${varName}`);

export default {
    postAnimFrame,
    getCSSVar
};
