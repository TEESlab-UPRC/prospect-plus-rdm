import Swal from 'sweetalert2'

export const confirm = (title, message, confirmCallback, cancelCallback = null, finallyCallback = null) => Swal.fire({
    title: title,
    text: message,
    showCancelButton: true,
    reverseButtons: true,
    cancelButtonText: "No",
    confirmButtonText: "Yes",
    confirmButtonColor: "#00883B"   // from pallet, check CSS vars before changing
}).then(res => {
    if(res.isConfirmed) confirmCallback();
    else if(cancelCallback) cancelCallback(res.dismiss);
    if(finallyCallback) finallyCallback();
});

export default {
    confirm
};
