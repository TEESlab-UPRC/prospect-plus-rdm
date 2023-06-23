import { useEffect } from "react";

export const setClassStyle = (clazz, callback) => Array.from(document.getElementsByClassName(clazz)).forEach(el => callback(el.style));

export const onPageLoad = callback => { // page load hook for react
    useEffect(() => {
        if(document.readyState === 'complete') callback();
        else{
            window.addEventListener('load', callback, false);
            return () => window.removeEventListener('load', callback);    // remove listener on component unmount
        }
    }, []);
};

export const setFormInputVal = (form, key, val) => {
    const input = form.elements[key];
    switch(input.type) {
        case 'checkbox': input.checked = !!val; break;
        default:         input.value = val;
    }
};

export const setFormData = (form, data) => Object.entries(data).map(e => e[1] ? e : [e[0], 'N/A']).forEach(e => setFormInputVal(form, e[0], e[1]));

export const getFormData = form => Object.fromEntries(Array.from(new FormData(form).entries()).map(e => e[1] == 'N/A' ? [e[0], null] : e));

export default {
    setClassStyle,
    onPageLoad,
    setFormInputVal,
    setFormData,
    getFormData
};
