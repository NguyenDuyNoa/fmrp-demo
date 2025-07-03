import CloseXIcon from '@/components/icons/common/CloseXIcon'
import DropdownFilledIcon from '@/components/icons/common/DropdownFilledIcon'
import configSelectFillter from '@/configs/configSelectFillter'
import { SelectCore } from '@/utils/lib/Select'
import { FaCheck } from 'react-icons/fa'
import { components as reactSelectComponents } from 'react-select'
import { Customscrollbar } from '../common/Customscrollbar'

export const CustomOption = (props) => {
  return (
    <reactSelectComponents.Option {...props}>
      <div
        className={`flex items-center justify-between w-full ${props.isDisabled ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <div>{props.children}</div>
        {props.isSelected && <FaCheck className="w-2.5 h-2.5 ml-2 text-primary" />}
      </div>
    </reactSelectComponents.Option>
  )
}

// Custom Dropdown Indicator
const DropdownIndicator = (props) => {
  const CustomIcon = props.selectProps.dropdownIcon
  return (
    <reactSelectComponents.DropdownIndicator {...props}>
      {CustomIcon ? (
        <div className={`transition-transform duration-500 ${props.selectProps.menuIsOpen ? 'rotate-180' : ''}`}>
          {CustomIcon}
        </div>
      ) : (
        <DropdownFilledIcon
          className={`w-3 h-3 transition-transform duration-500 ${
            props.selectProps.menuIsOpen ? 'rotate-180 text-[#003DA0]' : 'text-neutral-02'
          }`}
        />
      )}
    </reactSelectComponents.DropdownIndicator>
  )
}

// Custom Clear Indicator
const ClearIndicator = (props) => (
  <reactSelectComponents.ClearIndicator
    {...props}
    innerProps={{
      ...props.innerProps,
      onMouseDown: (e) => {
        e.stopPropagation()
        if (props.innerProps && props.innerProps.onMouseDown) {
          props.innerProps.onMouseDown(e)
        }
      },
    }}
  >
    <CloseXIcon className="w-4 h-4 text-[#9295A4]" />
  </reactSelectComponents.ClearIndicator>
)

export const CustomMenuList = (props) => {
  return <Customscrollbar className="max-h-[300px]">{props.children}</Customscrollbar>
}

// Custom Control với Icon tùy chỉnh
const CustomControl = ({ children, ...props }) => {
  const Icon = props.selectProps.icon
  return (
    <reactSelectComponents.Control {...props}>
      {Icon && <div className="ml-3">{Icon}</div>}
      {children}
    </reactSelectComponents.Control>
  )
}

const SelectComponent = ({
  options,
  value,
  onChange,
  onInputChange,
  placeholder,
  colSpan,
  isMulti,
  components,
  closeMenuOnSelect,
  formatOptionLabel,
  classNamePrefix,
  maxMenuHeight,
  isClearable,
  menuPortalTarget,
  className,
  styles,
  defaultValue,
  noOptionsMessage,
  menuShouldBlockScroll,
  classParent,
  onMenuOpen,
  maxShowMuti,
  id,
  type = 'header',
  icon = null,
  dropdownIcon = null,
}) => {
  // const styles = {
  //     menuList: (base) => ({
  //         ...base,
  //         height: "100px",

  //         "::-webkit-scrollbar": {
  //             width: "9px"
  //         },
  //         "::-webkit-scrollbar-track": {
  //             background: "red"
  //         },
  //         "::-webkit-scrollbar-thumb": {
  //             background: "#888"
  //         },
  //         "::-webkit-scrollbar-thumb:hover": {
  //             background: "#555"
  //         }
  //     })
  // }

  const styleType =
    type == 'header'
      ? styles
        ? {
            ...styles,
            option: (provided, state) => ({
              ...styles?.option,
              ...provided,
              backgroundColor: 'transparent',
              color: state?.isSelected ? '#2563eb' : provided?.color, // Giữ màu chữ
              '&:hover': {
                backgroundColor: 'transparent',
                color: state?.isDisabled ? provided['&:hover']?.color : '#3b82f6',
              },
            }),
            menu: (provided) => ({
              ...provided,
              position: 'absolute',
              zIndex: 50,
            }),
          }
        : configSelectFillter.styles
      : {
          ...styles,
          option: (provided, state) => ({
            ...styles?.option,
            ...provided,
            backgroundColor: 'transparent',
            // backgroundColor: state?.isSelected ? 'transparent' : provided?.backgroundColor, // Bỏ nền khi selected
            color: state?.isSelected ? '#2563eb' : provided?.color, // Giữ màu chữ
            '&:hover': {
              backgroundColor: 'transparent',
              // backgroundColor: state?.isSelected ? 'transparent' : provided['&:hover']?.backgroundColor, // Giữ transparent khi hover
              color: state?.isDisabled ? provided['&:hover']?.color : '#3b82f6',
            },
          }),
          placeholder: (base) => ({
            ...base,
            color: '#cbd5e1',
          }),
          menu: (provided) => ({
            ...provided,
            position: 'absolute',
            zIndex: 50,
          }),
        }

  return (
    <div className={`${classParent ? classParent : ''} relative`}>
      <SelectCore
        id={id ?? 'parentSelect'}
        //bật lên nó sẽ render ra ngoài dom gây đè header
        //menuPortalTarget={menuPortalTarget ?? null}
        menuPortalTarget={menuPortalTarget ?? document.body}
        // menuPortalTarget={null}
        options={options}
        value={value}
        onInputChange={onInputChange ? onInputChange : ''}
        onChange={onChange}
        placeholder={placeholder}
        onMenuOpen={onMenuOpen}
        // menuIsOpen={true}
        {...configSelectFillter}
        defaultValue={defaultValue}
        className={`${configSelectFillter.className} ${className || 'min-w-[200px]'}`}
        isMulti={isMulti ? isMulti : false}
        components={{
          ...(components || {}),
          Option: CustomOption,
          MenuList: CustomMenuList,
          DropdownIndicator,
          IndicatorSeparator: () => null,
          ClearIndicator,
          Control: icon ? CustomControl : reactSelectComponents.Control,
        }}
        icon={icon}
        dropdownIcon={dropdownIcon}
        maxShowMuti={maxShowMuti}
        noOptionsMessage={noOptionsMessage ? noOptionsMessage : configSelectFillter.noOptionsMessage}
        closeMenuOnSelect={closeMenuOnSelect}
        formatOptionLabel={formatOptionLabel}
        classNamePrefix={classNamePrefix}
        maxMenuHeight={maxMenuHeight}
        isClearable={isClearable}
        // menuPortalTarget={menuPortalTarget}
        menuShouldBlockScroll={menuShouldBlockScroll}
        // styles={{
        //     ...[styles ? styles : configSelectFillter.styles],
        // option: (provided, state) => ({
        //     ...[styles?.option ? styles?.option : configSelectFillter.styles?.option],
        //     ...provided,
        //     backgroundColor: 'transparent',
        //     // backgroundColor: state?.isSelected ? 'transparent' : provided?.backgroundColor, // Bỏ nền khi selected
        //     color: state?.isSelected ? '#2563eb' : provided?.color, // Giữ màu chữ
        //     '&:hover': {
        //         backgroundColor: 'transparent',
        //         // backgroundColor: state?.isSelected ? 'transparent' : provided['&:hover']?.backgroundColor, // Giữ transparent khi hover
        //         color: state?.isDisabled ? provided['&:hover']?.color : '#3b82f6'
        //     },
        // }),
        // }}
        // bỏ nền dùm anh nha chỉ để tích màu xanh và chữ màu xanh thui
        styles={styleType}
      />
    </div>
  )
}
export default SelectComponent
