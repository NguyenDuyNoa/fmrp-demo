import { useState, useEffect } from "react";
import Image from "next/image";
import { FaUpRightAndDownLeftFromCenter } from "react-icons/fa6";
import { FaAngleDoubleRight } from "react-icons/fa";

const ModalFilter = ({ isState, queryState }) => {
    const [width, setWidth] = useState(900);
    const [isResizing, setIsResizing] = useState(false);
    const [initialX, setInitialX] = useState(null);
    const [initialWidth, setInitialWidth] = useState(null);
    const minWidth = 500; // Đặt giá trị chiều rộng tối thiểu
    const maxWidth = window.innerWidth; // Đặt giá trị chiều rộng tối đa

    useEffect(() => {
        const handleResize = (event) => {
            if (isResizing) {
                const newWidth = initialWidth + (initialX - event.clientX);
                // Đảm bảo rằng chiều rộng không thể nhỏ hơn giá trị tối thiểu và lớn hơn giá trị tối đa
                setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
            }
        };

        const stopResize = () => {
            setIsResizing(false);
            document.body.classList.remove("no-select");
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleResize);
            document.addEventListener("mouseup", stopResize);
        }

        return () => {
            document.removeEventListener("mousemove", handleResize);
            document.removeEventListener("mouseup", stopResize);
        };
    }, [isResizing, initialWidth, initialX, minWidth, maxWidth]);

    const startResize = (event) => {
        setIsResizing(true);
        setInitialX(event.clientX);
        setInitialWidth(width);
        document.body.classList.add("no-select");
    };

    return (
        <div
            style={{
                width: width,
                height: `calc(100vh - ${68}px)`,
                transform: isState.openModal ? "translateX(0%)" : "translateX(100%)",
                maxWidth: '100vw',
            }}
            className={`bg-[#FFFFFF] absolute top-[9.2%] right-0 shadow-md z-[999] transition-all duration-150 ease-linear`}
        >
            <div className="px-6">
                <div className="border-b border-gray-300 flex justify-between py-4">
                    <div className="flex items-center gap-2">
                        <FaAngleDoubleRight className="text-gray-600 text-sm cursor-pointer" onClick={() => setWidth(900)} />
                        <FaUpRightAndDownLeftFromCenter className="text-gray-600 text-sm cursor-pointer rotate-90" onClick={() => setWidth(window.innerWidth)} />
                        <h1 className="text-[#0284c7]">Chi tiết lệnh sản xuất</h1>
                    </div>
                    <button
                        onClick={() => {
                            queryState({ openModal: !isState.openModal });
                            setWidth(900);
                        }}
                        type="button"
                        className="w-[20px] h-[20px] hover:animate-spin transition-all duration-300 ease-linear"
                    >
                        <Image
                            alt=""
                            src={"/manufacture/x.png"}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                        />
                    </button>
                </div>
            </div>
            <div
                className="absolute bg-transparent top-0 left-0 w-[20px] h-full cursor-col-resize"
                onMouseDown={startResize}
            />
        </div>
    );
};

export default ModalFilter;
