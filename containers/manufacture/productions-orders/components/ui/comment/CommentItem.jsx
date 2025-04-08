import Image from "next/image";
import { useState } from "react";
import ImageAvatar from "./ImageAvatar";
import moment from "moment";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import GalleryModal from "@/components/common/Image/GalleryModal";

// 👉 Hàm xử lý nội dung tag
const parseCommentContent = (text) => {
    const regex = /@\{(\d+):([^\}]+)\}/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const [fullMatch, userId, userName] = match;
        const index = match.index;

        if (lastIndex < index) {
            parts.push(text.slice(lastIndex, index));
        }

        parts.push({
            type: 'mention',
            userId,
            userName,
        });

        lastIndex = index + fullMatch.length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
};

const RenderedComment = ({ content }) => {
    const parts = parseCommentContent(content || '');

    return (
        <span className="flex flex-wrap gap-x-1 gap-y-0.5">
            {parts.map((part, index) =>
                typeof part === "string" ? (
                    <span key={index}>{part}</span>
                ) : (
                    <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-1 rounded font-medium cursor-pointer hover:underline"
                        onClick={() => console.log("Tag user ID:", part.userId)}
                    >
                        @{part.userName}
                    </span>
                )
            )}
        </span>
    );
};

const CommentItem = ({ item }) => {
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [startIndex, setStartIndex] = useState(0);

    const files = item?.files || [];

    const images = files.map(file => ({
        original: file.file_path || '/icon/default/default.png',
        thumbnail: file.file_path || '/icon/default/default.png',
    }));

    const handleClickImage = (index) => {
        setStartIndex(index);
        setGalleryOpen(true);
    };

    return (
        <>
            <div className="flex items-start gap-3 mb-4">
                <ImageAvatar
                    src={item?.created_by_profile_image}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <div className="text-sm font-semibold">
                        <span className='text-[#141522]'>{item.created_by_full_name} </span>
                        <span className='space-x-1'>
                            <span className="text-xs-default text-[#9295A4]">{moment(item.created_at).format(FORMAT_MOMENT.DD_MM)}</span>
                            <span className="text-xs-default text-[#9295A4] ml-1">{moment(item.created_at).format(FORMAT_MOMENT.TIME_24H_SHORT)}</span>
                        </span>
                    </div>

                    {item.content && (
                        <div className="text-sm mt-1">
                            <RenderedComment content={item.content} />
                        </div>
                    )}

                    {files.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {files.slice(0, 3).map((file, index) => {
                                const isLast = index === 2 && files.length > 3;
                                return (
                                    <div
                                        key={index}
                                        className="relative cursor-pointer"
                                        onClick={() => handleClickImage(index)}
                                    >
                                        <img
                                            src={file.file_path || '/icon/default/default.png'}
                                            alt={file.file_name}
                                            className="w-full h-[120px] object-cover rounded"
                                        />
                                        {isLast && (
                                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-semibold rounded">
                                                +{files.length - 2}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {galleryOpen && (
                <GalleryModal
                    images={images}
                    startIndex={startIndex}
                    onClose={() => setGalleryOpen(false)}
                />
            )}
        </>
    );
};

export default CommentItem;
