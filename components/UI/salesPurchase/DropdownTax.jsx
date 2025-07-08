import TableHeader from '@/components/common/orderManagement/TableHeader'
import { Dropdown } from 'antd'
import { ArrowDown2 } from 'iconsax-react'
import { useState } from 'react'
import SelectCustomLabel from './SelectCustomLabel'

const DropdownTax = ({ taxOptions, totalTax, onChange, dataLang }) => {
  const [dropDownTax, sDropDownTax] = useState(false)

  return (
    <Dropdown
      open={dropDownTax}
      onOpenChange={(open) => sDropDownTax(open)}
      overlay={
        <div className="px-4 py-5 shadow-lg bg-white rounded-lg">
          <p className="3xl:text-base 2xl:text-sm text-[12px] font-normal font-deca text-secondary-color-text mb-2">
            Chọn hoàng loạt % thuế
          </p>
          <SelectCustomLabel
            className="select-tax placeholder:text-xs"
            placeholder={dataLang?.sales_product_tax || 'sales_product_tax'}
            options={taxOptions}
            value={totalTax}
            onChange={(value) => {
              onChange(value)
              sDropDownTax(false)
            }}
            renderOption={(option, isLabel) => (
              <div
                className={`flex items-center justify-start gap-1 responsive-text-sm ${isLabel ? 'py-1 2xl:py-2' : ''}`}
              >
                <h2 className="">{option?.label}</h2>
                {option?.tax_rate !== '0' && option?.tax_rate !== '5' && (
                  <h2>{option?.tax_rate === '20' ? `(${option?.tax_rate}%)` : `${option?.tax_rate}%`}</h2>
                )}
              </div>
            )}
          />
        </div>
      }
      trigger={['click']}
      placement="bottomCenter"
      arrow
    >
      <div
        className="inline-flex items-center justify-between cursor-pointer"
        onClick={() => sDropDownTax(!dropDownTax)}
      >
        <TableHeader className="text-start">{dataLang?.sales_product_tax || 'sales_product_tax'}</TableHeader>
        <ArrowDown2 size={16} className="text-neutral-02 font-medium" />
      </div>
    </Dropdown>
  )
}

export default DropdownTax
