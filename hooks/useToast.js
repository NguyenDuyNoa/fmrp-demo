import Swal from "sweetalert2";
const useToast = () => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
    });

    const showToast = (type, message, time) => {
        Toast.fire({
            icon: type,
            title: message,
            timer: time || 3000,
        });
    };

    return showToast;
};

export default useToast;
