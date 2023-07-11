import Swal from 'sweetalert2'
import { getCSSVar } from './DomHelpers';

export const confirm = (title, message, confirmCallback, cancelCallback = null, finallyCallback = null) => Swal.fire({
    title: title,
    text: message,
    showCancelButton: true,
    reverseButtons: true,
    cancelButtonText: "No",
    confirmButtonText: "Yes",
    confirmButtonColor: getCSSVar("pp-green")
}).then(res => {
    if(res.isConfirmed) confirmCallback();
    else if(cancelCallback) cancelCallback(res.dismiss);
    if(finallyCallback) finallyCallback();
});

export const info = (title, message, callback = null) => Swal.fire({
    title: title,
    text: message,
    confirmButtonColor: getCSSVar("pp-cyan")
}).then(() => callback && callback());

export default {
    confirm,
    info
};
