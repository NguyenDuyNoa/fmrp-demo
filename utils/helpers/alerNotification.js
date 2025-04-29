import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

// Thông báo icon đơn giản
const ToatstNotifi = (type, e, time) => {
    Toast.fire({
        icon: `${type}`,
        title: `${e}`,
        timer: time || 3000,
    });
};

// Thông báo card custom, icon React
const ToastCustomCard = (title, description, time) => {

    Swal.fire({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: time || 4000,
        timerProgressBar: true,
        customClass:"popup-custom-recommend",
        showClass:"rounded-3xl",
        html: `
            <div class="flex flex-col">
                <div class="flex items-center gap-0.5">
                    <img 
                    src="/icon/Heart.svg" 
                    class="shrink-0 aspect-1" 
                    style="width: 24px; height: 24px; margin-right: 10px;"  
                    />
                    <div style="font-weight: bold; font-size: 18px; color: #25387A;">${title}</div>
                </div>
                <div>
                    <div class="font-medium" style="font-size: 16px; color: #637381; margin-top: 4px;">${description}</div>
                </div>
            </div>
        `,
    });
};

export { ToastCustomCard };
export default ToatstNotifi;
