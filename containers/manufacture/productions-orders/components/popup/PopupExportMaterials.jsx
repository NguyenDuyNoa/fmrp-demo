import CheckboxDefault from "@/components/common/checkbox/CheckboxDefault";
import CheckIcon from "@/components/icons/common/CheckIcon";
import CloseXIcon from "@/components/icons/common/CloseXIcon";
import MagnifyingGlassIcon from "@/components/icons/common/MagnifyingGlassIcon";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import { useListExportProductionOrder } from "@/managers/api/productions-order/useExportProduct";
import {
  default as formatNumber,
  default as formatNumberConfig,
} from "@/utils/helpers/formatnumber";
import { Lexend_Deca } from "@next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoIosAlert } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";
import { Tooltip } from "react-tippy";
import { twMerge } from "tailwind-merge";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";

const deca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const convertWarehousesToDropdownData = (list_warehouses) => {
  const groups = {};
  list_warehouses.forEach((w) => {
    if (!groups[w.name_warehouse]) {
      groups[w.name_warehouse] = [];
    }
    w.items.forEach((item) => {
      groups[w.name_warehouse].push({
        name_location: item.name_location,
        lot: item.lot,
        expiration_date: item.expiration_date,
        total_quantity: item.total_quantity,
        id_warehouse_custom: item.id_warehouse_custom,
      });
    });
  });
  return Object.entries(groups).map(([label, options]) => ({
    label,
    options,
  }));
};

