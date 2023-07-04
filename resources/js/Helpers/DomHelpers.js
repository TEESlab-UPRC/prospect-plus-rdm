export const setClassStyle = (clazz, callback) => Array.from(document.getElementsByClassName(clazz)).forEach(el => callback(el.style));

export const onPageLoad = callback => { // page load hook - likely desired usage: useEffect(() => onPageLoad(your_callback), []);
    if(document.readyState === 'complete') callback();
        else{
        window.addEventListener('load', callback, false);
        return () => window.removeEventListener('load', callback);    // remove listener on component unmount
    }
};

export const setFormInputVal = (form, key, val) => {
    const input = form.elements[key];
    switch(input.type) {
        case 'checkbox': input.checked = !!val; break;
        default:         input.value = val;
    }
};

export const setFormData = (form, data) => data && Object.entries(data).map(e => {
    if(e[1]) return e;
    const type = form.elements[e[0]].type;
    return [e[0], (type == 'select-one' ? 'N/A' : (type == 'checkbox' ? false : ''))];
}).forEach(e => setFormInputVal(form, e[0], e[1]));

export const getFormData = form => Object.fromEntries(Array.from(new FormData(form).entries()).map(e => e[1] == 'N/A' ? [e[0], null] : e));

export const centerTo = el => el ? el.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center"
}) : false;

export const getCSSVar = varName => getComputedStyle(document.body).getPropertyValue(`--${varName}`);

export default {
    setClassStyle,
    onPageLoad,
    setFormInputVal,
    setFormData,
    getFormData,
    centerTo,
    getCSSVar
};
