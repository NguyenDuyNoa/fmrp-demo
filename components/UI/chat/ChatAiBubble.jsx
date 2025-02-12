
import { usePostGenerateTextBom } from "@/hooks/ai/useGenerateTextBom";
import { useGetTypeOpenAi } from "@/hooks/ai/useGetTypeOpenAi";
import useToast from "@/hooks/useToast";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosClose, IoIosResize } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";
import { Customscrollbar } from "../common/Customscrollbar";
import LoadingButton from "../loading/loadingButton";
import TableBom from "./components/TableBom";
import { debounce } from "lodash";

export default function ChatBubbleAI(props) {
    const initialState = {
        position: { x: window.innerWidth - 80, y: window.innerHeight - 140 },
        dragging: false,
        offset: { x: 0, y: 0 },
        headerHeight: null,
        boxMessageHeight: null,
        localContent: ""
    }
    const { dataLang } = props

    const maxTextLength = 150

    const isShow = useToast()

    const dispatch = useDispatch();

    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);

    const chatRef = useRef(null);

    const textareaRef = useRef(null);

    const headerRef = useRef(null);

    const boxMessageRef = useRef(null);

    const [isState, sIsState] = useState(initialState)

    const queryKeyIsState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    const { data: dataType = [], isLoading: isLoadingDataType } = useGetTypeOpenAi()

    const { onSubmit: submitGenerateTextBom, isLoading: isLoadingGenerateText } = usePostGenerateTextBom()

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isState.dragging) return;
            queryKeyIsState({ position: { x: e.clientX - isState.offset.x, y: e.clientY - isState.offset.y } });
        };

        const handleMouseUp = () => queryKeyIsState({ dragging: false });
        if (isState.dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isState.dragging, isState.offset]);

    const updateHeight = () => {
        if (!stateBoxChatAi.openViewModal) return
        if (headerRef.current) {
            queryKeyIsState({ headerHeight: headerRef.current.clientHeight })
        }
        if (boxMessageRef.current) {
            queryKeyIsState({ boxMessageHeight: boxMessageRef.current.clientHeight })
        }
    }
    useEffect(() => {
        updateHeight()

    }, [stateBoxChatAi.openViewModal]);


    const sendMessage = async () => {
        if (!stateBoxChatAi.typeChat?.id) {
            isShow('error', 'Vui lòng chọn danh mục')
            return;
        }
        if (!stateBoxChatAi.contentChat.trim()) {
            isShow('error', 'Vui lòng nhập dữ liệu')
            return;
        }


        const objectSubmit = {
            "BOM": {
                onSubmit: async (data) => {
                    return await submitGenerateTextBom(data)
                }
            }
        }

        const res = await objectSubmit[stateBoxChatAi.typeChat?.id].onSubmit({
            content: stateBoxChatAi.contentChat,
            typeChat: stateBoxChatAi.typeChat?.id
        })

        const dataChat = [
            {
                text: stateBoxChatAi.contentChat,
                sender: "user"
            },
            {
                text: res?.data?.content ?? 'Không có dữ liệu tìm thấy',
                sender: "ai"
            }
        ]

        dispatch({
            type: "stateBoxChatAi", payload: {
                ...stateBoxChatAi,
                messenger: [...stateBoxChatAi.messenger, ...dataChat],
                contentChat: "",
                dataReview: res?.data
            }
        })
        console.log("res", res);


    };

    useEffect(() => {
        queryKeyIsState({ localContent: stateBoxChatAi.contentChat })
    }, [stateBoxChatAi.contentChat]);

    const debouncedDispatch = useCallback(
        debounce((value) => {
            dispatch({
                type: "stateBoxChatAi",
                payload: { ...stateBoxChatAi, contentChat: value },
            });
        }, 300),
        [stateBoxChatAi]
    );

    // Cleanup debounce khi component unmount để tránh memory leak
    useEffect(() => {
        return () => {
            debouncedDispatch.cancel();
        };
    }, [debouncedDispatch]);

    const handleChange = (e) => {
        const value = e.target.value;
        queryKeyIsState({ localContent: value })
        debouncedDispatch(value);
        adjustHeight()
        updateHeight()
    };

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "40px";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };


    return (
        <div
            ref={chatRef}
            className={`fixed z-[9999] ${stateBoxChatAi.openViewModal ? "cursor-default" : "cursor-grab "}`}
            style={{ left: `${isState.position.x}px`, top: `${isState.position.y}px` }}
            onMouseDown={(e) => {
                if (stateBoxChatAi.openViewModal) return
                queryKeyIsState({
                    dragging: true,
                    offset: { x: e.clientX - isState.position.x, y: e.clientY - isState.position.y }
                });
            }}
        >
            <div className="relative">
                <Popup
                    trigger={
                        <button
                            onClick={() => dispatch({
                                type: "stateBoxChatAi",
                                payload: {
                                    ...stateBoxChatAi,
                                    open: !stateBoxChatAi.open,
                                    openViewModal: false
                                }
                            })}
                            className="p-3 text-white transition-transform transform rounded-full group animate-bounce"
                        >
                            <Image
                                width={1280}
                                height={1024}
                                src="/ai/icon.png"
                                draggable={false}
                                className='object-contain  rounded-full pointer-events-none select-none h-[48px] w-[48px] group-hover:scale-125 transition-transform duration-200 ease-linear'
                            />
                        </button>
                    }
                    on={['hover', 'focus']}
                    position="left center"
                    closeOnDocumentClick
                >
                    {
                        !isState.dragging && (
                            <span className="p-2 text-gray-600 bg-white border rounded-lg shadow ">
                                {`${stateBoxChatAi.open ? "Click to close AI assistant - FMRP" : "Click to open AI assistant - FMRP"}`}
                            </span>
                        )
                    }
                </Popup>
                <div className={`${stateBoxChatAi.openViewModal ? "w-[100vw] -right-2 h-screen px-4" : "w-96 max-w-md right-4 p-4"} absolute bottom-full   border rounded-xl shadow-lg bg-white flex flex-col gap-2 transition-all duration-300 ease-in-out transform
                    ${stateBoxChatAi.open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-5 pointer-events-none"}`}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div ref={headerRef} className={`relative flex items-center justify-between ${stateBoxChatAi.openViewModal ? "pt-4" : "cursor-grab"} `}
                        onMouseDown={(e) => {
                            if (stateBoxChatAi.openViewModal) return
                            queryKeyIsState({
                                dragging: true,
                                offset: { x: e.clientX - isState.position.x, y: e.clientY - isState.position.y }
                            });
                        }}
                    >
                        <h2 className="w-full text-lg font-semibold border-b">Trợ lý AI - FMRP</h2>
                        <button
                            onClick={() => {
                                if (stateBoxChatAi.openViewModal) {
                                    dispatch({
                                        type: "stateBoxChatAi",
                                        payload: {
                                            ...stateBoxChatAi,
                                            openViewModal: false,
                                        }
                                    });
                                } else {
                                    dispatch({
                                        type: "stateBoxChatAi",
                                        payload: {
                                            ...stateBoxChatAi,
                                            open: false,
                                        }
                                    });
                                }
                                queryKeyIsState({ position: { x: window.innerWidth - 80, y: window.innerHeight - 140 } });
                            }}
                            className={`absolute right-0 text-gray-500 ${stateBoxChatAi.openViewModal ? "top-2" : "-top-1"} hover:text-gray-700`}
                        >
                            <IoIosClose size={32} />
                        </button>
                    </div>
                    <div className="flex items-start gap-4 ">
                        <div style={{
                            // 32 padingg trên dưới 
                            height: stateBoxChatAi.openViewModal ? `calc(100vh - ${((isState.headerHeight ?? 0) + 28)}px)` : "auto"
                        }} className={`${stateBoxChatAi.openViewModal ? "w-[30%] " : "w-full"}`}>
                            <Customscrollbar className={`flex-1 p-2 overflow-y-auto ${stateBoxChatAi.openViewModal ? "bg-gray-100" : ""}`}>
                                <div className={`space-y-4`}
                                    style={{
                                        height: stateBoxChatAi.openViewModal ? `calc(100vh - ${((isState.boxMessageHeight ?? 0) + (((isState.headerHeight ?? 0) + 28)))}px)` : "288px"
                                    }}
                                >
                                    {stateBoxChatAi?.messenger?.map((msg, index, array) => (
                                        <div
                                            key={index}
                                            className={`flex items-center ${msg?.sender === "user" ? "justify-end" : "justify-start"} gap-1`}
                                        >
                                            {
                                                msg.sender != "user" && (
                                                    <div className="w-8 h-8 rounded-full min-w-[7%]">
                                                        <Image
                                                            width={1280}
                                                            height={1024}
                                                            src="/ai/icon.png"
                                                            className='object-contain w-full h-full rounded-full'
                                                        />
                                                    </div>
                                                )
                                            }
                                            <div
                                                className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 ease-in-out transform ${msg?.sender === "user"
                                                    ? "bg-gray-100 text-gray-800"
                                                    : "bg-gray-50 text-gray-800"
                                                    } flex items-center space-x-2 cursor-default relative`}
                                            >
                                                {
                                                    msg?.sender === "ai" && array?.length - 1 == index && (!stateBoxChatAi.openViewModal)
                                                        ?
                                                        <p>
                                                            <span>{msg?.text.slice(0, maxTextLength)}</span>
                                                            <span
                                                                style={{
                                                                    textShadow: "#111 0 0 5px",
                                                                    color: "transparent",
                                                                }}
                                                                className="pl-1"
                                                            >
                                                                {msg?.text.slice(maxTextLength)}
                                                            </span>
                                                            {
                                                                msg?.text.length > maxTextLength && (
                                                                    <span
                                                                        onClick={() => {
                                                                            dispatch({
                                                                                type: "stateBoxChatAi",
                                                                                payload: {
                                                                                    ...stateBoxChatAi,
                                                                                    openViewModal: true
                                                                                }
                                                                            })
                                                                            queryKeyIsState({ position: { x: window.innerWidth - 80, y: window.innerHeight } })
                                                                        }}
                                                                        className={` text-blue-500 cursor-pointer select-none pl-2`} >
                                                                        ... <IoIosResize className="inline" size={18} />
                                                                    </span>
                                                                )
                                                            }
                                                        </p>
                                                        :
                                                        <p>
                                                            {msg?.text}
                                                        </p>
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </Customscrollbar>
                            <div ref={boxMessageRef} className={`${stateBoxChatAi.openViewModal ? "bg-gray-100 pb-2" : "bg-transparent"} px-2`}>
                                <div className="flex flex-wrap gap-2 py-2 min-h-8 max-h-24">
                                    {
                                        isLoadingDataType
                                            ?
                                            [...Array(4)].map((_, index) => (
                                                <div
                                                    key={`sekelton-words-${index}`}
                                                    className='h-8 bg-gray-200 rounded-md w-14 animate-pulse'
                                                />
                                            ))
                                            :
                                            dataType?.items && dataType?.items?.map((e) => (
                                                <div
                                                    key={`e-${e?.id}`}
                                                    type="button"
                                                    className={`${stateBoxChatAi.typeChat?.id === e?.id ? "bg-[#3276FA] text-white cursor-pointer" : "bg-slate-100 text-gray-500 hover:bg-[#3276FA] hover:text-white cursor-pointer"}
                                        flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-150 ease-linear`}
                                                    onClick={() => dispatch({
                                                        type: "stateBoxChatAi",
                                                        payload: {
                                                            ...stateBoxChatAi,
                                                            typeChat: e
                                                        }
                                                    })}
                                                >
                                                    {e?.name}
                                                </div>
                                            ))
                                    }
                                </div>

                                <div className={`flex flex-col  gap-2  ${stateBoxChatAi.openViewModal ? "bg-white" : "bg-[#F4F5F5]"} rounded-lg`}>
                                    <textarea
                                        rows="1"
                                        ref={textareaRef}
                                        value={isState.localContent}
                                        onChange={handleChange}
                                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey && stateBoxChatAi?.typeChat != "") {
                                                e.preventDefault();
                                                sendMessage()
                                            }
                                        }}
                                        className="w-full rounded-lg bg-transparent p-4 text-[13px] text-black focus:outline-none  min-h-[40px] h-auto overflow-y-hidden"
                                        placeholder="Message AI - FMRP..."
                                    >
                                    </textarea>
                                    <div className="flex items-center justify-end gap-2 p-2 ">
                                        <div class="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={isLoadingGenerateText}
                                                onClick={() => sendMessage()}
                                                className="flex items-center justify-center mr-2 text-white bg-black rounded-full disabled:bg-black/20 hover:bg-gray-600 focus:outline-none">
                                                {
                                                    isLoadingGenerateText
                                                        ?
                                                        <LoadingButton hiddenTitle className={'w-7 h-7 p-1 '} />
                                                        :
                                                        <svg
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 32 32"
                                                            fill="none"
                                                            xmlns="http:www.w3.org/2000/svg"
                                                            className="icon-2xl"
                                                        >
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z" fill="currentColor"></path>
                                                        </svg>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            stateBoxChatAi.openViewModal && (
                                <div className="w-[70%]">
                                    <TableBom />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div >
        </div >
    );
}
