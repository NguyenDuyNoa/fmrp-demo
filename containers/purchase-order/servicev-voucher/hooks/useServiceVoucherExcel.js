import useSetingServer from "@/hooks/useConfigNumber";
import formatMoneyConfig from "@/utils/helpers/formatMoney";

export const useServiceVoucherExcel = (dataLang, data) => {
    const dataSeting = useSetingServer();
    console.log("dataSeting", dataSeting);
    // const formatMoney = (number) => {
    //     return formatMoneyConfig(+number, dataSeting);
    // };
    // return [
    //     {
    //         columns: [
    //             {
    //                 title: "ID",
    //                 width: { wch: 4 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.serviceVoucher_day_vouchers || "serviceVoucher_day_vouchers"}`,
    //                 width: { wpx: 100 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.serviceVoucher_voucher_code || "serviceVoucher_voucher_code"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.serviceVoucher_supplier || "serviceVoucher_supplier"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.serviceVoucher_total_amount || "serviceVoucher_total_amount"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.serviceVoucher_tax_money || "serviceVoucher_tax_money"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.serviceVoucher_into_money || "serviceVoucher_into_money"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.serviceVoucher_status_of_spending || "serviceVoucher_status_of_spending"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.serviceVoucher_note || "serviceVoucher_note"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.serviceVoucher_branch || "serviceVoucher_branch"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //         ],
    //         data: data?.rResult?.map((e) => [
    //             { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
    //             { value: `${e?.date ? e?.date : ""}` },
    //             { value: `${e?.code ? e?.code : ""}` },
    //             { value: `${e?.supplier_name ? e?.supplier_name : ""}` },
    //             { value: `${e?.total_price ? formatMoney(e?.total_price) : ""}` },
    //             { value: `${e?.total_tax_price ? formatMoney(e?.total_tax_price) : ""}` },
    //             { value: `${e?.total_amount ? formatMoney(e?.total_amount) : ""}` },
    //             // {value: `${e?.status_pay ? e?.status_pay === "0" && "Chưa nhập" || e?.status_pay === "1" && "Nhập 1 phần" ||  e?.status_pay === "2"  && "Đã nhập đủ đủ" : ""}`},
    //             { value: `${e?.status_pay === "not_spent" && 'Chưa chi' || e?.status_pay === "spent_part" && `Chi 1 phần (${formatNumber(e?.amount_paid)})` || e?.status_pay === "spent" && 'Đã chi đủ'}` },
    //             { value: `${e?.note ? e?.note : ""}` },
    //             { value: `${e?.branch_name ? e?.branch_name : ""}` },
    //         ]),
    //     },
    // ];
}