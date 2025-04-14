import Image from "next/image";
import React, { useState } from "react";
import ImageAvatar from "./ImageAvatar";
import moment from "moment";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import GalleryModal from "@/components/common/Image/GalleryModal";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { PiThumbsUp, PiThumbsUpFill } from "react-icons/pi";

import { AnimatePresence, motion } from 'framer-motion'

import { usePostLikeComment } from "@/managers/api/productions-order/comment/usePostLikeComment";
import { usePostUnlikeComment } from "@/managers/api/productions-order/comment/usePostUnlikeComment";
import SparklesBurst from "@/components/animations/animation/SparklesBurst";
import AvatarText from "@/components/UI/common/user/AvatarText";

const likeVariants = {
    initial: { scale: 0.8, rotate: 0 },
    animate: { scale: [1.1, 0.95, 1.03, 1], rotate: [0, -5, 5, 0] },
    exit: { scale: 0.8 },
    transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.5
    }
};

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
            const before = text.slice(lastIndex, index);
            parts.push(...splitTextWithBreaks(before));
        }

        parts.push({
            type: 'mention',
            userId,
            userName,
        });

        lastIndex = index + fullMatch.length;
    }

    if (lastIndex < text.length) {
        const rest = text.slice(lastIndex);
        parts.push(...splitTextWithBreaks(rest));
    }

    return parts;
};

const splitTextWithBreaks = (text) => {
    const segments = text.split(/<br\s*\/?>|\n/g);
    const result = [];
    segments.forEach((segment, index) => {
        if (segment) result.push(segment);
        if (index < segments.length - 1) result.push({ type: 'br' });
    });
    return result;
};

const RenderedComment = ({ content }) => {
    const containsMention = /@\{\d+:[^\}]+\}/.test(content || '');

    if (!containsMention) {
        return (
            <div
                className='text-sm-default duration-500 transition ease-in-out line-clamp-2 whitespace-pre-wrap'
                dangerouslySetInnerHTML={{ __html: content ?? '' }}
            />
        );
    }

    const parts = parseCommentContent(content || '');

    return (
        <div className="text-sm-default duration-500 transition ease-in-out whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (typeof part === 'string') return <span key={index}>{part}</span>;
                if (part.type === 'mention') {
                    return (
                        <span
                            key={index}
                            className="text-[#0F4F9E] px-1 rounded font-medium cursor-pointer hover:underline custom-transition"
                            onClick={() => console.log("Tag user ID:", part.userId)}
                        >
                            @{part.userName}
                        </span>
                    );
                }
                if (part.type === 'br') return <br key={index} />;
                return null;
            })}
        </div>
    );
};

const CommentItem = ({ item, currentUser }) => {
    // Thêm state này trong component
    const [showSparkles, setShowSparkles] = useState(false);

    const [galleryOpen, setGalleryOpen] = useState(false);
    const [startIndex, setStartIndex] = useState(0);

    const { onSubmit: onSubmitLikeComment, isLoading: isLoadingLikeComment } = usePostLikeComment()
    const { onSubmit: onSubmitUnlikeComment, isLoading: isLoadingUnlikeComment } = usePostUnlikeComment()

    // files image or video
    const files = item?.files || [];
    // Like logic (giả lập)
    const likes = item?.likes || [];
    const hasLiked = likes?.some((like) => like.user_id === currentUser.id);

    // Khi like → trigger sparkle
    const handleToggleLike = () => {
        if (!hasLiked) {
            setShowSparkles(true);
            setTimeout(() => setShowSparkles(false), 500);
        }
        hasLiked ? onSubmitUnlikeComment(item.id) : onSubmitLikeComment(item.id);
    };

    const renderLikeText = () => {
        if (likes.length == 0) return null;

        if (likes.length <= 2) {
            return (
                <div className="text-[#0375F3] text-xs-default font-medium">
                    {likes.map((like, i) => (
                        <span key={like.id}>
                            {like.full_name}
                            {i < likes.length - 1 && ', '}
                        </span>
                    ))}
                </div>
            );
        }

        return (
            <span className="text-[#0375F3] font-normal text-sm-default">+{likes.length}</span>
        );
    };

    const images = files.map(file => ({
        original: file.file_path || '/icon/default/default.png',
        thumbnail: file.file_path || '/icon/default/default.png',
    }));

    const handleClickImage = (index) => {
        setStartIndex(index);
        setGalleryOpen(true);
    };

    return (
        <React.Fragment>
            <div className="flex items-start gap-3 mb-4">
                <ImageAvatar
                    src={item?.created_by_profile_image}
                    fullName={item?.created_by_full_name}
                    className="w-10 h-10 !min-w-10 !max-w-10 !max-h-10 !min-h-10 rounded-full object-cover shrink-0"
                />


                <div className='flex-1'>
                    {/* Tên + Time */}
                    <div className="">
                        <span className='text-sm-default text-[#141522] font-semibold'>{item.created_by_full_name} </span>
                        <span className='space-x-1'>
                            <span className="text-xs-default text-[#9295A4] font-normal">{moment(item.created_at).format(FORMAT_MOMENT.DD_MM)},</span>
                            <span className="text-xs-default text-[#9295A4] ml-1 font-normal">{moment(item.created_at).format(FORMAT_MOMENT.TIME_24H_SHORT)}</span>
                        </span>
                    </div>

                    {/* Content */}
                    {item.content && (
                        <div className="text-sm-default mt-1">
                            {/* <div
                                className='text-sm-default duration-500 transition ease-in-out line-clamp-2'
                                dangerouslySetInnerHTML={{ __html: `${item?.content ?? ''}` }}
                            /> */}
                            <RenderedComment content={item.content} />
                        </div>
                    )}

                    {/* Image */}
                    {
                        files && files?.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {
                                    files?.slice(0, 3).map((file, index) => {
                                        const isLast = index === 2 && files.length > 3;
                                        return (
                                            <div
                                                key={index}
                                                className="relative cursor-pointer"
                                                onClick={() => handleClickImage(index)}
                                            >
                                                <Image
                                                    src={file.file_path || '/icon/default/default.png'}
                                                    alt={file.file_name}
                                                    width={300}
                                                    height={200}
                                                    className="w-full 3xl:h-[200px] h-[180px] object-cover rounded"
                                                />
                                                {
                                                    isLast && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-title-default font-semibold rounded">
                                                            +{files.length - 2}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        )
                    }

                    {/* Nút like và danh sách người like */}
                    <div className="flex items-center gap-0.5 mt-2">
                        <motion.button
                            onClick={handleToggleLike}
                            whileHover={{
                                rotate: [0, -10, 10, -6, 6, 0],
                                transition: { duration: 0.4, ease: "easeInOut" }
                            }}
                            className={`relative flex items-center justify-center 3xl:size-6 size-5 font-medium ${hasLiked ? "text-[#0375F3]" : "text-[#52575E]"}`}
                        >
                            <div className="relative w-full h-full">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={hasLiked.toString()}
                                        initial={{ scale: 0.3, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.3, opacity: 0.2 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        {hasLiked ? (
                                            <PiThumbsUpFill className="text-[#0375F3]" />
                                        ) : (
                                            <PiThumbsUp />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {showSparkles && <SparklesBurst />}
                        </motion.button>

                        {
                            likes && likes?.length > 0 && (
                                <div className="flex gap-1">
                                    {renderLikeText()}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            {galleryOpen && (
                <GalleryModal
                    images={images}
                    startIndex={startIndex}
                    onClose={() => setGalleryOpen(false)}
                />
            )}
        </React.Fragment>
    );
};

export default CommentItem;