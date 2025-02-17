export const GeneralInformation = (props) => {
    const dataLang = props?.dataLang
    return (
        <h2 className="font-normal bg-[#ECF0F4] 3xl:p-2 p-1 2xl:text-base text-[13px]">
            {dataLang?.purchase_order_detail_general_informatione || "purchase_order_detail_general_informatione"}
        </h2>
    )
}
