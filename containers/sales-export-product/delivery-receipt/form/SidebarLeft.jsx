import TaxRateLabel from '@/components/common/orderManagement/TaxRateLabel'
import SelectBySearch from '@/components/common/select/SelectBySearch'
import EmptyData from '@/components/UI/emptyData'
import SelectComponent from '@/components/UI/filterComponents/selectComponent'
import InPutMoneyFormat from '@/components/UI/inputNumericFormat/inputMoneyFormat'
import InPutNumericFormat from '@/components/UI/inputNumericFormat/inputNumericFormat'
import { useTaxList } from '@/hooks/common/useTaxs'
import { isAllowedDiscount, isAllowedNumber } from '@/utils/helpers/common'
import formatMoney from '@/utils/helpers/formatMoney'
import { Dropdown, Select } from 'antd'
import { Add, ArrowDown2, Minus } from 'iconsax-react'
import { useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { MdClear } from 'react-icons/md'
import { v4 as uuidv4 } from 'uuid'

const SidebarLeft = ({
  dataLang,
  formatNumber,
  searchItems,
  sortedArr,
  selectedSearchItems,
  setSelectedSearchItems,
  tableItems,
  setTableItems,
}) => {
  // Call hooks
  const { data: dataTasxes = [] } = useTaxList()

  // State management
  const [idProductSale, setIdProductSale] = useState(null)

  // Format tax options
  const taxOptions = [{ label: 'Miễn thuế', value: '0', tax_rate: '0' }, ...dataTasxes]

  const handleIncrease = () => {
    // Logic to handle increase action
  }

  const handleOnChangeSelectBySearch = (value) => {
    setSelectedSearchItems(value)
    if (value?.length === 0) {
      setTableItems([])
    } else if (value.length > 0) {
      const newData = value?.map((e, index) => {
        const check = tableItems?.find((x) => x?.item?.e?.id == e?.e?.id)
        if (check) {
          return check
        }

        // let money = 0
        // if (e.e?.tax?.tax_rate == undefined) {
        //   money = Number(1) * (1 + Number(0) / 100) * Number(e?.e?.quantity)
        // } else {
        //   money = Number(e?.e?.affterDiscount) * (1 + Number(e?.e?.tax?.tax_rate) / 100) * Number(e?.e?.quantity)
        // }

        return {
          id: uuidv4(),
          item: {
            e: e?.e,
            label: e?.label,
            value: e?.value,
          },
          unit: e?.e?.unit_name,
          quantity: e?.e?.quantity - e?.e?.quantity_delivery,
          sortIndex: index,
          price: e?.e?.price,
          discount: 0,
          price_after_discount: e?.e?.price, // Xem lại
          tax: 0,
          price_after_tax: 1,
          total_amount: Number(e?.e?.price),
          note: '',
        }
      })

      setTableItems([...newData])
    }
  }

  return (
    <div className="min-h-full max-h-[1132px] flex flex-col bg-white border border-[#919EAB3D] rounded-2xl p-4">
      {/* Thông tin mặt hàng */}
      <div className="flex justify-between items-center">
        {/* Heading */}
        <h2 className="w-full 2xl:text-[20px] xl:text-lg font-medium text-brand-color capitalize">
          {dataLang?.item_information || 'item_information'}
        </h2>
        {/* Search Bar */}
        <SelectBySearch
          placeholderText="Tìm kiếm mặt hàng"
          allItems={searchItems}
          formatNumber={formatNumber}
          selectedOptions={selectedSearchItems}
          idProductSale={idProductSale}
          onChange={(value) => {
            handleOnChangeSelectBySearch(value)
          }}
          options={tableItems}
          handleIncrease={handleIncrease}
        />
      </div>

      {tableItems.length <= 0 ? (
        <EmptyData />
      ) : (
        <>
          {/* Thông tin mặt hàng Header */}
          <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] 2xl:gap-6 gap-4 items-center sticky top-0 py-2 mb-2 border-b border-gray-100">
            <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-left truncate font-[400]">
              {dataLang?.sales_product_item || 'sales_product_item'}
            </h4>
            <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-center truncate font-[400]">
              Kho - Vị Trí Kho
            </h4>
            <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-center truncate font-[400]">
              {dataLang?.sales_product_quantity || 'sales_product_quantity'}
            </h4>
            <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-center truncate font-[400]">
              {dataLang?.sales_product_unit_price || 'sales_product_unit_price'}
            </h4>
            {/* Chọn hoàng loạt % chiết khấu */}
            <Dropdown
              overlay={
                <div className="border px-4 py-5 shadow-lg bg-white rounded-lg">
                  <p className="3xl:text-base font-normal font-deca text-secondary-color-text mb-2">
                    Chọn hoàng loạt % chiết khấu
                  </p>
                  <div className="flex items-center justify-center col-span-1 text-center">
                    <InPutNumericFormat
                      // value={totalDiscount}
                      // onValueChange={handleOnChangeInput.bind(this, 'totaldiscount')}
                      className="cursor-text appearance-none text-end 3xl:m-2 3xl:p-2 m-1 p-2 h-10 font-deca font-normal w-full focus:outline-none border rounded-lg 3xl:text-sm 3xl:font-semibold text-black-color 2xl:text-[12px] xl:text-[11px] text-[10px] border-gray-200"
                      // isAllowed={isAllowedDiscount}
                    />
                  </div>
                </div>
              }
              trigger={['click']}
              placement="bottomLeft"
              arrow
            >
              <div className="inline-flex items-center justify-between cursor-pointer w-[90%]">
                <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-start truncate font-[400]">
                  {`${dataLang?.sales_product_rate_discount}` || 'sales_product_rate_discount'}
                </h4>
                <ArrowDown2 size={16} className="text-neutral-02 font-medium" />
              </div>
            </Dropdown>
            <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-start font-[400] whitespace-nowrap">
              {dataLang?.sales_product_after_discount || 'sales_product_after_discount'}
            </h4>
            {/* Chọn hoàng loạt % thuế */}
            <Dropdown
              overlay={
                <div className="border px-4 py-5 shadow-lg bg-white rounded-lg relative z-0 group min-h-auto focus-within:min-h-[270px]">
                  <p className="3xl:text-base font-normal font-deca text-secondary-color-text mb-2">
                    Chọn hoàng loạt % thuế
                  </p>
                  <SelectComponent
                    options={taxOptions}
                    // onChange={(value) => handleOnChangeInput('total_tax', value)}
                    // value={totalTax ? '' : ''}
                    formatOptionLabel={(option) => (
                      <div className="flex items-center justify-start gap-1">
                        <h2>{option?.label}</h2>
                        <h2>{`(${option?.tax_rate})`}</h2>
                      </div>
                    )}
                    placeholder={dataLang?.sales_product_tax || 'sales_product_tax'}
                    hideSelectedOptions={false}
                    className={`3xl:text-[18px] 2xl:text-[16px] xl:text-[14px] text-[12px] border-transparent placeholder:text-slate-300 w-full bg-white rounded text-typo-gray-5 font-normal outline-none`}
                    isSearchable={true}
                    noOptionsMessage={() => 'Không có dữ liệu'}
                    closeMenuOnSelect={true}
                    menuPlacement="auto"
                    menuPosition="fixed"
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: '#cbd5e1',
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      control: (base, state) => ({
                        ...base,
                        boxShadow: 'none',
                        padding: '2.7px',
                        ...(state.isFocused && {
                          border: '0 0 0 1px #92BFF7',
                        }),
                      }),
                    }}
                  />
                </div>
              }
              trigger={['click']}
              placement="bottomLeft"
              arrow
            >
              <div className="inline-flex items-center justify-between cursor-pointer">
                <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize col-span-1 text-start truncate font-[400]">
                  {dataLang?.sales_product_tax || 'sales_product_tax'}
                </h4>
                <ArrowDown2 size={16} className="text-neutral-02 font-medium" />
              </div>
            </Dropdown>
            <h4 className="3xl:text-sm 3xl:font-semibold 2xl:text-[12px] xl:text-[11px] text-[10px] xl:px-3 xl:py-2 text-neutral-02 capitalize text-start truncate font-[400]">
              {dataLang?.sales_product_total_into_money || 'sales_product_total_into_money'}
            </h4>
          </div>

          {/* Thông tin mặt hàng Body */}
          <div className="scroll-bar-products-sale overflow-y-auto pr-4 divide-slate-200">
            {tableItems.map((e) => (
              <div
                className="grid items-center grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] 2xl:gap-6 gap-4 py-1"
                key={e?.id}
              >
                {/* Mặt hàng */}
                <div className="flex">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img
                      src={e?.item?.e?.images ?? '/icon/noimagelogo.png'}
                      alt={e?.item?.e?.name}
                      className="w-10 h-10 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="responsive-text-sm font-semibold text-brand-color mb-1 line-clamp-1">
                      {e?.item?.e?.name}
                    </h2>
                    <p className="text-typo-gray-2 3xl:text-[10px] text-[9px] font-normal mb-1">
                      Màu sắc: <span>{e?.item?.e?.product_variation}</span> - Size:{' '}
                      <span>{e?.item?.e?.product_variation_1 ? e?.item?.e?.product_variation_1 : 'None'}</span>
                    </p>
                    <p className="text-typo-gray-2 3xl:text-[10px] text-[9px] font-normal">
                      ĐVT: <span>{e?.unit}</span> - Tồn: <span>{formatNumber(e?.item?.e?.qty_warehouse)}</span>
                    </p>
                    <div className="flex items-center justify-center col-span-1">
                      <FaPencilAlt size={10} />
                      <input
                        value={e?.note}
                        // onChange={(value) => handleOnChangeInputOption(e?.id, 'note', value)}
                        name="optionEmail"
                        placeholder="Ghi chú"
                        type="text"
                        className="focus:border-[#92BFF7] placeholder:responsive-text-xs 2xl:h-7 xl:h-5 mt-1 py-0 px-1 responsive-text-xs placeholder-slate-300 w-full bg-white rounded-[5.5px] text-[#52575E] font-normal outline-none"
                      />
                    </div>
                  </div>
                </div>
                {/*  Kho - Vị trí kho */}
                <div className="flex items-center justify-center">
                  <Select placeholder="Chọn kho" />
                </div>
                {/* Số lượng */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center 3xl:p-2 xl:p-[2px] p-[1px] border border-border-gray-2 rounded-3xl">
                    <button
                      // onClick={() => handleDecrease(e?.id)}
                      className="2xl:scale-100 xl:scale-90 scale-75 text-black hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5 bg-primary-05 rounded-full"
                    >
                      <Minus size="16" className="scale-75 2xl:scale-100 xl:scale-90" />
                    </button>
                    <InPutNumericFormat
                      value={e?.quantity}
                      // onValueChange={(value) => handleOnChangeInputOption(e?.id, 'quantity', value)}
                      isAllowed={({ floatValue }) => {
                        if (floatValue == 0) {
                          return true
                        } else {
                          return true
                        }
                      }}
                      allowNegative={false}
                      className={`${
                        (e?.quantity == 0 && 'border-red-500') || (e?.quantity == '' && 'border-red-500')
                      } cursor-default appearance-none text-center responsive-text-sm font-normal w-full focus:outline-none`}
                    />
                    <button
                      // onClick={() => handleIncrease(e.id)}
                      className="2xl:scale-100 xl:scale-90 scale-75 text-black hover:bg-[#e2f0fe] hover:text-gray-600 font-bold flex items-center justify-center p-0.5  bg-primary-05 rounded-full"
                    >
                      <Add size="16" className="scale-75 2xl:scale-100 xl:scale-90" />
                    </button>
                  </div>
                </div>

                {/* Đơn giá */}
                <div className="flex items-center justify-center text-center">
                  <InPutMoneyFormat
                    value={e?.price}
                    // onValueChange={(value) => handleOnChangeInputOption(e?.id, 'price', value)}
                    isAllowed={isAllowedNumber}
                    allowNegative={false}
                    className={`price-input-number ${
                      (e?.price == 0 && 'border-red-500') || (e?.price == '' && 'border-red-500')
                    } cursor-default appearance-none text-end 3xl:font-semibold responsive-text-sm font-normal w-full 3xl:my-2 my-1 mx-0 3xl:p-2 p-1 focus:outline-none border rounded-lg border-gray-200`}
                  />
                </div>

                {/* % Chiết khấu */}
                <div className="flex items-center justify-center text-center">
                  <InPutNumericFormat
                    value={e?.discount}
                    // onValueChange={(value) => {
                    //    handleOnChangeInputOption(e?.id, 'discount', value)
                    // }}
                    className={`cursor-text appearance-none text-end 3xl:my-2 my-1 3xl:p-2 p-1 font-normal w-full focus:outline-none border rounded-lg 3xl:font-semibold text-black-color responsive-text-sm border-gray-200`}
                    isAllowed={isAllowedDiscount}
                    isNumericString={true}
                  />
                </div>
                {/* Đơn giá sau chiết khấu */}
                <div className="flex items-center justify-start text-right">
                  <h3 className={`cursor-text px-2 3xl:font-semibold responsive-text-sm text-black-color`}>
                    {formatNumber(e?.price_after_discount)}
                  </h3>
                </div>

                {/* % Thuế */}
                <div className="w-full 3xl:px-2 px-0">
                  <SelectComponent
                    // options={taxOptions}
                    // onChange={(value) => handleOnChangeInputOption(e?.id, 'tax', value)}
                    value={
                      e?.tax
                        ? {
                            label: taxOptions.find((item) => item.value === e?.tax?.value)?.label,
                            value: e?.tax?.value,
                            tax_rate: e?.tax?.tax_rate,
                          }
                        : null
                    }
                    placeholder={'Chọn % thuế'}
                    hideSelectedOptions={false}
                    formatOptionLabel={<TaxRateLabel option={tableItems} />}
                    className={`border-transparent w-full bg-white text-typo-gray-5 font-normal outline-none whitespace-nowrap`}
                    isSearchable={true}
                    noOptionsMessage={() => 'Không có dữ liệu'}
                    menuPortalTarget={document.body}
                    closeMenuOnSelect={true}
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: '#cbd5e1',
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 20,
                      }),
                      control: (base) => ({
                        ...base,
                        boxShadow: 'none',
                        padding: '0px',
                        margin: '0px',
                        borderRadius: '8px',
                      }),
                    }}
                  />
                </div>

                {/* Thành tiền và nút xoá */}
                <div className="flex items-center justify-between text-right">
                  <h3 className={`cursor-text px-2 3xl:font-semibold responsive-text-sm z-[99] text-black-color`}>
                    {formatMoney(e?.total_amount)}
                  </h3>
                  {/* Nút xoá */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => {
                        // setIdProductSale(e?.item?.value)
                        // _HandleDelete.bind(this, e?.id)()
                      }}
                      type="button"
                      title="Xóa"
                      className="transition 3xl:size-6 size-5 responsive-text-sm bg-gray-300 text-black hover:text-typo-black-3/60 flex flex-col justify-center items-center border rounded-full"
                    >
                      <MdClear />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SidebarLeft
