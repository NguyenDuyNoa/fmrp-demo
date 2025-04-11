import AvatarText from "@/components/UI/common/user/AvatarText";
import { useRef, useState } from "react";

const ImageAvatar = ({ src, alt = "avatar", className = "", fullName = "" }) => {
    const imgRef = useRef(null);

    const [hasError, setHasError] = useState(false);

    const handleError = () => {
        setHasError(true);
    };

    if (hasError || !src) {
        return (
            <AvatarText
                fullName={fullName}
                className={className}
            />
        );
    }


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
