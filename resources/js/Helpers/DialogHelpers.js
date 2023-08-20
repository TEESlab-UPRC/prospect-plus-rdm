import Swal from 'sweetalert2'
import { getCSSVar } from './RenderHelpers';

const t = (transFunc, key) => transFunc ? transFunc(key) : key;

export const confirm = (title, message, confirmCallback, cancelCallback = null, finallyCallback = null, transFunc = null, width = null, htmlMsg = null) => Swal.fire(Object.assign(
    {
        title: title,
        width: width ?? "32rem",
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonText: t(transFunc, "No"),
        confirmButtonText: t(transFunc, "Yes"),
        confirmButtonColor: getCSSVar("pp-green")
    },
    message == null ? {html: htmlMsg} : {text: message}
)).then(res => {
    if(res.isConfirmed) confirmCallback();
    else if(cancelCallback) cancelCallback(res.dismiss);
    if(finallyCallback) finallyCallback();
});

export const info = (title, message, callback = null, transFunc = null, width = null, htmlMsg = null) => Swal.fire(Object.assign(
    {
        title: title,
        width: width ?? "32rem",
        confirmButtonText: t(transFunc, "OK"),
        confirmButtonColor: getCSSVar("pp-cyan")
    },
    message == null ? {html: htmlMsg} : {text: message}
)).then(() => callback && callback());

export const htmlInfo = (title, htmlMsg, callback = null, transFunc = null, width = null) => info(title, null, callback, transFunc, width, htmlMsg);

export const select = (title, message, options, initVal, submitCallback, cancelCallback = null, finallyCallback = null, openCallbback = null, transFunc = null, width = null) => Swal.fire({
    title: title,
    text: message,
    width: width ?? "32rem",
    showCancelButton: true,
    reverseButtons: true,
    cancelButtonText: t(transFunc, "Cancel"),
    confirmButtonText: t(transFunc, "Select"),
    confirmButtonColor: getCSSVar("pp-cyan"),
    input: "select",
    inputOptions: options,
    inputValue: initVal,
    didOpen: openCallbback,
}).then(res => {
    if(res.isConfirmed) submitCallback(res.value, initVal);
    else if(cancelCallback) cancelCallback(res.value, initVal, res.dismiss);
    if(finallyCallback) finallyCallback(res.value, initVal);
});

export default {
    confirm,
    info,
    htmlInfo,
    select
};
