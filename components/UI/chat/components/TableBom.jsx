import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from '@/hooks/useConfigNumber';
import { heightY, widthX } from '../ChatAiBubble';

const TableBom = (props) => {
    const dispatch = useDispatch()

    const { queryKeyIsState } = props

    const dataSeting = useSetingServer();

    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);
    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    return (
        <div className='flex flex-col gap-4'>
            <h2 className='text-base font-normal texxt-black'>
                {stateBoxChatAi?.dataReview?.content ?? ""}
            </h2>
            {
                stateBoxChatAi?.dataReview?.items?.length > 0
                    ?
                    <table className="w-full text-sm border border-separate border-gray-200 table-auto border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-gray-100">
                            <tr>
                                <th className="p-2 border ">Loại</th>
                                <th className="p-2 border ">Tên NVL</th>
                                <th className="p-2 border ">Định mức</th>
                                <th className="p-2 border ">Hao hụt</th>
                                <th className="p-2 border ">Công đoạn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stateBoxChatAi?.dataReview?.items?.map((row, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="sticky left-0 p-2 text-sm text-center text-blue-500 bg-white border">
                                                {row?.str_type_item}
                                            </td>
                                            <td className="p-2 text-sm border text-start">
                                                <p>{row?.item_name}</p>
                                                <p className='text-xs italic'>{row?.variation_name}</p>
                                            </td>
                                            <td className="p-2 text-sm text-center border">{formatNumber(row?.quota)}</td>
                                            <td className="p-2 text-sm text-center border">{formatNumber(row?.loss)}</td>
                                            <td className="p-2 text-sm text-center border">{row?.stage_name}</td>

                                            {/* <td className="p-2 border sticky left-[200px] bg-white">
                                                                <div className="flex items-center justify-center">
                                                                    <ModalImage
                                                                        small={row?.images ?? "/icon/noimagelogo.png"}
                                                                        large={row?.images ?? "/icon/noimagelogo.png"}
                                                                        width={36}
                                                                        height={36}
                                                                        alt={row?.images ?? "/icon/noimagelogo.png"}
                                                                        className="object-cover rounded-md min-w-[48px] min-h-[48px] w-[48px] h-[48px] max-w-[48px] max-h-[48px]"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-2 text-sm border sticky left-[300px] bg-white">
                                                                <p>{row?.item_name}</p>
                                                                <p className="text-xs italic">{row?.product_variation}</p>
                                                            </td> */}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    :
                    ""
            }
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    onClick={() => {
                        dispatch({
                            type: "stateBoxChatAi",
                            payload: {
                                ...stateBoxChatAi,
                                typeData: 'presentBom',
                                openViewModal: false,
                            },
                        });
                        queryKeyIsState({ position: { x: window.innerWidth - widthX, y: window.innerHeight - heightY } });
                    }}
                    className="button text-[#0F4F9E] font-normal text-xs py-1.5 px-3 rounded-3xl bg-[#003DA0]/20 hover:bg-[#003DA0] hover:text-white hover:scale-105 transition-all duration-200 ease-linear"
                >
                    Bổ sung vào BOM hiện tại
                </button>
                <button
                    type="submit"
                    onClick={() => {
                        dispatch({
                            type: "stateBoxChatAi",
                            payload: {
                                ...stateBoxChatAi,
                                typeData: 'newBom',
                                openViewModal: false
                            },
                        });
                        queryKeyIsState({ position: { x: window.innerWidth - widthX, y: window.innerHeight - heightY } });
                    }}
                    className="button text-[#0F4F9E] font-normal text-xs py-1.5 px-3 rounded-3xl bg-[#003DA0]/20 hover:bg-[#003DA0] hover:text-white hover:scale-105 transition-all duration-200 ease-linear"
                >
                    Áp dụng làm mới BOM
                </button>
            </div>

        </div>
    )
}

export default TableBom