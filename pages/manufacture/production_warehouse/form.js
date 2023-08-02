import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { _ServerInstance as Axios } from "/services/axios";
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";
import Loading from "components/UI/loading";

import { MdClear } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";
import DatePicker from "react-datepicker";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import Select, { components, MenuListProps } from "react-select";

import {
  Add,
  Trash as IconDelete,
  Image as IconImage,
  MaximizeCircle,
  Minus,
  TableDocument,
} from "iconsax-react";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { NumericFormat } from "react-number-format";
import Link from "next/link";
import moment from "moment/moment";
import Popup from "reactjs-popup";
import { debounce } from "lodash";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const Index = (props) => {
  const router = useRouter();
  const id = router.query?.id;

  const dataLang = props?.dataLang;
  const scrollAreaRef = useRef(null);
  const handleMenuOpen = () => {
    const menuPortalTarget = scrollAreaRef.current;
    return { menuPortalTarget };
  };

  const [onFetching, sOnFetching] = useState(false);
  const [onFetchingDetail, sOnFetchingDetail] = useState(false);
  const [onFetchingCondition, sOnFetchingCondition] = useState(false);
  const [onFetchingItemsAll, sOnFetchingItemsAll] = useState(false);

  const [onFetchingWarehouser, sOnFetchingWarehouse] = useState(false);
  const [onFetchingUnit, sOnFetchingUnit] = useState(false);
  const [onLoading, sOnLoading] = useState(false);
  const [onLoadingChild, sOnLoadingChild] = useState(false);

  const [onSending, sOnSending] = useState(false);
  const [thuetong, sThuetong] = useState();
  const [chietkhautong, sChietkhautong] = useState(0);
  const [code, sCode] = useState("");
  const [startDate, sStartDate] = useState(new Date());
  const [effectiveDate, sEffectiveDate] = useState(null);

  const [note, sNote] = useState("");
  const [date, sDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
  const [dataSupplier, sDataSupplier] = useState([]);
  const [data_Treatmentr, sData_Treatmentr] = useState([]);
  const [dataBranch, sDataBranch] = useState([]);
  const [dataItems, sDataItems] = useState([]);
  const [warehouse, sDataWarehouse] = useState([]);
  const [dataUnit, sDataWareUnit] = useState([]);
  const [dataTasxes, sDataTasxes] = useState([]);

  const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
  const [dataProductExpiry, sDataProductExpiry] = useState({});
  const [dataProductSerial, sDataProductSerial] = useState({});
  //new
  const [listData, sListData] = useState([]);
  const [idParen, sIdParent] = useState(null);
  const [qtyHouse, sQtyHouse] = useState(null);
  const [survive, sSurvive] = useState(null);

  const [idTreatment, sIdTreatment] = useState(null);
  const [idBranch, sIdBranch] = useState(null);
  const [load, sLoad] = useState(false);

  const [errSupplier, sErrSupplier] = useState(false);
  const [errDate, sErrDate] = useState(false);
  const [errDateList, sErrDateList] = useState(false);
  const [errTreatment, sErrTreatment] = useState(false);
  const [errBranch, sErrBranch] = useState(false);
  const [errWarehouse, sErrWarehouse] = useState(false);
  const [errUnit, sErrUnit] = useState(false);
  const [errQty, sErrQty] = useState(false);
  const [errSurvive, sErrSurvive] = useState(false);
  const [errLot, sErrLot] = useState(false);
  const [errSerial, sErrSerial] = useState(false);
  const [khotong, sKhotong] = useState(null);

  useEffect(() => {
    router.query && sErrDate(false);
    router.query && sErrSupplier(false);
    router.query && sErrTreatment(false);
    router.query && sErrBranch(false);
    router.query && sErrSerial(false);
    router.query && sErrLot(false);
    router.query && sErrDateList(false);
    router.query && sStartDate(new Date());
    router.query && sNote("");
  }, [router.query]);

  const _ServerFetching = () => {
    sOnLoading(true);
    Axios(
      "GET",
      "/api_web/Api_Branch/branchCombobox/?csrf_protection=true",
      {},
      (err, response) => {
        if (!err) {
          var { isSuccess, result } = response.data;
          sDataBranch(result?.map((e) => ({ label: e.name, value: e.id })));
          sOnLoading(false);
        }
      }
    );

    // Axios(
    //   "GET",
    //   "/api_web/Api_return_supplier/treatment_methods/?csrf_protection=true",
    //   {},
    //   (err, response) => {
    //     if (!err) {
    //       var data = response.data;
    //       sData_Treatmentr(
    //         data?.map((e) => ({ label: dataLang[e?.name], value: e?.id }))
    //       );
    //       sOnLoading(false);
    //     }
    //   }
    // );

    sOnFetching(false);
  };

  useEffect(() => {
    onFetching && _ServerFetching();
  }, [onFetching]);

  const _ServerFetchingCondition = () => {
    Axios(
      "GET",
      "/api_web/api_setting/feature/?csrf_protection=true",
      {},
      (err, response) => {
        if (!err) {
          var data = response.data;
          sDataMaterialExpiry(data.find((x) => x.code == "material_expiry"));
          sDataProductExpiry(data.find((x) => x.code == "product_expiry"));
          sDataProductSerial(data.find((x) => x.code == "product_serial"));
        }
        sOnFetchingCondition(false);
      }
    );
  };

  useEffect(() => {
    onFetchingCondition && _ServerFetchingCondition();
  }, [onFetchingCondition]);

  useEffect(() => {
    id && sOnFetchingCondition(true);
  }, []);

  useEffect(() => {
    JSON.stringify(dataMaterialExpiry) === "{}" &&
      JSON.stringify(dataProductExpiry) === "{}" &&
      JSON.stringify(dataProductSerial) === "{}" &&
      sOnFetchingCondition(true);
  }, [
    JSON.stringify(dataMaterialExpiry) === "{}",
    JSON.stringify(dataProductExpiry) === "{}",
    JSON.stringify(dataProductSerial) === "{}",
  ]);

  const options = dataItems?.map((e) => ({
    label: `${e.name}
     <span style={{display: none}}>${e.code}</span>
     <span style={{display: none}}>${e.product_variation} </span>
     <span style={{display: none}}>${e.serial} </span>
     <span style={{display: none}}>${e.lot} </span>
     <span style={{display: none}}>${e.expiration_date} </span>
     <span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
    value: e.id,
    e,
  }));
  const _ServerFetchingDetailPage = () => {
    Axios(
      "GET",
      `/api_web/Api_return_supplier/getDetail/${id}?csrf_protection=true`,
      {},
      (err, response) => {
        if (!err) {
          var rResult = response.data;
          sListData(
            rResult?.items.map((e) => ({
              id: e?.item?.id,
              matHang: {
                e: e?.item,
                label: `${e.item?.name} <span style={{display: none}}>${
                  e.item?.code +
                  e.item?.product_variation +
                  e.item?.text_type +
                  e.item?.unit_name
                }</span>`,
                value: e.item?.id,
              },
              child: e?.child.map((ce) => ({
                id: Number(ce?.id),
                disabledDate:
                  (e.item?.text_type == "material" &&
                    dataMaterialExpiry?.is_enable == "1" &&
                    false) ||
                  (e.item?.text_type == "material" &&
                    dataMaterialExpiry?.is_enable == "0" &&
                    true) ||
                  (e.item?.text_type == "products" &&
                    dataProductExpiry?.is_enable == "1" &&
                    false) ||
                  (e.item?.text_type == "products" &&
                    dataProductExpiry?.is_enable == "0" &&
                    true),
                kho: {
                  label: ce?.location_name,
                  value: ce?.location_warehouses_id,
                  warehouse_name: ce?.warehouse_name,
                  qty: ce?.quantity_warehouse,
                },
                serial: ce?.serial == null ? "" : ce?.serial,
                soluongcl: Number(e?.item?.quantity_left),
                soluongdt: Number(e?.item?.quantity_returned),
                soluongdn: Number(e?.item?.quantity_create),
                lot: ce?.lot == null ? "" : ce?.lot,
                date:
                  ce?.expiration_date != null
                    ? moment(ce?.expiration_date).toDate()
                    : null,
                donViTinh: e?.item?.unit_name,
                amount: Number(ce?.quantity),
                price: Number(ce?.price),
                chietKhau: Number(ce?.discount_percent),
                tax: {
                  tax_rate: ce?.tax_rate,
                  value: ce?.tax_id,
                  label: ce?.tax_name,
                },
                note: ce?.note,
              })),
            }))
          );

          const checkQty = rResult?.items
            ?.map((e) => e?.item)
            .reduce((obj, e) => {
              obj.id = e?.id;
              obj.qty = Number(e?.quantity_left);
              return obj;
            }, {});
          sIdParent(checkQty?.id);
          sQtyHouse(checkQty?.qty);
          sCode(rResult?.code);
          sIdBranch({ label: rResult?.branch_name, value: rResult?.branch_id });

          sIdTreatment({
            label: dataLang[rResult?.treatment_methods_name],
            value: rResult?.treatment_methods,
          });
          sStartDate(moment(rResult?.date).toDate());
          sNote(rResult?.note);
        }
        sOnFetchingDetail(false);
      }
    );
  };

  useEffect(() => {
    //new
    onFetchingDetail && _ServerFetchingDetailPage();
  }, [onFetchingDetail]);

  useEffect(() => {
    id &&
      JSON.stringify(dataMaterialExpiry) !== "{}" &&
      JSON.stringify(dataProductExpiry) !== "{}" &&
      JSON.stringify(dataProductSerial) !== "{}" &&
      sOnFetchingDetail(true);
  }, [
    JSON.stringify(dataMaterialExpiry) !== "{}" &&
      JSON.stringify(dataProductExpiry) !== "{}" &&
      JSON.stringify(dataProductSerial) !== "{}",
  ]);

  const _ServerFetching_ItemsAll = () => {
    Axios(
      "GET",
      "/api_web/Api_stock/getSemiItems/?csrf_protection=true",
      {
        params: {
          "filter[branch_id]": idBranch ? idBranch?.value : null,
        },
      },
      (err, response) => {
        if (!err) {
          var { result } = response.data.data;
          sDataItems(result);
        }
      }
    );
    sOnFetchingItemsAll(false);
  };

  const _HandleChangeInput = (type, value) => {
    if (type == "code") {
      sCode(value.target.value);
    } else if (type === "date") {
      sDate(moment(value.target.value).format("YYYY-MM-DD HH:mm:ss"));
    } else if (type === "treatment") {
      sIdTreatment(value);
    } else if (type === "note") {
      sNote(value.target.value);
    } else if (type == "branch" && idBranch != value) {
      if (listData?.length > 0) {
        if (type === "branch" && idBranch != value) {
          Swal.fire({
            title: `${
              dataLang?.returns_err_DeleteItem || "returns_err_DeleteItem"
            }`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${dataLang?.aler_yes}`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
          }).then((result) => {
            if (result.isConfirmed) {
              sDataItems([]);
              sDataWarehouse([]);
              sListData([]);
              sIdBranch(value);
            } else {
              sIdBranch({ ...idBranch });
            }
          });
        }
      } else {
        sIdBranch(value);
        sKhotong(null);
        if (value == null) {
          sDataSupplier([]);
        }
      }
    }
  };
  const handleClearDate = (type) => {
    if (type === "effectiveDate") {
      sEffectiveDate(null);
    }
    if (type === "startDate") {
      sStartDate(new Date());
    }
  };
  const handleTimeChange = (date) => {
    sStartDate(date);
  };

  const _HandleSubmit = (e) => {
    e.preventDefault();
    const hasNullKho = listData.some((item) =>
      item.child?.some((childItem) => childItem.kho === null)
    );
    const hasNullUnit = listData.some((item) =>
      item.child?.some((childItem) => childItem.donViTinh === null)
    );
    const hasNullQty = listData.some((item) =>
      item.child?.some(
        (childItem) =>
          childItem.soluongxuat === null ||
          childItem.soluongxuat === "" ||
          childItem.soluongxuat == 0
      )
    );
    const isTotalExceeded = listData?.some(
      (e) =>
        !hasNullKho &&
        e.child?.some((opt) => {
          const amount = parseFloat(opt?.amount) || 0;
          const qty = parseFloat(opt?.kho?.qty) || 0;
          return amount > qty;
        })
    );

    const isEmpty = listData?.length === 0 ? true : false;
    if (
      idBranch == null ||
      hasNullKho ||
      hasNullUnit ||
      hasNullQty ||
      // isTotalExceeded ||
      isEmpty
    ) {
      idBranch == null && sErrBranch(true);
      hasNullKho && sErrWarehouse(true);
      hasNullUnit && sErrUnit(true);
      hasNullQty && sErrQty(true);
      if (isEmpty) {
        Toast.fire({
          icon: "error",
          title: `Chưa nhập thông tin mặt hàng`,
        });
      }
      // else if (isTotalExceeded) {
      //   sErrSurvive(true);
      //   Toast.fire({
      //     icon: "error",
      //     title: `${
      //       dataLang?.returns_err_QtyNotQexceed || "returns_err_QtyNotQexceed"
      //     }`,
      //   });
      // }
      else {
        Toast.fire({
          icon: "error",
          title: `${dataLang?.required_field_null}`,
        });
      }
    } else {
      sErrSurvive(false);
      sErrWarehouse(false);
      sErrUnit(false);
      sErrQty(false);
      sOnSending(true);
    }
  };
  useEffect(() => {
    sErrDate(false);
  }, [date != null]);

  useEffect(() => {
    sErrBranch(false);
  }, [idBranch != null]);

  useEffect(() => {
    sErrTreatment(false);
  }, [idTreatment != null]);

  const _ServerFetching_Warehouse = () => {
    sOnLoadingChild(true);
    Axios(
      "GET",
      `/api_web/Api_stock/quantityStock/${idParen}?csrf_protection=true`,
      {
        params: {
          "filter[branch_id]": idBranch?.value,
        },
      },
      (err, response) => {
        if (!err) {
          var result = response.data;
          sDataWarehouse(
            result?.map((e) => ({
              label: e?.name,
              value: e?.id,
              warehouse_name: e?.warehouse_name,
              qty: e?.quantity,
            }))
          );
          sOnLoadingChild(false);
        }
      }
    );
    sOnFetchingWarehouse(false);
  };
  const _ServerFetching_Unit = () => {
    sOnLoadingChild(true);
    Axios(
      "GET",
      `/api_web/Api_stock/itemUnit/${idParen}?csrf_protection=true`,
      {},
      (err, response) => {
        if (!err) {
          var result = response.data;
          sDataWareUnit(
            result?.map((e) => ({
              label: e?.unit,
              value: e?.unit_id,
              coefficient: e?.coefficient,
            }))
          );
          sOnLoadingChild(false);
        }
      }
    );
    sOnFetchingUnit(false);
  };

  useEffect(() => {
    router.query && sOnFetching(true);
  }, [router.query]);

  useEffect(() => {
    onFetchingWarehouser && _ServerFetching_Warehouse();
  }, [onFetchingWarehouser]);
  useEffect(() => {
    onFetchingUnit && _ServerFetching_Unit();
  }, [onFetchingUnit]);

  useEffect(() => {
    idParen != null && sOnFetchingWarehouse(true);
    idParen != null && sOnFetchingUnit(true);
  }, [idParen]);

  useEffect(() => {
    onFetchingItemsAll && _ServerFetching_ItemsAll();
  }, [onFetchingItemsAll]);

  useEffect(() => {
    idBranch != null && sOnFetchingItemsAll(true);
  }, [idBranch]);

  const formatNumber = (number) => {
    const integerPart = Math.floor(number);
    return integerPart.toLocaleString("en");
  };

  const _ServerSending = () => {
    var formData = new FormData();
    formData.append("code", code);
    formData.append("date", moment(startDate).format("YYYY-MM-DD HH:mm:ss"));
    formData.append("branch_id", idBranch?.value);
    formData.append("note", note);
    listData.forEach((item, index) => {
      formData.append(`items[${index}][id]`, item?.id);
      formData.append(`items[${index}][item]`, item?.matHang?.value);
      item?.child?.forEach((childItem, childIndex) => {
        console.log("ghgigi", childItem);
        formData.append(
          `items[${index}][child][${childIndex}][id]`,
          childItem?.id
        );
        {
          id &&
            formData.append(
              `items[${index}][child][${childIndex}][row_id]`,
              typeof childItem?.id == "number" ? childItem?.id : 0
            );
        }
        formData.append(
          `items[${index}][child][${childIndex}][unit]`,
          childItem?.donViTinh[0].value
        );
        formData.append(
          `items[${index}][child][${childIndex}][note]`,
          childItem?.note ? childItem?.note : ""
        );
        formData.append(
          `items[${index}][child][${childIndex}][location_warehouses_id]`,
          childItem?.kho?.value
        );
        formData.append(
          `items[${index}][child][${childIndex}][quantity]`,
          childItem?.soluongxuat
        );
      });
    });
    Axios(
      "POST",
      `${
        id
          ? `/api_web/Api_stock/exportProduction/?csrf_protection=true`
          : `/api_web/Api_stock/exportProduction/?csrf_protection=true`
      }`,
      {
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      },
      (err, response) => {
        if (!err) {
          var { isSuccess, message } = response.data;
          if (isSuccess) {
            Toast.fire({
              icon: "success",
              title: `${dataLang[message]}`,
            });
            sCode("");
            sStartDate(new Date());

            sIdBranch(null);
            sIdTreatment(null);
            sNote("");
            sErrBranch(false);
            sErrDate(false);
            //new
            sListData([]);
            router.push("/manufacture/production_warehouse?tab=all");
          } else {
            Toast.fire({
              icon: "error",
              title: `${dataLang[message]}`,
            });
          }
        }
        sOnSending(false);
      }
    );
  };

  useEffect(() => {
    onSending && _ServerSending();
  }, [onSending]);

  //new
  const _HandleAddChild = (parentId, value) => {
    const newData = listData?.map((e) => {
      if (e?.id === parentId) {
        sQtyHouse(value?.e?.quantity_left);
        const newChild = {
          id: uuidv4(),
          disabledDate:
            (value?.e?.text_type === "material" &&
              dataMaterialExpiry?.is_enable === "1" &&
              false) ||
            (value?.e?.text_type === "material" &&
              dataMaterialExpiry?.is_enable === "0" &&
              true) ||
            (value?.e?.text_type === "products" &&
              dataProductExpiry?.is_enable === "1" &&
              false) ||
            (value?.e?.text_type === "products" &&
              dataProductExpiry?.is_enable === "0" &&
              true),
          soluongcl: Number(value?.e?.quantity_left),
          soluongdt: Number(value?.e?.quantity_returned),
          soluongdn: Number(value?.e?.quantity_create),
          kho: null,
          donViTinh: null,
          dataWarehouse: value?.e?.warehouse.map((e) => ({
            label: e?.name,
            value: e?.id,
            warehouse_name: e?.warehouse_name,
            qty: e?.quantity,
          })),
          dataUnit: value?.e?.unit.map((e) => ({
            label: e?.unit,
            value: e?.id,
            coefficient: e?.coefficient,
          })),
          soluongxuat: null,
          giatriquydoi: null,
          soluongquydoi: null,
          amount: null,
          note: value?.e?.note,
        };

        return { ...e, child: [...e.child, newChild] };
      } else {
        return e;
      }
    });
    sListData(newData);
  };

  const _HandleAddParent = (value) => {
    const checkData = listData?.some((e) => e?.matHang?.value === value?.value);
    if (!checkData) {
      sIdParent(value?.value);
      sQtyHouse(value?.e?.quantity_left);
      const newData = {
        id: Date.now(),
        matHang: value,
        child: [
          {
            id: uuidv4(),
            disabledDate:
              (value?.e?.text_type === "material" &&
                dataMaterialExpiry?.is_enable === "1" &&
                false) ||
              (value?.e?.text_type === "material" &&
                dataMaterialExpiry?.is_enable === "0" &&
                true) ||
              (value?.e?.text_type === "products" &&
                dataProductExpiry?.is_enable === "1" &&
                false) ||
              (value?.e?.text_type === "products" &&
                dataProductExpiry?.is_enable === "0" &&
                true),
            kho: null,
            dataWarehouse: value?.e?.warehouse.map((e) => ({
              label: e?.name,
              value: e?.id,
              warehouse_name: e?.warehouse_name,
              qty: e?.quantity,
            })),
            // donViTinh: null,
            donViTinh: [
              {
                label: value?.e?.unit[0].unit,
                value: value?.e?.unit[0].id,
                coefficient: value?.e?.unit[0].coefficient,
              },
            ],
            dataUnit: value?.e?.unit.map((e) => ({
              label: e?.unit,
              value: e?.id,
              coefficient: e?.coefficient,
            })),
            soluongcl: Number(value?.e?.quantity_left),
            soluongdt: Number(value?.e?.quantity_returned),
            soluongdn: Number(value?.e?.quantity_create),
            soluongxuat: null,
            giatriquydoi: value?.e?.unit[0].coefficient,
            soluongquydoi: null,
            amount: Number(value?.e?.quantity_left),
            note: value?.e?.note,
          },
        ],
      };
      sListData([newData, ...listData]);
    } else {
      Toast.fire({
        title: `${
          dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"
        }`,
        icon: "error",
      });
    }
  };
  const _HandleDeleteChild = (parentId, childId) => {
    const newData = listData
      .map((e) => {
        if (e.id === parentId) {
          const newChild = e.child?.filter((ce) => ce?.id !== childId);
          return { ...e, child: newChild };
        }
        return e;
      })
      .filter((e) => e.child?.length > 0);
    sListData([...newData]);
  };

  const _HandleDeleteAllChild = (parentId) => {
    const newData = listData
      .map((e) => {
        if (e.id === parentId) {
          const newChild = e.child?.filter((ce) => ce?.kho !== null);
          return { ...e, child: newChild };
        }
        return e;
      })
      .filter((e) => e.child?.length > 0);
    sListData([...newData]);
  };

  const _HandleChangeChild = (parentId, childId, type, value) => {
    let newData = [...listData];
    newData = newData.map((e) => {
      if (e?.id === parentId) {
        const newChild = e.child?.map((ce) => {
          if (ce?.id === childId) {
            if (type === "soluongxuat") {
              const newSoluongxuat = Number(value?.value);
              const newSoluongquydoi =
                newSoluongxuat * Number(ce?.giatriquydoi);
              if (newSoluongquydoi > +ce?.kho?.qty) {
                handleQuantityError(ce?.kho?.qty);
                setTimeout(() => {
                  sLoad(true);
                }, 500);
                setTimeout(() => {
                  sLoad(false);
                }, 1000);
                return { ...ce, soluongxuat: null, soluongquydoi: null };
              } else {
                sLoad(false);
                return {
                  ...ce,
                  soluongxuat: newSoluongxuat,
                  soluongquydoi: newSoluongquydoi,
                };
              }
            } else if (type === "kho") {
              const checkKho = e?.child
                ?.map((house) => house)
                ?.some((i) => i?.kho?.value === value?.value);
              sSurvive(Number(value?.qty));
              sErrSurvive(false);
              if (checkKho) {
                handleKhoError();
                return { ...ce };
              } else {
                return { ...ce, kho: value };
              }
            } else if (type === "donViTinh") {
              return {
                ...ce,
                donViTinh: value,
                giatriquydoi: Number(value?.coefficient),
              };
            } else if (type === "note") {
              return { ...ce, note: value?.target.value };
            }
          }
          return ce;
        });
        return { ...e, child: newChild };
      } else {
        return e;
      }
    });
    sListData(newData);
    // sListData([...newData]);
  };

  const handleQuantityError = (e) => {
    Toast.fire({
      title: `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
        e
      )} số lượng tồn kho`,
      icon: "error",
      confirmButtonColor: "#296dc1",
      cancelButtonColor: "#d33",
      confirmButtonText: dataLang?.aler_yes,
      timer: 3000,
    });
    setTimeout(() => {
      sLoad(true);
    }, 500);
    setTimeout(() => {
      sLoad(false);
    }, 1000);
  };

  const handleKhoError = () => {
    Toast.fire({
      title: `${"Kho xuất và vị trí xuất đã được chọn"}`,
      icon: "error",
    });
  };

  const _HandleChangeValue = (parentId, value) => {
    const checkData = listData?.some((e) => e?.matHang?.value === value?.value);
    if (!checkData) {
      sIdParent(value?.value);
      const newData = listData?.map((e) => {
        if (e?.id === parentId) {
          return {
            ...e,
            matHang: value,
            child: [
              {
                id: uuidv4(),
                kho: khotong ? khotong : null,
                dataWarehouse: value?.e?.warehouse.map((e) => ({
                  label: e?.name,
                  value: e?.id,
                  warehouse_name: e?.warehouse_name,
                  qty: e?.quantity,
                })),
                disabledDate:
                  (value?.e?.text_type === "material" &&
                    dataMaterialExpiry?.is_enable === "1" &&
                    false) ||
                  (value?.e?.text_type === "material" &&
                    dataMaterialExpiry?.is_enable === "0" &&
                    true) ||
                  (value?.e?.text_type === "products" &&
                    dataProductExpiry?.is_enable === "1" &&
                    false) ||
                  (value?.e?.text_type === "products" &&
                    dataProductExpiry?.is_enable === "0" &&
                    true),
                // donViTinh: null,
                donViTinh: [
                  {
                    label: value?.e?.unit[0].unit,
                    value: value?.e?.unit[0].id,
                    coefficient: value?.e?.unit[0].coefficient,
                  },
                ],
                dataUnit: value?.e?.unit.map((e) => ({
                  label: e?.unit,
                  value: e?.id,
                  coefficient: e?.coefficient,
                })),
                amount: Number(value?.e?.quantity_create),
                soluongcl: Number(value?.e?.quantity_left),
                soluongdt: Number(value?.e?.quantity_returned),
                soluongdn: Number(value?.e?.quantity_create),
                soluongxuat: null,
                giatriquydoi: value?.e?.unit[0].coefficient,
                soluongquydoi: null,
                note: value?.e?.note,
              },
            ],
          };
        } else {
          return e;
        }
      });
      sListData([...newData]);
    } else {
      Toast.fire({
        title: `${
          dataLang?.returns_err_ItemSelect || "returns_err_ItemSelect"
        }`,
        icon: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>
          {id
            ? dataLang?.returns_title_edit || "returns_title_edit"
            : "Thêm mới xuất kho"}
        </title>
      </Head>
      <div className="xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 flex flex-col justify-between">
        <div className="h-[97%] space-y-3 overflow-hidden">
          <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
            <h6 className="text-[#141522]/40">{"Xuất kho"}</h6>
            <span className="text-[#141522]/40">/</span>
            <h6>
              {id
                ? dataLang?.returns_title_edit || "returns_title_edit"
                : "Thêm mới xuất kho"}
            </h6>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="xl:text-2xl text-xl ">{"Xuất kho sản xuất"}</h2>
            <div className="flex justify-end items-center">
              <button
                onClick={() => router.push("/manufacture/production_warehouse")}
                className="xl:text-sm text-xs xl:px-5 px-3 hover:bg-blue-500 hover:text-white transition-all ease-in-out xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
              >
                {dataLang?.import_comeback || "import_comeback"}
              </button>
            </div>
          </div>

          <div className=" w-full rounded">
            <div className="">
              <h2 className="font-normal bg-[#ECF0F4] p-2">
                {dataLang?.purchase_order_detail_general_informatione ||
                  "purchase_order_detail_general_informatione"}
              </h2>
              <div className="grid grid-cols-8  gap-3 items-center mt-2">
                <div className="col-span-2">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.import_code_vouchers || "import_code_vouchers"}{" "}
                  </label>
                  <input
                    value={code}
                    onChange={_HandleChangeInput.bind(this, "code")}
                    name="fname"
                    type="text"
                    placeholder={
                      dataLang?.purchase_order_system_default ||
                      "purchase_order_system_default"
                    }
                    className={`focus:border-[#92BFF7] border-[#d0d5dd]  placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal   p-2 border outline-none`}
                  />
                </div>
                <div className="col-span-2 relative">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.import_day_vouchers || "import_day_vouchers"}
                  </label>
                  <div className="custom-date-picker flex flex-row">
                    <DatePicker
                      blur
                      fixedHeight
                      showTimeSelect
                      selected={startDate}
                      onSelect={(date) => sStartDate(date)}
                      onChange={(e) => handleTimeChange(e)}
                      placeholderText="DD/MM/YYYY HH:mm:ss"
                      dateFormat="dd/MM/yyyy h:mm:ss aa"
                      timeInputLabel={"Time: "}
                      placeholder={
                        dataLang?.price_quote_system_default ||
                        "price_quote_system_default"
                      }
                      className={`border ${
                        errDate
                          ? "border-red-500"
                          : "focus:border-[#92BFF7] border-[#d0d5dd]"
                      } placeholder:text-slate-300 w-full z-[999] bg-[#ffffff] rounded text-[#52575E] font-normal p-2 outline-none cursor-pointer `}
                    />
                    {startDate && (
                      <>
                        <MdClear
                          className="absolute right-0 -translate-x-[320%] translate-y-[1%] h-10 text-[#CCCCCC] hover:text-[#999999] scale-110 cursor-pointer"
                          onClick={() => handleClearDate("startDate")}
                        />
                      </>
                    )}
                    <BsCalendarEvent className="absolute right-0 -translate-x-[75%] translate-y-[70%] text-[#CCCCCC] scale-110 cursor-pointer" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {dataLang?.import_branch || "import_branch"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={dataBranch}
                    onChange={_HandleChangeInput.bind(this, "branch")}
                    value={idBranch}
                    isLoading={idBranch != null ? false : onLoading}
                    isClearable={true}
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    placeholder={dataLang?.import_branch || "import_branch"}
                    noOptionsMessage={() =>
                      dataLang?.returns_nodata || "returns_nodata"
                    }
                    className={`${
                      errBranch ? "border-red-500" : "border-transparent"
                    } placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                    isSearchable={true}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      outline: "none",
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#EBF5FF",
                        primary50: "#92BFF7",
                        primary: "#0F4F9E",
                      },
                    })}
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: "#cbd5e1",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999, // Giá trị z-index tùy chỉnh
                      }),
                      control: (base, state) => ({
                        ...base,
                        boxShadow: "none",
                        padding: "2.7px",
                        ...(state.isFocused && {
                          border: "0 0 0 1px #92BFF7",
                        }),
                      }),
                    }}
                  />
                  {errBranch && (
                    <label className="text-sm text-red-500">
                      {dataLang?.purchase_order_errBranch ||
                        "purchase_order_errBranch"}
                    </label>
                  )}
                </div>
                <div className="col-span-2 ">
                  <label className="text-[#344054] font-normal text-sm mb-1 ">
                    {"Số lệnh sản xuất chi tiết"}
                  </label>
                  <Select
                    options={[]}
                    onChange={_HandleChangeInput.bind(this, "treatment")}
                    isLoading={idBranch != null ? false : onLoading}
                    value={idTreatment}
                    isClearable={true}
                    noOptionsMessage={() =>
                      dataLang?.returns_nodata || "returns_nodata"
                    }
                    closeMenuOnSelect={true}
                    hideSelectedOptions={false}
                    placeholder={"Số lệnh sản xuất chi tiết"}
                    className={`${"border-transparent"} placeholder:text-slate-300 w-full z-20 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                    isSearchable={true}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      outline: "none",
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#EBF5FF",
                        primary50: "#92BFF7",
                        primary: "#0F4F9E",
                      },
                    })}
                    styles={{
                      placeholder: (base) => ({
                        ...base,
                        color: "#cbd5e1",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999, // Giá trị z-index tùy chỉnh
                      }),
                      control: (base, state) => ({
                        ...base,
                        boxShadow: "none",
                        padding: "2.7px",
                        ...(state.isFocused && {
                          border: "0 0 0 1px #92BFF7",
                        }),
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" bg-[#ECF0F4] p-2 grid  grid-cols-12">
            <div className="font-normal col-span-12">
              {dataLang?.import_item_information || "import_item_information"}
            </div>
          </div>
          <div className="grid grid-cols-12 items-center  sticky top-0  bg-[#F7F8F9] py-2 z-10">
            <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-3 text-center truncate font-[400]">
              {dataLang?.import_from_items || "import_from_items"}
            </h4>
            <div className="col-span-9">
              <div className="grid grid-cols-7">
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1   text-center  truncate font-[400]">
                  {"Kho xuất - Vị trí xuất"}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {"ĐVT"}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {"Số lượng xuất"}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {"Giá trị quy đổi"}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {"Số lượng quy đổi"}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center  truncate font-[400]">
                  {"Ghi chú"}
                </h4>
                <h4 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] px-2  text-[#667085] uppercase  col-span-1    text-center    truncate font-[400]">
                  {dataLang?.import_from_operation || "import_from_operation"}
                </h4>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 items-center gap-1 py-2">
            <div className="col-span-3">
              <Select
                options={options}
                value={null}
                onChange={_HandleAddParent.bind(this)}
                className="col-span-2 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                placeholder={dataLang?.returns_items || "returns_items"}
                noOptionsMessage={() =>
                  dataLang?.returns_nodata || "returns_nodata"
                }
                menuPortalTarget={document.body}
                formatOptionLabel={(option) => (
                  <div className="py-2">
                    <div className="flex items-center ">
                      <div className="w-[40px] h-[50px]">
                        {option.e?.images != null ? (
                          <img
                            src={option.e?.images}
                            alt="Product Image"
                            className="max-w-[40px] h-[50px] text-[8px] object-cover rounded"
                          />
                        ) : (
                          <div className=" w-[40px] h-[50px] object-cover  flex items-center justify-center rounded">
                            <img
                              src="/no_img.png"
                              alt="Product Image"
                              className="w-[30px] h-[30px] object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                          {option.e?.name}
                        </h3>
                        <div className="flex gap-2">
                          <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                            {option.e?.code}
                          </h5>
                          <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                            {option.e?.product_variation}
                          </h5>
                        </div>
                        <div className="flex items-center gap-1">
                          <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                            {option.e?.import_code}
                          </h5>
                          <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                            {dataLang[option.e?.text_type]}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 italic">
                      {dataProductSerial.is_enable === "1" && (
                        <div className="text-[11px] text-[#667085] font-[500]">
                          Serial: {option.e?.serial ? option.e?.serial : "-"}
                        </div>
                      )}
                      {dataMaterialExpiry.is_enable === "1" ||
                      dataProductExpiry.is_enable === "1" ? (
                        <>
                          <div className="text-[11px] text-[#667085] font-[500]">
                            Lot: {option.e?.lot ? option.e?.lot : "-"}
                          </div>
                          <div className="text-[11px] text-[#667085] font-[500]">
                            Date:{" "}
                            {option.e?.expiration_date
                              ? moment(option.e?.expiration_date).format(
                                  "DD/MM/YYYY"
                                )
                              : "-"}
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
                style={{ border: "none", boxShadow: "none", outline: "none" }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#EBF5FF",
                    primary50: "#92BFF7",
                    primary: "#0F4F9E",
                  },
                })}
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    color: "#cbd5e1",
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                  control: (base, state) => ({
                    ...base,
                    ...(state.isFocused && {
                      border: "0 0 0 1px #92BFF7",
                      boxShadow: "none",
                    }),
                  }),
                  menu: (provided, state) => ({
                    ...provided,
                    width: "100%",
                  }),
                }}
              />
            </div>
            <div className="col-span-9">
              <div className="grid grid-cols-7  divide-x border-t border-b border-r border-l">
                <div className="col-span-1">
                  {" "}
                  <Select
                    classNamePrefix="customDropdowDefault"
                    placeholder={"Kho xuất - Vị trí xuất"}
                    className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                    isDisabled={true}
                  />
                </div>
                <div className="col-span-1">
                  <Select
                    classNamePrefix="customDropdowDefault"
                    placeholder={"Đơn vị tính"}
                    className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]"
                    isDisabled={true}
                  />
                </div>
                <input
                  placeholder={"Số lượng sản xuất"}
                  disabled
                  className=" disabled:bg-gray-50 text-center col-span-1 placeholder:text-slate-300 w-full bg-[#ffffff] 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  p-1.5 "
                />
                <div className="col-span-1 text-right 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black flex items-center justify-end">
                  0
                </div>
                <div className="col-span-1 text-right 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium pr-3 text-black  flex items-center justify-end">
                  1
                </div>
                <input
                  placeholder={dataLang?.returns_note || "returns_note"}
                  disabled
                  className=" disabled:bg-gray-50 col-span-1 placeholder:text-slate-300 w-full bg-[#ffffff] 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]  p-1.5 "
                />
                <button
                  title={dataLang?.returns_delete || "returns_delete"}
                  disabled
                  className="col-span-1 disabled:opacity-50 transition w-full h-full bg-slate-100  rounded-[5.5px] text-red-500 flex flex-col justify-center items-center"
                >
                  <IconDelete />
                </button>
              </div>
            </div>
          </div>
          <div className="h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            <div className="min:h-[400px] h-[100%] max:h-[800px] w-full">
              {onFetchingDetail ? (
                <Loading className="h-10 w-full" color="#0f4f9e" />
              ) : (
                <>
                  {listData?.map((e) => (
                    <div
                      key={e?.id?.toString()}
                      className="grid grid-cols-12 items-start"
                    >
                      <div className="col-span-3 border border-r p-2 pb-1 h-full">
                        <div className="relative mt-5">
                          <Select
                            options={options}
                            value={e?.matHang}
                            className=""
                            onChange={_HandleChangeValue.bind(this, e?.id)}
                            menuPortalTarget={document.body}
                            formatOptionLabel={(option) => (
                              <div className="py-2">
                                <div className="flex items-center gap-1">
                                  <div className="w-[40px] h-[50px]">
                                    {option.e?.images != null ? (
                                      <img
                                        src={option.e?.images}
                                        alt="Product Image"
                                        className="max-w-[40px] max-h-[50px] text-[8px] object-cover rounded"
                                      />
                                    ) : (
                                      <div className=" w-[40px] h-[50px] object-cover  flex items-center justify-center  rounded">
                                        <img
                                          src="/no_img.png"
                                          alt="Product Image"
                                          className=" object-cover rounded"
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                      {option.e?.name}
                                    </h3>
                                    <div className="flex gap-2">
                                      <h5 className="text-gray-400 font-normal 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                        {option.e?.code}
                                      </h5>
                                      <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                        {option.e?.product_variation}
                                      </h5>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                        {option.e?.import_code}
                                      </h5>
                                      <h5 className="text-gray-400 font-medium text-xs 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                        {dataLang[option.e?.text_type]}
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    option.e?.serial ||
                                    option.e?.lot ||
                                    option.e?.expiration_date
                                      ? ""
                                      : ""
                                  } flex items-center gap-2 italic`}
                                >
                                  {dataProductSerial.is_enable === "1" && (
                                    <div className="text-[11px] text-[#667085] font-[500]">
                                      Serial:{" "}
                                      {option.e?.serial
                                        ? option.e?.serial
                                        : "-"}
                                    </div>
                                  )}
                                  {dataMaterialExpiry.is_enable === "1" ||
                                  dataProductExpiry.is_enable === "1" ? (
                                    <>
                                      <div className="text-[11px] text-[#667085] font-[500]">
                                        Lot:{" "}
                                        {option.e?.lot ? option.e?.lot : "-"}
                                      </div>
                                      <div className="text-[11px] text-[#667085] font-[500]">
                                        Date:{" "}
                                        {option.e?.expiration_date
                                          ? moment(
                                              option.e?.expiration_date
                                            ).format("DD/MM/YYYY")
                                          : "-"}
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                {/* <div className=''>
                                   <div className='text-right opacity-0'>{"0"}</div>
                                   <div className='flex gap-2'>
                                     <div className='flex items-center gap-2'>
                                       <h5 className='text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{dataLang?.purchase_survive || "purchase_survive"}:</h5><h5 className='text-[#0F4F9E] font-medium 2xl:text-[12px] xl:text-[13px] text-[12.5px]'>{qtyHouse?.quantity ?? 0}</h5>
                                     </div>
                                    </div>
                                </div> */}
                              </div>
                            )}
                            noOptionsMessage={() =>
                              dataLang?.returns_nodata || "returns_nodata"
                            }
                            classNamePrefix="customDropdow"
                            style={{
                              border: "none",
                              boxShadow: "none",
                              outline: "none",
                            }}
                            theme={(theme) => ({
                              ...theme,
                              colors: {
                                ...theme.colors,
                                primary25: "#EBF5FF",
                                primary50: "#92BFF7",
                                primary: "#0F4F9E",
                              },
                            })}
                            styles={{
                              placeholder: (base) => ({
                                ...base,
                                color: "#cbd5e1",
                              }),
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                              control: (base, state) => ({
                                ...base,
                                ...(state.isFocused && {
                                  border: "0 0 0 1px #92BFF7",
                                  boxShadow: "none",
                                }),
                              }),
                              menu: (provided, state) => ({
                                ...provided,
                                width: "100%",
                              }),
                            }}
                          />
                          <button
                            onClick={_HandleAddChild.bind(
                              this,
                              e?.id,
                              e?.matHang
                            )}
                            className="w-8 h-8 rounded bg-slate-100 flex flex-col justify-center items-center absolute -top-4 right-5 hover:rotate-45 hover:bg-slate-200 transition hover:scale-105 hover:text-red-500 ease-in-out"
                          >
                            <Add className="" />
                          </button>
                        </div>
                        {e?.child?.filter((e) => e?.kho == null).length >=
                          2 && (
                          <button
                            onClick={_HandleDeleteAllChild.bind(
                              this,
                              e?.id,
                              e?.matHang
                            )}
                            className="w-full rounded mt-1.5 px-5 py-1 overflow-hidden group bg-rose-500 relative hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-rose-400 transition-all ease-out duration-300"
                          >
                            <span className="absolute right-0 w-full h-full -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                            <span className="relative text-xs">
                              Xóa{" "}
                              {e?.child?.filter((e) => e?.kho == null).length}{" "}
                              hàng chưa chọn kho
                            </span>
                          </button>
                        )}
                      </div>
                      <div className="col-span-9  items-center">
                        <div className="grid grid-cols-7  3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] border-b divide-x divide-y border-r">
                          {load ? (
                            <Loading
                              className="h-2 col-span-7"
                              color="#0f4f9e"
                            />
                          ) : (
                            e?.child?.map((ce, index) => (
                              <React.Fragment key={ce?.id?.toString()}>
                                <div className="p-0.5 border-t border-l  flex flex-col col-span-1 justify-center h-full">
                                  <Select
                                    options={ce?.dataWarehouse}
                                    value={ce?.kho}
                                    isLoading={
                                      ce?.kho == null ? onLoadingChild : false
                                    }
                                    onChange={_HandleChangeChild.bind(
                                      this,
                                      e?.id,
                                      ce?.id,
                                      "kho"
                                    )}
                                    className={`${
                                      errWarehouse && ce?.kho == null
                                        ? "border-red-500"
                                        : ""
                                    } border my-1 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal `}
                                    placeholder={
                                      onLoadingChild
                                        ? ""
                                        : "Kho xuất - Vị trí xuất" ||
                                          "returns_point"
                                    }
                                    noOptionsMessage={() =>
                                      dataLang?.returns_nodata ||
                                      "returns_nodata"
                                    }
                                    menuPortalTarget={document.body}
                                    formatOptionLabel={(option) => (
                                      <div className="">
                                        <div className="flex gap-1">
                                          <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                            {"Kho xuất"}:
                                          </h2>
                                          <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                            {option?.warehouse_name}
                                          </h2>
                                        </div>
                                        <div className="flex gap-1">
                                          <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                            {"Vị trí xuất"}:
                                          </h2>
                                          <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-semibold">
                                            {option?.label}
                                          </h2>
                                        </div>
                                        <div className="flex gap-1">
                                          <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] font-medium">
                                            {dataLang?.returns_survive ||
                                              "returns_survive"}
                                            :
                                          </h2>
                                          <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] uppercase font-semibold">
                                            {formatNumber(option?.qty)}
                                          </h2>
                                        </div>
                                      </div>
                                    )}
                                    style={{
                                      border: "none",
                                      boxShadow: "none",
                                      outline: "none",
                                    }}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#EBF5FF",
                                        primary50: "#92BFF7",
                                        primary: "#0F4F9E",
                                      },
                                    })}
                                    classNamePrefix="customDropdow"
                                  />
                                </div>
                                <div className=" flex flex-col items-center p-0.5 h-full justify-center">
                                  <Select
                                    options={ce?.dataUnit}
                                    value={ce?.donViTinh}
                                    isLoading={
                                      ce?.donViTinh == null
                                        ? onLoadingChild
                                        : false
                                    }
                                    onChange={_HandleChangeChild.bind(
                                      this,
                                      e?.id,
                                      ce?.id,
                                      "donViTinh"
                                    )}
                                    noOptionsMessage={() =>
                                      dataLang?.returns_nodata ||
                                      "returns_nodata"
                                    }
                                    placeholder={"Đơn vị tính"}
                                    className={`${
                                      errUnit && ce?.donViTinh == null
                                        ? "border-red-500"
                                        : ""
                                    } border my-1 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal`}
                                    menuPortalTarget={document.body}
                                    style={{
                                      border: "none",
                                      boxShadow: "none",
                                      outline: "none",
                                    }}
                                    formatOptionLabel={(option) => (
                                      <div className="flex justify-start flex-wrap items-center">
                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] w-full py-1.5">
                                          Đơn vị tính: {option?.label}
                                        </h2>
                                        <h2 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] py-1">{`Giá trị quy đổi: (${option?.coefficient})`}</h2>
                                      </div>
                                    )}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#EBF5FF",
                                        primary50: "#92BFF7",
                                        primary: "#0F4F9E",
                                      },
                                    })}
                                    classNamePrefix="customDropdow"
                                  />
                                </div>
                                <div className="col-span-1 flex items-center justify-center p-0.5">
                                  <NumericFormat
                                    //
                                    className={`${
                                      errQty &&
                                      (ce?.soluongxuat == null ||
                                        ce?.soluongxuat == "" ||
                                        ce?.soluongxuat == 0)
                                        ? "border-red-500 border"
                                        : ""
                                    } text-center py-[20px] w-full placeholder:text-[9px] rounded font-medium  focus:outline-none  border border-gray-300`}
                                    thousandSeparator=","
                                    allowNegative={false}
                                    value={ce?.soluongxuat}
                                    onValueChange={_HandleChangeChild.bind(
                                      this,
                                      e?.id,
                                      ce?.id,
                                      "soluongxuat"
                                    )}
                                    placeholder={
                                      (ce?.kho == null ||
                                        ce?.donViTinh == null) &&
                                      "Chọn kho và đơn vị tính trước"
                                    }
                                    disabled={
                                      ce?.kho == null || ce?.donViTinh == null
                                    }
                                    decimalScale={0}
                                    isNumericString={true}
                                  />
                                </div>
                                <div className="justify-center pr-1  p-0.5 h-full flex flex-col items-end 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                  {ce?.giatriquydoi}
                                </div>
                                <div className="justify-center pr-1  p-0.5 h-full flex flex-col items-end 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                  {formatNumber(
                                    // ce?.soluongxuat * Number(ce?.giatriquydoi)
                                    ce?.soluongxuat * ce?.giatriquydoi
                                  )}
                                </div>
                                <div className="col-span-1 flex items-center justify-center  h-full p-0.5">
                                  <input
                                    value={ce?.note}
                                    onChange={_HandleChangeChild.bind(
                                      this,
                                      e?.id,
                                      ce?.id,
                                      "note"
                                    )}
                                    placeholder="Ghi chú"
                                    type="text"
                                    className="  placeholder:text-slate-300 w-full bg-white rounded-[5.5px] text-[#52575E] font-normal p-1.5 outline-none mb-2"
                                  />
                                </div>
                                <div className=" h-full p-0.5 flex flex-col items-center justify-center">
                                  <button
                                    title="Xóa"
                                    onClick={_HandleDeleteChild.bind(
                                      this,
                                      e?.id,
                                      ce?.id
                                    )}
                                    className=" text-red-500 flex flex-col justify-center items-center hover:scale-110 bg-red-50 p-2 rounded-md hover:bg-red-200 transition-all ease-linear animate-bounce-custom"
                                  >
                                    <IconDelete />
                                  </button>
                                </div>
                              </React.Fragment>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <h2 className="font-normal bg-[white]  p-2 border-b border-b-[#a9b5c5]  border-t border-t-[#a9b5c5]">
            {"Lưu ý"}
          </h2>
        </div>
        <div className="grid grid-cols-12">
          <div className="col-span-9">
            <div className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.returns_reason || "returns_reason"}
            </div>
            <textarea
              value={note}
              placeholder={dataLang?.returns_reason || "returns_reason"}
              onChange={_HandleChangeInput.bind(this, "note")}
              name="fname"
              type="text"
              className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-[40%] min-h-[220px] max-h-[220px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
            />
          </div>
          <div className="text-right mt-5 space-y-4 col-span-3 flex-col justify-between ">
            <div className="flex justify-between "></div>
            {/* <div className="flex justify-between ">
              <div className="font-normal ">
                <h3>
                  {dataLang?.purchase_order_table_total ||
                    "purchase_order_table_total"}
                </h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {formatNumber(
                    listData?.reduce((accumulator, item) => {
                      const childTotal = item.child?.reduce(
                        (childAccumulator, childItem) => {
                          const product =
                            Number(childItem?.price) *
                            Number(childItem?.amount);
                          return childAccumulator + product;
                        },
                        0
                      );
                      return accumulator + childTotal;
                    }, 0)
                  )}
                </h3>
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="font-normal">
                <h3>
                  {dataLang?.purchase_order_detail_discounty ||
                    "purchase_order_detail_discounty"}
                </h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {formatNumber(
                    listData?.reduce((accumulator, item) => {
                      const childTotal = item.child?.reduce(
                        (childAccumulator, childItem) => {
                          const product =
                            Number(childItem?.price) *
                            (Number(childItem?.chietKhau) / 100) *
                            Number(childItem?.amount);
                          return childAccumulator + product;
                        },
                        0
                      );
                      return accumulator + childTotal;
                    }, 0)
                  )}
                </h3>
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="font-normal">
                <h3>
                  {dataLang?.purchase_order_detail_money_after_discount ||
                    "purchase_order_detail_money_after_discount"}
                </h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {formatNumber(
                    listData?.reduce((accumulator, item) => {
                      const childTotal = item.child?.reduce(
                        (childAccumulator, childItem) => {
                          const product =
                            Number(
                              childItem?.price *
                                (1 - childItem?.chietKhau / 100)
                            ) * Number(childItem?.amount);
                          return childAccumulator + product;
                        },
                        0
                      );
                      return accumulator + childTotal;
                    }, 0)
                  )}
                </h3>
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="font-normal">
                <h3>
                  {dataLang?.purchase_order_detail_tax_money ||
                    "purchase_order_detail_tax_money"}
                </h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {formatNumber(
                    listData?.reduce((accumulator, item) => {
                      const childTotal = item.child?.reduce(
                        (childAccumulator, childItem) => {
                          const product =
                            Number(
                              childItem?.price *
                                (1 - childItem?.chietKhau / 100)
                            ) *
                            (isNaN(childItem?.tax?.tax_rate)
                              ? 0
                              : Number(childItem?.tax?.tax_rate) / 100) *
                            Number(childItem?.amount);
                          return childAccumulator + product;
                        },
                        0
                      );
                      return accumulator + childTotal;
                    }, 0)
                  )}
                </h3>
              </div>
            </div>
            <div className="flex justify-between ">
              <div className="font-normal">
                <h3>
                  {dataLang?.purchase_order_detail_into_money ||
                    "purchase_order_detail_into_money"}
                </h3>
              </div>
              <div className="font-normal">
                <h3 className="text-blue-600">
                  {formatNumber(
                    listData?.reduce((accumulator, item) => {
                      const childTotal = item.child?.reduce(
                        (childAccumulator, childItem) => {
                          const product =
                            Number(
                              childItem?.price *
                                (1 - childItem?.chietKhau / 100)
                            ) *
                            (1 + Number(childItem?.tax?.tax_rate) / 100) *
                            Number(childItem?.amount);
                          return childAccumulator + product;
                        },
                        0
                      );
                      return accumulator + childTotal;
                    }, 0)
                  )}
                </h3>
              </div>
            </div> */}
            <div className="space-x-2">
              <button
                onClick={() => router.push("/purchase_order/returns")}
                className="button text-[#344054] font-normal text-base hover:bg-blue-500 hover:text-white hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
              >
                {dataLang?.purchase_order_purchase_back ||
                  "purchase_order_purchase_back"}
              </button>
              <button
                onClick={_HandleSubmit.bind(this)}
                type="submit"
                className="button text-[#FFFFFF] hover:bg-blue-500 font-normal text-base hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
              >
                {dataLang?.purchase_order_purchase_save ||
                  "purchase_order_purchase_save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
const MoreSelectedBadge = ({ items }) => {
  const style = {
    marginLeft: "auto",
    background: "#d4eefa",
    borderRadius: "4px",
    fontSize: "14px",
    padding: "1px 3px",
    order: 99,
  };

  const title = items.join(", ");
  const length = items.length;
  // const label = `+ ${length}`;
  const label = ``;

  return <div title={title}>{label}</div>;
};

const MultiValue = ({ index, getValue, ...props }) => {
  const maxToShow = 0;
  const overflow = getValue()
    .slice(maxToShow)
    .map((x) => x.label);

  return index < maxToShow ? (
    <components.MultiValue {...props} />
  ) : index === maxToShow ? (
    <MoreSelectedBadge items={overflow} />
  ) : null;
};

export default Index;
