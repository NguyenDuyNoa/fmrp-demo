import Swal from "sweetalert2";
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});
const ToatstNotifi = (type, e, time) => {
    Toast.fire({
        icon: `${type}`,
        title: `${e}`,
        timer: time || 3000,
    });
};
export default ToatstNotifi;
