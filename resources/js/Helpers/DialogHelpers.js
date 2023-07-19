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

export default {
    confirm,
    info,
    htmlInfo
};
