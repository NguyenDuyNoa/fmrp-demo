import React, { useState } from "react";

const ImageErrors = ({ src, defaultSrc, alt, className, width, height }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div>
      {imageError ? (
        // Hiển thị ảnh mặc định nếu ảnh gốc gặp lỗi
        <img
          width={width}
          height={height}
          className={className}
          src={defaultSrc}
          alt={alt}
        />
      ) : (
        // Hiển thị ảnh gốc nếu không có lỗi
        <img
          className={className}
          width={width}
          height={height}
          src={src}
          alt={alt}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default ImageErrors;
