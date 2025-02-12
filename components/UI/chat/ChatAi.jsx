import PopupCustom from "@/components/UI/popup";
import { usePostGenerateTextBom } from '@/hooks/ai/useGenerateTextBom';
import { useGetNumberOfWordsList } from '@/hooks/ai/useGetNumberOfWordsList';
import { ArrowUp, Paperclip2 } from 'iconsax-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { FiMessageSquare } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '../loading/loadingButton';
import { v4 } from "uuid";
import { ColumnTablePopup, HeaderTablePopup } from "../common/TablePopup";
import { Customscrollbar } from "../common/Customscrollbar";

const ChatAi = (props) => {
    const { type, setData, data: dataParent, dataLang, } = props

    const dispatch = useDispatch();

    const { onSubmit: submitGenerateTextBom, isLoading: isLoadingGenerateText } = usePostGenerateTextBom()

    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);

    const { data: dataNumberOfWords, isLoading: isLoadingNumberOfWords } = useGetNumberOfWordsList()

    console.log("stateBoxChatAi", stateBoxChatAi);

    const titleHeaderAi = {
        "bom": {
            "title": "AI BOM",
            onSubmit: async (data) => {
                return await submitGenerateTextBom(data)
            }
        }
    }

    console.log("dataParent", dataParent);
    const handleSubmitGenerateText = async () => {
        const res = await titleHeaderAi[type].onSubmit({
            content: stateBoxChatAi.chat?.content
        })
        if (res?.data) {
            if (type == 'bom') {
                console.log("res?.data?.item", res?.data?.items);
                const newData = dataParent?.dataSelectedVariant?.map((e) => ({
                    ...e,
                    child: res?.data?.items?.map((ce) => ({
                        dataName: [],
                        dataUnit: ce?.units.map((i) => ({
                            label: i?.unit,
                            value: i?.unitid,
                        })) || [],
                        id: v4(),
                        type: {
                            label: ce?.str_type_item,
                            value: ce?.type_item,
                        },
                        name: {
                            label: ce?.item_name,
                            value: ce?.item_id,
                            product_variation: ce?.variation_name,
                        },
                        unit: ce?.unit_name ? {
                            label: ce?.unit_name,
                            value: ce?.unit_id,
                        } : null,
                        norm: Number(ce?.quota),
                        loss: Number(ce?.loss),
                        stage: ce?.stage_name ? {
                            label: ce?.stage_name,
                            value: ce?.stage_id,
                        } : null,
                    })),
                }));
                console.log("newData", newData);


                dispatch({
                    type: "stateBoxChatAi",
                    payload: {
                        ...stateBoxChatAi,
                        generateContentClient: {
                            content: res?.data?.content,
                            textDataRequest: stateBoxChatAi.chat?.content,
                        },
                        dataTableShowBom: res?.data?.items,
                        chat: {
                            ...stateBoxChatAi.chat, content: ""
                        }
                    }
                })
                setData.sSelectedList(newData)
                setData.sDataSelectedVariant(newData)
                setData.sCurrentData(newData)
            }
            return
        }

        dispatch({
            type: "stateBoxChatAi",
            payload: {
                ...stateBoxChatAi,
                chat: {
                    ...stateBoxChatAi.chat, content: ""
                }
            }
        })
    }

    useEffect(() => {
        if (dataNumberOfWords) {
            dispatch({
                type: "stateBoxChatAi",
                payload: { ...stateBoxChatAi, chat: { ...stateBoxChatAi.chat, quantityWord: dataNumberOfWords[0] } }
            })
        }
    }, [dataNumberOfWords, stateBoxChatAi.open])

    console.log("12222", stateBoxChatAi?.generateContentClient);


    return (
        <PopupCustom
            title={titleHeaderAi[type].title}
            button={
                <div className="relative px-3 py-2 text-sm font-semibold text-white transition-all duration-300 transform bg-blue-600 rounded-full shadow-lg hover:scale-110 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                    <span className="absolute inset-0 w-full h-full rounded-full opacity-50 bg-gradient-to-r from-blue-500 to-blue-700 blur-md"></span>
                    <span className="relative">Open OpenAI</span>
                </div>
            }
            lockScroll={true}
            onClickOpen={() => {
                dispatch({ type: "stateBoxChatAi", payload: { ...stateBoxChatAi, open: true } })

            }}
            open={stateBoxChatAi.open}
            onClose={() => {
                dispatch({ type: "stateBoxChatAi", payload: { ...stateBoxChatAi, open: false } })
            }}
            classNameBtn={props.className}
        >
            <div className="flex flex-col max-w-3xl mx-auto w-[768px]"
                style={{
                    maxHeight: `calc(100vh - 20vh)`
                }}
            >
                <Customscrollbar className="flex-1 h-full p-4 overflow-auto">
                    {
                        stateBoxChatAi?.generateContentClient?.content ?
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="p-3 bg-[#EFF6FF] border-none">
                                            <p className="text-sm">
                                                {stateBoxChatAi?.generateContentClient?.textDataRequest ?? ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-start gap-2">
                                            <div className="w-12 h-12 rounded-full min-w-[6.5%]">
                                                <Image
                                                    width={1280}
                                                    height={1024}
                                                    src="/ai/ai.webp"
                                                    className='object-cover w-full h-full rounded-full'
                                                />
                                            </div>
                                            <div className="p-3 border-none bg-muted/50">
                                                <p className="mb-2 text-sm">
                                                    {stateBoxChatAi?.generateContentClient?.content ?? ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="">
                                            <HeaderTablePopup gridCols={11}>
                                                <ColumnTablePopup colSpan={5}>{dataLang?.bom_name_finishedProduct}</ColumnTablePopup>
                                                <ColumnTablePopup colSpan={2} textAlign={"left"}>
                                                    {dataLang?.norm_finishedProduct || "norm_finishedProduct"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup colSpan={2} textAlign={"left"}>
                                                    %{dataLang?.loss_finishedProduct || "loss_finishedProduct"}
                                                </ColumnTablePopup>
                                                <ColumnTablePopup colSpan={2} textAlign={"left"}>
                                                    {'Công đoạn'}
                                                </ColumnTablePopup>
                                            </HeaderTablePopup>
                                            <div className="grid-cols-11">
                                                <div className="col-span-5">

                                                </div>
                                                <div className="col-span-2">

                                                </div>
                                                <div className="col-span-2">

                                                </div>
                                                <div className="col-span-2">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <FiMessageSquare className="w-12 h-12 mb-4" />
                                <p className="text-lg font-medium">No content yet</p>
                                <p className="text-sm">Start a conversation by typing a content below</p>
                            </div>
                    }
                </Customscrollbar>

                {/* New Message Input */}
                <div className="mx-4 pt-4 pb-0.5 border-t">
                    <div className="flex flex-col gap-2 ">
                        {/* Tags Area */}
                        <div className="flex flex-wrap gap-2 min-h-8 max-h-24">
                            {
                                isLoadingNumberOfWords
                                    ?
                                    [...Array(4)].map((_, index) => (
                                        <div
                                            key={`sekelton-words-${index}`}
                                            className='h-8 bg-gray-200 rounded-md w-14 animate-pulse'
                                        />
                                    ))
                                    :
                                    dataNumberOfWords && dataNumberOfWords?.map((tag) => (
                                        <div
                                            key={`tag-word-${tag.id}`}
                                            type="button"
                                            className={`${stateBoxChatAi?.chat?.quantityWord?.id === tag.id ? "bg-[#3276FA] text-white cursor-pointer" : "bg-slate-100 text-gray-500 hover:bg-[#3276FA] hover:text-white cursor-pointer"}
                                                flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-150 ease-linear`}
                                            onClick={() => {
                                                dispatch({
                                                    type: "stateBoxChatAi",
                                                    payload: {
                                                        ...stateBoxChatAi,
                                                        chat: {
                                                            ...stateBoxChatAi?.chat,
                                                            quantityWord: tag
                                                        }
                                                    }
                                                })
                                            }}
                                        >
                                            {tag?.name}
                                        </div>
                                    ))
                            }
                        </div>
                        {/* Input Area */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <textarea
                                    value={stateBoxChatAi.chat?.content}
                                    onChange={(e) => dispatch({
                                        type: "stateBoxChatAi",
                                        payload: {
                                            ...stateBoxChatAi,
                                            chat: {
                                                ...stateBoxChatAi?.chat,
                                                content: e.target.value
                                            }
                                        }
                                    })}
                                    placeholder="Content BOM"
                                    className="min-h-[80px] pr-10 resize-none flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey && stateBoxChatAi?.chat?.content != "") {
                                            e.preventDefault();
                                            handleSubmitGenerateText()
                                        }
                                    }}
                                />
                                <div className="absolute flex gap-2 bottom-2 right-2">
                                    <button className="w-8 h-8">
                                        <Paperclip2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                    if (stateBoxChatAi?.chat?.content) {
                                        handleSubmitGenerateText()
                                    }
                                }}
                            >
                                {
                                    isLoadingGenerateText
                                        ?
                                        <LoadingButton hiddenTitle={true} className='w-5 h-5 text-blue-500' />
                                        :
                                        <div className='size-5'>
                                            <ArrowUp className="size-full" />
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PopupCustom >
    )
}

export default ChatAi