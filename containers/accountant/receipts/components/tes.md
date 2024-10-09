// const \_HandleChangeInput = (type, value) => {
// if (type == "date") {
// sDate(value);
// } else if (type == "code") {
// sCode(value?.target?.value);
// } else if (type === "clear") {
// sDate(new Date());
// } else if (type == "branch" && branch != value) {
// sBranch(value);
// sData((e) => ({ ...e, dataList_Object: [], dataListCost: [], dataListTypeofDoc: [] }));
// sListObject(null);
// sPrice(null);
// sListTypeOfDocument([]);
// sTypeOfDocument(null);
// } else if (type == "object" && object != value) {
// sObject(value);
// sListObject(null);
// sData((e) => ({ ...e, dataList_Object: [], dataListTypeofDoc: [] }));
// sTypeOfDocument(null);
// sListTypeOfDocument([]);
// sPrice(null);
// } else if (type == "listObject") {
// sListObject(value);
// } else if (type == "typeOfDocument" && typeOfDocument != value) {
// sTypeOfDocument(value);
// sData((e) => ({ ...e, dataListTypeofDoc: [] }));
// sListTypeOfDocument([]);
// sPrice(null);
// } else if (type == "listTypeOfDocument") {
// sListTypeOfDocument(value);
// if (value && value.length > 0) {
// const totalMoney = value.reduce((total, item) => total + parseFloat(item.money || 0), 0);
// const formattedTotal = parseFloat(totalMoney);
// sPrice(formattedTotal);
// } else if (value && value.length == 0) {
// sPrice(null);
// }
// } else if (type === "price") {
// let totalMoney = listTypeOfDocument.reduce((total, item) => total + parseFloat(item.money), 0);
// const priceChange = parseFloat(value?.target.value.replace(/,/g, ""));
// let isExceedTotal = false;
// if (!isNaN(priceChange)) {
// if (listTypeOfDocument?.length > 0) {
// if (priceChange > totalMoney) {
// ToatstNotifi("error", `${dataLang?.payment_err_aler || "payment_err_aler"}`);
// sPrice(totalMoney);
// isExceedTotal = true;
// } else {
// }
// sPrice(priceChange);
// } else {
// sPrice(priceChange);
// }
// }
// if (isExceedTotal) {
// sPrice(totalMoney);
// }
// } else if (type == "method") {
// sMethod(value);
// } else if (type == "note") {
// sNote(value?.target.value);
// }
// };
