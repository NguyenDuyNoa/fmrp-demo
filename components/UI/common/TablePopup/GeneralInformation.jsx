export const GeneralInformation = (props) => {
    const dataLang = props?.dataLang
    return (
        <h2 className="font-normal bg-[#ECF0F4] 3xl:p-2 p-1 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px]">
            {dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}
        </h2>
    )
}
