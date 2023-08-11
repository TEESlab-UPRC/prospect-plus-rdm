import Swal from 'sweetalert2'
import { getCSSVar } from './DomHelpers';

export const confirm = (title, message, confirmCallback, cancelCallback = null, finallyCallback = null, width = null, htmlMsg = null) => Swal.fire(Object.assign(
    {
        title: title,
        width: width ?? "32rem",
        showCancelButton: true,
        reverseButtons: true,
        cancelButtonText: "No",
        confirmButtonText: "Yes",
        confirmButtonColor: getCSSVar("pp-green")
    },
    message == null ? {html: htmlMsg} : {text: message}
)).then(res => {
    if(res.isConfirmed) confirmCallback();
    else if(cancelCallback) cancelCallback(res.dismiss);
    if(finallyCallback) finallyCallback();
});

export const info = (title, message, callback = null, width = null, htmlMsg = null) => Swal.fire(Object.assign(
    {
        title: title,
        width: width ?? "32rem",
        confirmButtonColor: getCSSVar("pp-cyan")
    },
    message == null ? {html: htmlMsg} : {text: message}
)).then(() => callback && callback());

export const htmlInfo = (title, htmlMsg, callback = null, width = null) => info(title, null, callback, width, htmlMsg);

export const select = (title, message, options, initVal, submitCallback, cancelCallback = null, finallyCallback = null, openCallbback = null, width = null) => Swal.fire({
    title: title,
    text: message,
    width: width ?? "32rem",
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonColor: getCSSVar("pp-cyan"),
    input: "select",
    inputOptions: options,
    inputValue: initVal,
    didOpen: openCallbback,
}).then(res => {
    if(res.isConfirmed) submitCallback(res.value);
    else if(cancelCallback) cancelCallback(res.dismiss);
    if(finallyCallback) finallyCallback();
});

export default {
    confirm,
    info,
    htmlInfo,
    select
};
