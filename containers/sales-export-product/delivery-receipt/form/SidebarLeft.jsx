import SelectBySearch from '@/components/common/select/SelectBySearch'
import EmptyData from '@/components/UI/emptyData'

const SidebarLeft = ({ dataLang, formatNumber, sortedArr }) => {
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
          allItems={[]}
          formatNumber={formatNumber}
          selectedOptions={[]}
        />
      </div>

      {sortedArr.length <= 0 && <EmptyData />}
    </div>
  )
}

export default SidebarLeft
