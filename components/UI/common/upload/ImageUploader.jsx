import useToast from "@/hooks/useToast";
import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";


export const FILE_IMAGES = ["image/png", "image/jpeg", 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']

const ImageUploader = ({ onChange, maxFiles = 5, acceptedFormats = FILE_IMAGES, maxSizeMB = 2, classNameReview, dataLang }) => {
    const isShow = useToast();
    const [selectedImages, setSelectedImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    // Xử lý thêm file (chỉ nhận file hợp lệ)
    const handleFiles = (files) => {
        const newFiles = Array.from(files);
        let error = "";

        // Kiểm tra tổng số file
        if (selectedImages.length + newFiles.length > maxFiles) {
            isShow('error', `${dataLang?.image_up_loader_max_files ?? "image_up_loader_max_files"} ${maxFiles} ${dataLang?.image_up_loader_images ?? "image_up_loader_images"}.`);
            return;
        }

        const validImages = newFiles.filter(file => {
            const isValidType = acceptedFormats.includes(file.type);
            const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
            const isDuplicate = selectedImages.some(img => img.file.name === file.name);

            if (!isValidType) {
                isShow('error', `${dataLang?.image_up_loader_accept_formats ?? "image_up_loader_accept_formats"}: ${acceptedFormats.join(", ")}.`);
                return false;
            }
            if (!isValidSize) {
                isShow('error', `File "${file.name}" ${dataLang?.image_up_loader_exceed_size ?? "image_up_loader_exceed_size"} ${maxSizeMB}MB.`);
                return false;
            }
            if (isDuplicate) {
                isShow('error', `File "${file.name}" ${dataLang?.image_up_loader_already_exists ?? "image_up_loader_already_exists"}.`);
                return false;
            }

            return true;
        });

        // Nếu không có file hợp lệ, không thực hiện xử lý
        if (validImages.length === 0) return;

        const imagePreviews = validImages.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        const updatedImages = [...selectedImages, ...imagePreviews];
        setSelectedImages(updatedImages);
        onChange(updatedImages.map(img => img.file)); // Trả về danh sách file hợp lệ
    };

    // Xử lý chọn file từ input
    const handleFileChange = (e) => {
        handleFiles(e.target.files);
    };

    // Xử lý kéo & thả file
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    // Xóa ảnh
    const handleRemoveImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
        onChange(updatedImages.map(img => img.file)); // Cập nhật danh sách file
    };

    return (
        <div>
            {/* Box Drag & Drop */}
            <div
                className={`relative border border-dashed p-6 rounded-md flex flex-col items-center justify-center cursor-pointer ${isDragging ? "bg-gray-100 border-blue-500" : ""
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept={acceptedFormats.join(",")}
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                />
                <div className="flex flex-col items-center text-gray-500">
                    <FiUpload className="w-6 h-6" />
                    <span className="text-xs">{dataLang?.image_up_loader_drag_drop ?? "image_up_loader_drag_drop"}</span>
                </div>
            </div>

            {/* Hiển thị thông báo lỗi */}
            {errorMessage && <p className="mt-2 text-xs text-red-500">{errorMessage}</p>}

            {/* Danh sách ảnh đã chọn */}
            {selectedImages.length > 0 && (
                <div className={`${classNameReview ? classNameReview : "grid grid-cols-5"}  gap-2 mt-3`}>
                    {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                            <img src={image.preview} alt="Preview" className="object-cover w-full h-24 rounded-md" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -right-1 p-0.5 text-xs text-white bg-red-500 border-white border-2 rounded-full -top-2 hover:bg-red-600"
                            >
                                <IoIosClose className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
