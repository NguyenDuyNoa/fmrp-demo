import { useEffect } from "react";
import ReactDOM from "react-dom";
import dynamic from "next/dynamic";
import "react-image-gallery/styles/css/image-gallery.css";

const ReactImageGallery = dynamic(() => import("react-image-gallery"), { ssr: false });

const GalleryModal = ({ images, startIndex = 0, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    // ✅ Custom layout ảnh bên trong modal
    const renderItem = (item) => {
        return (
            <div className="flex justify-center items-center w-full h-screen pb-[200px]">
                <img
                    src={item.original}
                    alt=""
                    className="max-h-full max-w-full object-contain rounded cursor-default"
                />
            </div>
        );
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center">
            <div className="relative w-full max-w-5xl px-4">
                <button
                    className="absolute top-2 right-4 text-white text-3xl z-10 hover:scale-105 custom-transition"
                    onClick={onClose}
                >
                    ×
                </button>
                <ReactImageGallery
                    items={images}
                    startIndex={startIndex}
                    renderItem={renderItem}
                    showThumbnails
                    showPlayButton={false}
                    showFullscreenButton={false}
                />
            </div>
        </div>,
        typeof window !== "undefined" ? document.body : null
    );
};

export default GalleryModal;
