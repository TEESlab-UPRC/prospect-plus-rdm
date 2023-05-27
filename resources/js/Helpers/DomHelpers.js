export const setClassStyle = (clazz, callback) => Array.from(document.getElementsByClassName(clazz)).forEach(el => callback(el.style));

export default {
    setClassStyle
};
