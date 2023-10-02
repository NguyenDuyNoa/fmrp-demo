// const \_HandleChangeInput = (type, value) => {
// const sIdClient = (e) => {
// sIdChange((list) => ({ ...list, idClient: e }));
// };
// const sIdBranch = (e) => {
// sIdChange((list) => ({ ...list, idBranch: e }));
// };
// const onChange = {
// code: () => sIdChange((e) => ({ ...e, code: value.target.value })),
// date: () => sIdChange((e) => ({ ...e, date: moment(value).format("YYYY-MM-DD HH:mm:ss") })),
// startDate: () => {
// sIdChange((e) => ({ ...e, date: new Date() }));
// },
// idClient: () => {
// if (listData?.length > 0) {
// checkListData(value, sDataSelect, sListData, sIdClient);
// } else {
// sIdChange((e) => ({ ...e, idClient: value }));
// sFetchingData((e) => ({ ...e, onFetchingItemsAll: true }));
// if (value == null) {
// sFetchingData((e) => ({ ...e, onFetchingItemsAll: false }));
// sDataSelect((e) => ({ ...e, dataItems: [] }));
// }
// }
// },
// treatment: () => sIdChange((e) => ({ ...e, idTreatment: value })),
// note: () => sIdChange((e) => ({ ...e, note: value.target.value })),
// branch: () => {
// if (listData?.length > 0) {
// checkListData(value, sDataSelect, sListData, sIdBranch, idChange.idBranch, sIdClient);
// } else {
// sIdChange((e) => ({ ...e, idClient: null, idBranch: value }));
// sFetchingData((e) => ({ ...e, onFetchingClient: true }));
// if (value == null) {
// sDataSelect((e) => ({ ...e, dataClient: [] }));
// sIdChange((e) => ({ ...e, idClient: null }));
// sFetchingData((e) => ({ ...e, onFetchingClient: false }));
// }
// }
// },
// generalTax: () => {
// sGeneralTax(value);
// if (listData?.length > 0) {
// const newData = listData.map((e) => {
// const newChild = e?.child.map((ce) => ({ ...ce, tax: value }));
// return { ...e, child: newChild };
// });
// sListData(newData);
// }
// },
// generalDiscount: () => {
// sGeneralD(value?.value);
// if (listData?.length > 0) {
// const newData = listData.map((e) => {
// const newChild = e?.child.map((ce) => ({ ...ce, discount: value?.value }));
// return { ...e, child: newChild };
// });
// sListData(newData);
// }
// },
// };
// onChange[type] && onChange[type]();
// };
