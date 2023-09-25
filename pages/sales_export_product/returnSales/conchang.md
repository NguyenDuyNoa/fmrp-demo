// const \_HandleChangeInput = (type, value) => {
// if (type == "code") {
// sCode(value.target.value);
// } else if (type === "date") {
// sDate(moment(value.target.value).format("YYYY-MM-DD HH:mm:ss"));
// } else if (type === "idClient" && idClient != value) {
// if (listData?.length > 0) {
// checkListData(value, sDataItems, sListData, sIdClient, idClient);
// } else {
// sIdClient(value);
// if (value == null) {
// alert("rỗng thì mặt hàng rỗng nhe");
// }
// }
// } else if (type === "treatment") {
// sIdTreatment(value);
// } else if (type === "note") {
// sNote(value.target.value);
// } else if (type == "branch" && idBranch != value) {
// if (listData?.length > 0) {
// checkListData(value, sDataItems, sListData, sIdBranch, idBranch, sIdClient);
// } else {
// sIdBranch(value);
// sIdClient(null);
// sOnFetchingClient(true);
// if (value == null) {
// sDataClient([]);
// sIdClient(null);
// }
// }
// } else if (type == "generalTax") {
// sThuetong(value);
// if (listData?.length > 0) {
// const newData = listData.map((e) => {
// const newChild = e?.child.map((ce) => {
// return { ...ce, tax: value };
// });
// return { ...e, child: newChild };
// });
// sListData(newData);
// }
// } else if (type == "generalDiscount") {
// sGeneralD(value?.value);
// if (listData?.length > 0) {
// const newData = listData.map((e) => {
// const newChild = e?.child.map((ce) => {
// return { ...ce, discount: value?.value };
// });
// return { ...e, child: newChild };
// });
// sListData(newData);
// }
// }
// };
