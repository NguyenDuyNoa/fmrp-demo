import { useRef } from "react";

const ImageAvatar = ({ src, alt = "avatar", className = "" }) => {
    const imgRef = useRef(null);

    const handleError = () => {
        if (imgRef.current) {
            imgRef.current.src = "/icon/default/default.png";
        }
    };

    return (
        <img
            ref={imgRef}
            src={src ?? "/icon/default/default.png"}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

export default ImageAvatar;
