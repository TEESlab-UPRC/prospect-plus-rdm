import Swal from 'sweetalert2'

export const confirm = (title, message, confirmCallback, cancelCallback = null) => Swal.fire({
    title: title,
    text: message,
    showCancelButton: true,
    reverseButtons: true,
    cancelButtonText: "No",
    confirmButtonText: "Yes"
}).then(res => {
    if(res.isConfirmed) confirmCallback();
    else if(cancelCallback) cancelCallback(res.dismiss);
});

export default {
    confirm
};