const CustomDropdownRadioGroup = ({
  data,
  value,
  onChange,
  placeholder = "Chọn kho hàng",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tính chiều rộng tối thiểu dựa trên label dài nhất
  const maxLabelLength = Math.max(...data.map((group) => group.label.length));
  const minColumnWidth = Math.max(160, maxLabelLength * 8);

  let selectedOption, selectedLabelGroup;
  data.forEach((group) => {
    const found = group.options.find(
      (option) => option.id_warehouse_custom === value
    );
    if (found) {
      selectedOption = found;
      selectedLabelGroup = group;
    }
  });

  const displayText = selectedOption
    ? `${selectedLabelGroup.label} - ${selectedOption.name_location}`
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex justify-between items-center w-[300px] text-[#3A3E4C] font-medium border border-[#D0D5DD]  px-3 py-2 text-sm bg-white rounded-lg"
      >
        <span className="truncate">
          {value ? (
            displayText
          ) : (
            <span className="text-[#3A3E4C]">{placeholder}</span>
          )}
        </span>
        <MdArrowDropDown className="text-[#9295A4]" size={25} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 min-w-max w-full rounded-xl bg-[#FFFFFF] shadow-sm border z-50 p-3">
          <Customscrollbar className="max-h-80 ">
            <div className="flex gap-y-2 flex-col">
              {data.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="flex-shrink-0 w-full"
                  // style={{ minWidth: `${minColumnWidth}px` }}
                >
                  <p className="font-semibold text-[#003DA0] uppercase text-xs ">
                    {group.label}
                  </p>
                  <div>
                    {group.options.map((option, idx) => {
                      return (
                        <div
                          key={option.id_warehouse_custom}
                          className="flex items-center gap-2 py-2 rounded cursor-pointer hover:bg-blue-50 transition-colors px-2"
                          onClick={() => {
                            onChange(option);
                            setOpen(false);
                          }}
                        >
                          <div
                            className={twMerge(
                              "w-4 h-4 rounded-full border-2  flex items-center justify-center flex-shrink-0",
                              value === option.id_warehouse_custom
                                ? "border-[#0375F3]"
                                : "border-[#D0D5DD]"
                            )}
                          >
                            {value === option.id_warehouse_custom && (
                              <div className="w-2 h-2 rounded-full bg-[#0375F3]" />
                            )}
                          </div>
                          <div className="flex flex-col gap-2 w-full">
                            <span className="text-[#141522] text-xs font-normal">
                              {option.name_location}
                            </span>
                            <div className="flex gap-2 justify-between">
                              <div className="flex flex-col gap-1">
                                <span className="text-[#3276FA] text-xs font-normal">
                                  LOT: {option.lot}
                                </span>
                                <span className="text-[#3276FA] text-xs font-normal">
                                  Date: {option.expiration_date}
                                </span>
                              </div>
                              <span className="text-neutral-03 text-xs font-normal">
                                Tồn:{" "}
                                {formatNumber(Number(option.total_quantity))}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Customscrollbar>
        </div>
      )}
    </div>
  );
};

const InputNumberCustom = memo(
  ({
    state = 0,
    setState,
    className,
    classNameButton,
    classNameInput,
    min = 0,
    max = Infinity,
    disabled = false,
    isError = false,
  }) => {
    // Chỉ lưu số hoặc rỗng
    const [inputValue, setInputValue] = useState(state || 0);

    useEffect(() => {
      setInputValue(state || 0);
    }, [state]);

    // Chỉ nhận số hoặc rỗng
    const handleInputChange = useCallback(
      (e) => {
        if (disabled) return;
        const value = e.target.value;
        if (value === "") {
          setInputValue("");
          return;
        }
        // Chỉ lấy số, cho phép số thực
        const numericValue = value.replace(/[^0-9.]/g, "");
        if (numericValue === "") {
          setInputValue("");
          return;
        }
        setInputValue(Number(numericValue));
      },
      [disabled]
    );

    // Khi blur, cập nhật lại state cha và format lại
    const handleBlur = useCallback(() => {
      let number = inputValue === "" ? min : Number(inputValue);
      if (number < min) number = min;
      if (number > max) number = max;
      setInputValue(number);
      setState(number);
    }, [inputValue, min, max, setState]);

    // Cộng/trừ luôn dùng số
    const handleChange = useCallback(
      (type) => {
        if (disabled) return;
        let current = inputValue === "" ? min : Number(inputValue);
        let result = current;
        if (type === "increment" && current < max) result = current + 1;
        if (type === "decrement" && current > min) result = current - 1;
        setInputValue(result);
        setState(result);
      },
      [disabled, inputValue, max, min, setState]
    );

    // Khi click nút +/-
    const handleButtonClick = useCallback(
      (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        handleChange(type);
      },
      [handleChange]
    );

    return (
      <div
        className={twMerge(
          "p-2 flex items-center border rounded-full shadow-sm border-[#D0D5DD] w-fit h-fit overflow-hidden bg-white",
          disabled ? "opacity-50 cursor-not-allowed" : "",
          className
        )}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div
          onClick={(e) => handleButtonClick(e, "decrement")}
          onMouseDown={(e) => e.preventDefault()}
          className={twMerge(
            "size-9 rounded-full cursor-pointer bg-primary-05 flex justify-center items-center flex-row",
            classNameButton
          )}
        >
          <FaMinus className="text-[#25387A] hover:text-green-1" size={11} />
        </div>
        <input
          disabled={disabled}
          type="text"
          value={inputValue === "" ? "" : formatNumber(inputValue)}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onMouseDown={(e) => e.stopPropagation()}
          className={twMerge(
            "w-20 text-center outline-none text-lg font-normal text-[#1B1A18] bg-transparent",
            isError && inputValue > 0 ? "text-red-500" : "",
            classNameInput
          )}
        />
        <div
          onClick={(e) => handleButtonClick(e, "increment")}
          onMouseDown={(e) => e.preventDefault()}
          className={twMerge(
            "size-9 rounded-full cursor-pointer bg-primary-05 flex justify-center items-center flex-row",
            classNameButton
          )}
        >
          <FaPlus className="text-[#25387A] hover:text-green-1" size={10} />
        </div>
      </div>
    );
  }
);

const variantsContent = {
  open: { height: "auto", opacity: 1 },
  closed: { height: 0, opacity: 0 },
};

const CollapseRowWrapper = ({ isOpen, children }) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className=""
          initial="closed"
          animate="open"
          exit="closed"
          variants={variantsContent}
          transition={{ duration: 0.3 }}
        >
          <div>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SubProductRow = memo(
  ({
    id,
    isOpen,
    lot,
    date,
    quantity,
    typeOrigin,
    setLotRows,
    updateProductQuantity,
    index,
    warehouse,
    lastIndex,
    listWarehouses,
    total_quantity,
  }) => {
    const [selectedWarehouse, setSelectedWarehouse] = useState(warehouse ?? "");
    return (
      <tr key={id}>
        <td
          colSpan={12}
          // className="p-0 border-t border-[#F3F3F4] bg-[#EBF5FF] bg-opacity-50"
          className={twMerge(
            "p-0 !bg-[#EBF5FF80]",
            index === 0 && "border-t border-[#F3F3F4]",
            index === lastIndex && "border-b border-[#F3F3F4]"
          )}
        >
          <CollapseRowWrapper isOpen={isOpen}>
            <table className="w-full border-separate border-spacing-0">
              <tbody>
                {/* Dòng LOT 1 */}
                <tr>
                  <td className="py-2 px-3 text-center  w-[62px]"></td>
                  <td className="py-2 px-3 text-center w-[62px]"></td>
                  <td className="py-2 px-3 text-left ">
                    <div className=" flex gap-x-4 justify-between items-center">
                      {selectedWarehouse ? (
                        <div className="flex flex-row gap-x-2 text-[#3276FA] text-xs font-normal">
                          <p>LOT: {lot}</p>
                          <p>Date: {date}</p>
                        </div>
                      ) : (
                        <div className="text-xs font-normal text-[#991B1B] flex items-start gap-x-[2px]">
                          <IoIosAlert className="text-[#991B1B]" size={17} />
                          <p>
                            Vui lòng chọn kho hàng của NVL để tiến hành xuất
                            kho!
                          </p>
                        </div>
                      )}
                      <CustomDropdownRadioGroup
                        data={convertWarehousesToDropdownData(
                          listWarehouses || []
                        )}
                        value={selectedWarehouse}
                        onChange={(option) => {
                          setSelectedWarehouse(option.id_warehouse_custom);
                          setLotRows((prev) =>
                            prev.map((row) =>
                              row.id === id
                                ? {
                                    ...row,
                                    id: option.id_warehouse_custom,
                                    id_warehouse_custom: option.id_warehouse_custom,
                                    lot: option.lot,
                                    expiration_date: option.expiration_date,
                                    total_quantity: option.total_quantity,
                                    name_location: option.name_location,
                                  }
                                : row
                            )
                          );
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center w-[200px]">
                    <div className="flex  justify-start">
                      <InputNumberCustom
                        state={quantity}
                        setState={(value) =>
                          updateProductQuantity(index, value)
                        }
                        className="bg-white"
                        max={Number(total_quantity) || Infinity}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center w-[100px]">
                    <button
                      className={twMerge(
                        "text-gray-400 hover:text-red-600",
                        typeOrigin === "semi_products_outside" &&
                          "opacity-50 cursor-not-allowed hover:text-gray-400"
                      )}
                      onClick={() => {
                        if (typeOrigin === "semi_products_outside") return;
                        setLotRows((prev) =>
                          prev.filter((row) => row.id !== id)
                        );
                      }}
                      disabled={typeOrigin === "semi_products_outside"}
                    >
                      <CloseXIcon className="size-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </CollapseRowWrapper>
        </td>
      </tr>
    );
  }
);

const ProductRow = memo(
  ({
    product,
    index,
    updateProductQuantity,
    updateProductError,
    handleSelectProduct,
    handleAction,
    classNameButton,
    po_id,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [lotRows, setLotRows] = useState(
      product.warehouses.map((w) => ({
        ...w,
        id: w.id_warehouse_custom,
      }))
    );

    const handleAddLotRow = async () => {
      setIsOpen(true);
      try {
        const formData = new FormData();
        formData.append('type_item', product.type_item);
        formData.append('type_origin', product.type_origin);
        formData.append('item_variation_option_value_id', product.item_variation_option_value_id);
        formData.append('pp_id', product.pp_id);
        formData.append('po_id', po_id);
        const res = await apiProductionsOrders.apiGetWarehousesBOM(formData);
        const warehouses = res?.data?.warehouses || [];
        if (Array.isArray(warehouses) && warehouses.length > 0) {
          // Lấy item đầu tiên của kho đầu tiên (nếu có)
          const firstItem = warehouses[0]?.items[0];
          if (firstItem) {
            setLotRows(prev => [
              ...prev,
              {
                ...firstItem,
                id: firstItem.id_warehouse_custom,
                list_warehouses: warehouses, // truyền toàn bộ kho cho dropdown
              },
            ]);
          } else {
            setLotRows(prev => [
              ...prev,
              {
                id: Date.now(),
                lot: "",
                expiration_date: "",
                id_warehouse_custom: "",
                total_quantity: 0,
                quantity: 0,
                list_warehouses: warehouses,
              },
            ]);
          }
        } else {
          setLotRows(prev => [
            ...prev,
            {
              id: Date.now(),
              lot: "",
              expiration_date: "",
              id_warehouse_custom: "",
              total_quantity: 0,
              quantity: 0,
              list_warehouses: [],
            },
          ]);
        }
      } catch (err) {
        setLotRows(prev => [
          ...prev,
          {
            id: Date.now(),
            lot: "",
            expiration_date: "",
            id_warehouse_custom: "",
            total_quantity: 0,
            quantity: 0,
            list_warehouses: [],
          },
        ]);
      }
    };

    useEffect(() => {
      if (product.warehouses.length > 0) {
        setIsOpen(true);
      }
    }, [lotRows]);

    return (
      <>
        <tr className="hover:bg-gray-50">
          <td className="py-2 px-3 text-center w-[62px]">
            <CheckboxDefault
              checked={product.selected}
              onChange={(checked) => handleSelectProduct(index, checked)}
            />
          </td>
          <td className="py-2 px-3 text-center text-sm font-semibold w-[62px]">
            {index + 1}
          </td>
          <td className="py-2 px-3 text-left">
            <div className="flex gap-2">
              <div className="w-16 h-16 rounded flex items-center justify-center">
                <Image
                  src={product.images || "/icon/default/default.png"}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="object-cover rounded"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[#141522] truncate">
                  {product.item_name}
                </h3>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] font-normal text-[#667085]">
                    {product.product_variation}
                  </p>
                  <p className="text-xs font-normal text-typo-blue-2">
                    {product.item_code}
                  </p>
                </div>
              </div>
            </div>
          </td>
          <td className="py-2 px-3 text-center w-[200px]">
            <div className="flex  justify-center">
              <div className="text-start">
                <p className="text-[#EE1E1E] font-medium text-lg">
                  {formatNumber(Number(product.quantity_total_quota))}{" "}
                  <span className="text-[#141522] font-medium text-xs">/</span>
                </p>
                <span className="text-[#141522] text-xs font-medium">
                  {product.unit_name_primary}
                </span>
              </div>
            </div>
          </td>
          <td className="py-2 px-3 text-center w-[100px]">
            <div className="flex justify-center">
              <div
                onClick={handleAddLotRow}
                className={twMerge(
                  "min-h-[35px]  min-w-[35px] flex justify-center items-center flex-row rounded-full bg-[#EBF5FF] border border-transparent hover:border-[#1760B9] hover:bg-[#D0E8FF] hover:scale-110 transition-all duration-200 ease-out",
                  classNameButton
                )}
              >
                <FiPlus
                  className="text-[#003DA0] hover:text-green-1"
                  size={19}
                />
              </div>
            </div>
          </td>
        </tr>

        {/* subAddItem */}
        {lotRows.map((lot, index) => (
          <SubProductRow
            key={lot.id}
            id={lot.id}
            lot={lot.lot}
            date={lot.expiration_date}
            quantity={Number(lot.total_quantity)}
            warehouse={lot.id_warehouse_custom}
            isOpen={isOpen}
            index={index}
            setLotRows={setLotRows}
            listWarehouses={lot.list_warehouses ?? product.list_warehouses}
            updateProductQuantity={(i, value) =>
              setLotRows((prev) =>
                prev.map((row, j) =>
                  j === index ? { ...row, quantity: value } : row
                )
              )
            }
            lastIndex={lotRows.length - 1}
            typeOrigin={product.type_origin}
            total_quantity={Number(lot.total_quantity)}
          />
        ))}
      </>
    );
  }
);

const PopupExportMaterials = ({ code, onClose, id }) => {
  const { data } = useListExportProductionOrder(id);
  const [selectAll, setSelectAll] = useState(false);
  const [products, setProducts] = useState(data?.bom || []);
  const dataSeting = useSetingServer();

  useEffect(() => {
    if (data?.bom) {
      setProducts(data.bom);
    }
  }, [data]);
  
  const formatNumber = (number) => {
    return formatNumberConfig(+number, dataSeting);
  };

  const showToast = useToast();
  const handleSelectAll = useCallback((checked) => {
    setSelectAll(checked);
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        selected: checked,
      }))
    );
  }, []);

  const updateProductQuantity = useCallback(
    (index, value) => {
      if (value === 0) {
        showToast("error", "SL đạt không được phép bằng 0!");
        return;
      }

      setProducts((prevProducts) => {
        const updatedProducts = [...prevProducts];
        updatedProducts[index] = {
          ...updatedProducts[index],
          quantity_success: value,
        };
        return updatedProducts;
      });
    },
    [showToast]
  );

  const updateProductError = useCallback((index, value) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        error: value,
      };
      return updatedProducts;
    });
  }, []);

  const handleSelectProduct = useCallback((index, checked) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        selected: checked,
      };

      const allSelected = updatedProducts.every((product) => product.selected);
      setSelectAll(allSelected);

      return updatedProducts;
    });
  }, []);

  const handleAction = () => {};

  const selectedCount = useMemo(
    () => products.filter((product) => product.selected).length,
    [products]
  );
  const confirmButtonClass = useMemo(
    () =>
      `flex items-center gap-2 text-sm font-medium rounded-lg py-3 px-4 w-fit text-white ${
        selectedCount > 0 ? "bg-background-blue-2" : "bg-neutral-02"
      } `,
    [selectedCount]
  );

  const handleConfirm = () => {};

  return (
    <div
      className={`p-6 flex flex-col gap-6 rounded-3xl w-[90vw] xl:w-[1085px] max-h-[90vh] bg-neutral-00 ${deca.className}`}
    >
      <div className="flex gap-2 justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold capitalize">Xuất kho sản xuất</h2>
          <p className="text-base text-typo-blue-4">{code}</p>
        </div>
        <div className="flex gap-8 items-center">
          <button
            onClick={handleConfirm}
            //   disabled={selectedCount === 0 || isLoadingSubmit}
            className={confirmButtonClass}
          >
            <CheckIcon className="size-4" /> Xác nhận{" "}
            {selectedCount > 0 && `(${selectedCount})`}
          </button>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9, rotate: -90 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="size-6 shrink-0 text-neutral-02 cursor-pointer"
            onClick={onClose}
          >
            <CloseXIcon className="size-full" />
          </motion.div>
        </div>
      </div>
      {/* search */}
      <div class="flex gap-x-2 items-center w-full rounded-lg border border-[#D0D5DD] px-4 py-2 focus-within:border-transparent  focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          placeholder="Tìm kiếm"
          class="flex-1 border-none outline-none text-[#3A3E4C] placeholder-gray-200"
        />
        <button class="rounded-lg bg-[#1760B9] p-1 ">
          <MagnifyingGlassIcon className="size-4 text-white" />
        </button>
      </div>
      {/* table */}
      <div className=" overflow-hidden">
        <table className="min-w-full border-separate border-spacing-0  table-fixed ">
          <thead className="bg-white sticky top-0 z-10">
            <tr>
              <th className="py-2 px-3 border-b border-gray-200 text-center text-sm font-normal text-[#9295A4] w-[62px]">
                <Tooltip title="Chọn tất cả" position="bottom" arrow={true}>
                  <CheckboxDefault
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </Tooltip>
              </th>
              <th className="py-2 px-3 border-b border-gray-200 text-center text-sm font-normal text-[#9295A4] w-[62px]">
                STT
              </th>
              <th className="py-2 px-3 border-b border-gray-200 text-left text-sm font-normal text-[#9295A4]">
                Nguyên vật liệu
              </th>
              <th className="py-2 px-3 border-b border-gray-200 text-center text-sm font-normal text-[#9295A4] w-[200px]">
                Số lượng
              </th>
              <th className="py-2 px-3 border-b border-gray-200 text-center text-sm font-normal text-[#9295A4] w-[115px]">
                Thao tác
              </th>
            </tr>
          </thead>
        </table>
        <Customscrollbar className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <tbody>
              {products.map((product, index) => (
                <ProductRow
                  key={`product-row-${product.id || index}`}
                  product={product}
                  index={index}
                  updateProductQuantity={updateProductQuantity}
                  updateProductError={updateProductError}
                  handleSelectProduct={handleSelectProduct}
                  handleAction={handleAction}
                  po_id={id}
                />
              ))}
            </tbody>
          </table>
        </Customscrollbar>
      </div>
    </div>
  );
};

export default PopupExportMaterials;
