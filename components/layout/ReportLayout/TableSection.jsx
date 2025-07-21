import React, { useRef, useState, useEffect } from 'react'
import { Customscrollbar } from '@/components/UI/common/Customscrollbar'
import { ColumnTable } from '@/components/UI/common/Table'

const TableSection = ({
  fixedColumns = [],
  scrollableColumns = [],
  data = [],
  renderFixedRow,
  renderScrollableRow,
  renderFooter,
}) => {
  const scrollbarRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)
  console.log(data.length)
  // Check initial scroll position when component mounts
  useEffect(() => {
    const checkInitialScroll = () => {
      if (scrollbarRef.current) {
        try {
          const scrollableEl = scrollbarRef.current.getScrollElement
            ? scrollbarRef.current.getScrollElement()
            : scrollbarRef.current.querySelector('.simplebar-content-wrapper')

          if (scrollableEl && scrollableEl.scrollLeft > 5) {
            setIsScrolled(true)
          }
        } catch (error) {
          console.error('Error accessing scroll element:', error)
        }
      }
    }

    setTimeout(checkInitialScroll, 100)
  }, [])

  const handleScroll = (e) => {
    try {
      const scrollElement = e.target
      if (scrollElement && typeof scrollElement.scrollLeft === 'number' && scrollElement.scrollLeft > 5) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    } catch (error) {
      console.error('Error in scroll handler:', error)
    }
  }

  return (
    <div className="h-full relative overflow-hidden flex flex-col">
      {/* Border container */}
      <div className="absolute z-[2] top-0 left-0 right-0 h-[calc(100%-40px)] border border-[#E0E0E1] pointer-events-none"></div>

      <Customscrollbar className="h-full flex-1 overflow-auto" onScroll={handleScroll} ref={scrollbarRef}>
        <div className={`relative h-full min-w-full w-max ${data.length > 8 ? '' : 'flex flex-col'}`}>
          {/* Header row with fixed and scrollable columns */}
          <div className="flex sticky top-0 z-30">
            {/* Fixed columns header */}
            <div
              className={`flex sticky left-0 z-20 bg-white border-b border-[#E0E0E1] ${
                isScrolled
                  ? 'after:absolute after:top-0 after:-right-[20px] after:w-[20px] after:h-full after:[background-image:linear-gradient(90deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.05)_50%,transparent_100%)]'
                  : ''
              }`}
            >
              {fixedColumns.map((column, index) => (
                <ColumnTable
                  key={index}
                  textAlign={column.textAlign || 'center'}
                  className={`py-2 px-3 border-r border-[#E0E0E1] text-neutral-07 !responsive-text-sm font-semibold ${column.width} flex-shrink-0`}
                >
                  {column.title}
                </ColumnTable>
              ))}
            </div>

            {/* Scrollable columns header */}
            <div className="flex bg-white border-b border-[#E0E0E1]">
              {scrollableColumns.map((column, index) => (
                <ColumnTable
                  key={index}
                  textAlign={column.textAlign || 'center'}
                  className={`py-2 px-3 ${
                    index !== scrollableColumns.length - 1 ? 'border-r border-[#E0E0E1]' : ''
                  }  items-center text-neutral-07 !responsive-text-sm font-semibold ${column.width} flex-shrink-0`}
                >
                  {column.title}
                </ColumnTable>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            {/* Table rows */}
            {data.map((item, rowIndex) => (
              <div className={`flex relative`} key={rowIndex}>
                {/* Fixed columns */}
                <div
                  className={`flex sticky left-0 z-20 bg-white border-b border-[#E0E0E1] ${
                    isScrolled
                      ? 'after:absolute after:top-0 after:-right-[20px] after:w-[20px] after:h-full after:[background-image:linear-gradient(90deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.05)_50%,transparent_100%)]'
                      : ''
                  }`}
                >
                  {renderFixedRow(item, rowIndex)}
                </div>

                {/* Scrollable columns */}
                <div className="flex bg-white border-b border-[#E0E0E1]">{renderScrollableRow(item, rowIndex)}</div>
              </div>
            ))}
          </div>

          {/* Footer row */}
          {renderFooter && <div className="flex sticky bottom-0 z-30 bg-white">{renderFooter()}</div>}
        </div>
      </Customscrollbar>
    </div>
  )
}

export default TableSection
