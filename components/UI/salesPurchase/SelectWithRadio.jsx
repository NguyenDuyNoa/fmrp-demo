import Popup_dskh from '@/containers/clients/clients/components/popup/popupAdd'
import { useClientList } from '@/containers/clients/clients/hooks/useClientList'
import { useProvinceList } from '@/hooks/common/useAddress'
import { useLimitAndTotalItems } from '@/hooks/useLimitAndTotalItems'
import useActionRole from '@/hooks/useRole'
import { Empty, Radio, Select } from 'antd'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { PiPlus } from 'react-icons/pi'
import { useSelector } from 'react-redux'

const { Option } = Select

const initalState = {
  keySearch: '',
  idBranch: null,
}

const SelectWithRadio = ({
  title,
  placeholderText,
  options,
  value,
  onChange,
  onClear,
  disabled,
  isError = false,
  isShowAddNew = false,
  onSearch,
  dataBranch,
  dataLang,
  icon,
  sSearchClient,
}) => {
  const router = useRouter()

  const [isState, _setIsState] = useState(initalState)

  // phân quyền
  const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth)

  // phân quyền
  const { checkAdd } = useActionRole(auth, 'client_customers')

  // danh sách tỉnh thành
  const { data: listSelectCt } = useProvinceList({})

  // phân trang
  const { limit } = useLimitAndTotalItems()

  // params lọc
  const params = {
    search: isState?.keySearch,
    limit: limit,
    page: router.query?.page || 1,
    'filter[client_group_id]': router.query?.tab != '0' ? (router.query?.tab != '-1' ? router.query?.tab : -1) : null,
    'filter[branch_id]': isState?.idBranch?.length > 0 ? isState?.idBranch.map((e) => e.value) : null,
  }

  //  danh sách khách hàng
  const { refetch } = useClientList(params)

  const handleSearchClient = debounce(async (value) => {
    sSearchClient(value)
  }, 500)

  return (
    <div className="w-full flex">
      <div className="relative flex select-with-radio">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[#7a7a7a]">{icon}</span>
        <Select
          className="placeholder-secondary-color-text-disabled placeholder:responsive-text-sm cursor-pointer select-with-radio w-full"
          showSearch
          onSearch={handleSearchClient}
          placeholder={placeholderText}
          allowClear
          value={value}
          onChange={onChange}
          onClear={onClear}
          disabled={disabled}
          filterOption={
            onSearch ? false : (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />}
          popupRender={(menu) => (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="px-3 responsive-text-lg font-semibold font-deca py-4">{title}</div>
                {isShowAddNew && (role == true || checkAdd) && (
                  <>
                    <Popup_dskh
                      listBr={dataBranch || []}
                      listSelectCt={listSelectCt}
                      onRefresh={refetch.bind(this)}
                      dataLang={dataLang}
                      nameModel={'client_contact'}
                      buttonAddNew={
                        <div className="text-[#0375F3] hover:text-[#1760B9] font-normal text-[13px] mr-3 flex gap-1 items-center cursor-pointer">
                          <PiPlus className="text-base" />
                          Thêm mới
                        </div>
                      }
                    />
                  </>
                )}
              </div>
              <div>{menu}</div>
            </>
          )}
          optionLabelProp="label"
          status={isError ? 'error' : ''}
        >
          {options?.map((opt, index) => {
            return (
              <Option key={opt.value} value={opt.value} label={opt.label}>
                <div
                  className={`flex items-center py-2 gap-x-2 responsive-text-base ${
                    index !== options.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <Radio checked={value?.value === opt.value} />
                  {opt.label}
                </div>
              </Option>
            )
          })}
        </Select>
      </div>
    </div>
  )
}

export default SelectWithRadio
