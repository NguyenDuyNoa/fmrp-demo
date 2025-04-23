import SparklesBurst from "@/components/animations/animation/SparklesBurst";
import GalleryModal from "@/components/common/Image/GalleryModal";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useToast from "@/hooks/useToast";
import { useDeleteComment } from "@/managers/api/productions-order/comment/useDeleteComment";
import { usePostLikeComment } from "@/managers/api/productions-order/comment/usePostLikeComment";
import { usePostUnlikeComment } from "@/managers/api/productions-order/comment/usePostUnlikeComment";
import { AnimatePresence, motion } from 'framer-motion';
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { PiCopy, PiDotsThreeVerticalBold, PiThumbsUp, PiThumbsUpFill, PiTrash } from "react-icons/pi";
import { useSelector } from "react-redux";
import ImageAvatar from "./ImageAvatar";

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

const MAX_WORDS = 60;

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
    const [showFull, setShowFull] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [collapsedHeight, setCollapsedHeight] = useState(0);
    const contentRef = useRef(null);

    const containsMention = /@\{\d+:[^\}]+\}/.test(content || '');
    const parts = containsMention
        ? parseCommentContent(content || '')
        : splitTextWithBreaks(content || '');

    const renderParts = (list) =>
        list.map((part, index) => {
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
        });

    useEffect(() => {
        if (!contentRef.current) return;
        const computed = window.getComputedStyle(contentRef.current);
        const lineHeight = parseFloat(computed.lineHeight || "20");
        const maxHeight = lineHeight * 3;
        setCollapsedHeight(maxHeight);

        if (contentRef.current.scrollHeight > maxHeight) {
            setIsOverflowing(true);
        } else {
            setIsOverflowing(false);
        }
    }, [content]);

    return (
        <div className="relative text-sm-default whitespace-pre-wrap">
            {isOverflowing ? (
                <motion.div
                    animate={{ height: showFull ? "auto" : collapsedHeight, opacity: 1 }}
                    initial={false}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div ref={contentRef}>
                        {renderParts(parts)}
                    </div>
                </motion.div>
            ) : (
                <div ref={contentRef}>
                    {renderParts(parts)}
                </div>
            )}


            {isOverflowing && (
                <button
                    onClick={() => setShowFull(prev => !prev)}
                    className="text-sm-default text-[#0F4F9E] mt-1 font-medium hover:underline"
                >
                    {showFull ? "Ẩn bớt" : "Xem thêm"}
                </button>
            )}
        </div>
    );
};

const CommentItem = ({ item, currentUser, onCommentDeleted }) => {
    // Thêm state này trong component
    const [showSparkles, setShowSparkles] = useState(false);

    const [galleryOpen, setGalleryOpen] = useState(false);
    const [startIndex, setStartIndex] = useState(0);

    const [loadingImages, setLoadingImages] = useState({});

    const { onSubmit: onSubmitLikeComment, isLoading: isLoadingLikeComment } = usePostLikeComment()
    const { onSubmit: onSubmitUnlikeComment, isLoading: isLoadingUnlikeComment } = usePostUnlikeComment()
    const { deleteComment, isLoading: isLoadingDeleteComment } = useDeleteComment();
    const auth = useSelector((state) => state.auth);

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
                <div className="text-[#0375F3] text-sm-default font-medium">
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

    const showToat = useToast();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    
    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleCopy = () => {
        if (item.content) {
            // Xóa hoàn toàn tất cả các tag người dùng @{id:name}
            const cleanContent = item.content.replace(/@\{(\d+):([^\}]+)\}/g, '');
            
            navigator.clipboard.writeText(cleanContent);
            setShowDropdown(false);
            showToat("success", `Đã sao chép nội dung!`);
        }
    };

    const handleDelete = () => {
        if (item.id) {
            deleteComment(item.id);
            setShowDropdown(false);
            if (typeof onCommentDeleted === 'function') {
                onCommentDeleted(item.id);
            }
        }
    };

    return (
        <React.Fragment>
            <div className="flex items-start gap-3 group relative hover:bg-primary-07 p-3 rounded-xl">
                <ImageAvatar
                    src={item?.created_by_profile_image}
                    fullName={item?.created_by_full_name}
                    className="3xl:w-10 3xl:h-10 3xl:!min-w-10 3xl:!max-w-10 3xl:!max-h-10 3xl:!min-h-10 w-8 h-8 !min-w-8 !max-w-8 !max-h-8 !min-h-8 rounded-full object-cover shrink-0"
                />


                <div className='flex-1'>
                    {/* Tên + Time */}
                    <div className="flex justify-between items-center">
                        <div>
                            <span className='text-sm-default text-[#141522] font-semibold'>{item.created_by_full_name} </span>
                            <span className='space-x-1'>
                                <span className="text-xs-default text-[#9295A4] font-normal">{moment(item.created_at).format(FORMAT_MOMENT.DD_MM)},</span>
                                <span className="text-xs-default text-[#9295A4] ml-1 font-normal">{moment(item.created_at).format(FORMAT_MOMENT.TIME_24H_SHORT)}</span>
                            </span>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <div 
                                className={`p-1 cursor-pointer ${showDropdown ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300 ease-in-out`}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <PiDotsThreeVerticalBold />
                            </div>

                            {showDropdown && (
                                <div className="absolute w-[170px] right-0 z-10 bg-white rounded-xl p-1 shadow-[0px_20px_40px_-4px_rgba(0,0,0,0.24),0px_0px_2px_0px_rgba(145,158,171,0.20)] flex flex-col gap-1">
                                    <button 
                                        className="flex w-full rounded-lg items-center gap-2 px-1.5 py-2 hover:bg-primary-05 transition-colors text-neutral-03 hover:text-neutral-07"
                                        onClick={handleCopy}
                                    >
                                        <PiCopy className="size-5" />
                                        <span className="text-sm font-normal">Sao chép</span>
                                    </button>
                                   {auth.staff_id === item.user_id && (
                                        <button 
                                            className="flex w-full rounded-lg items-center gap-2 px-1.5 py-2 hover:bg-primary-05 transition-colors text-neutral-03 hover:text-neutral-07"
                                            onClick={handleDelete}
                                        >
                                            <PiTrash className="size-5" />
                                            <span className="text-sm font-normal">Xóa bình luận</span>
                                        </button>
                                   )}
                                </div>
                            )}
                        </div>
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
                                        const isImageLoading = loadingImages[index] !== false;

                                        return (
                                            <div
                                                key={index}
                                                className="relative cursor-pointer group"
                                                onClick={() => handleClickImage(index)}
                                            >
                                                {/* Layer blur overlay khi đang loading */}
                                                {isImageLoading && (
                                                    <div className="absolute inset-0 bg-[#f2f2f2] animate-pulse rounded z-10" />
                                                )}

                                                <Image
                                                    src={file.file_path || '/icon/default/default.png'}
                                                    alt={file.file_name}
                                                    width={300}
                                                    height={200}
                                                    // className="w-full 3xl:h-[200px] h-[180px] object-cover rounded"
                                                    className={`w-full 3xl:h-[200px] h-[180px] object-cover rounded transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                                                    onLoadingComplete={() =>
                                                        setLoadingImages((prev) => ({ ...prev, [index]: false }))
                                                    }
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
                                <AnimatePresence initial={false}>
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