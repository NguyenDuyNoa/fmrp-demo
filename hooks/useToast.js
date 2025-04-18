import Swal from "sweetalert2";
import "animate.css";
import SuccessAlertIcon from "@/components/icons/common/SuccessAlertIcon";
import ErrorAlertIcon from "@/components/icons/common/ErrorAlertIcon";
import ReactDOMServer from "react-dom/server";

const useToast = () => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        // timer: 1000,
        // timerProgressBar: true,
        showClass: {
            popup: "animate__zoomIn faster",
        },
        hideClass: {
            popup: "animate__zoomOut faster",
        },
    });

    const showToast = (type, message, time) => {
        Toast.fire({
            icon: type,
            title: message,
            timer: time || 1500,
            iconHtml:
                type === "success"
                    ? ReactDOMServer.renderToStaticMarkup(<SuccessAlertIcon />)
                    : ReactDOMServer.renderToStaticMarkup(<ErrorAlertIcon />),
            customClass: {
                popup: `custom-toast-popup custom-toast-popup-${type}`,
                title: `custom-toast-title-${type} custom-toast-title`,
                icon: "custom-toast-icon",
                closeButton: `custom-toast-close-button-${type} custom-toast-close-button`
            },
            showCloseButton: true,
        });
    };

    return showToast;
};

export default useToast;
