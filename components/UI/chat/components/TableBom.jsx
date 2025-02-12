import React from 'react'
import { useSelector } from 'react-redux';
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from '@/hooks/useConfigNumber';

const TableBom = () => {
    const dataSeting = useSetingServer();

    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);
    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    return (
        <div>

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
                                                                        small={row?.images ?? "/no_img.png"}
                                                                        large={row?.images ?? "/no_img.png"}
                                                                        width={36}
                                                                        height={36}
                                                                        alt={row?.images ?? "/no_img.png"}
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
        </div>
    )
}

export default TableBom