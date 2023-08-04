// const \_HandleChangeChild = (parentId, childId, type, value) => {
// let newData = [...listData];
// newData = newData.map((e) => {
// if (e?.id === parentId) {
// const newChild = e.child?.map((ce) => {
// console.log("listData,listDataham", listData);
// if (ce?.id === childId) {
// if (type === "exportQuantity") {
// const newSoluongxuat = Number(value?.value);
// const newSoluongquydoi =
// newSoluongxuat _ Number(ce?.exchangeValue);
// if (newSoluongquydoi > +ce?.kho?.qty) {
// handleQuantityError(ce?.kho?.qty);
// setTimeout(() => {
// sLoad(true);
// }, 500);
// setTimeout(() => {
// sLoad(false);
// }, 1000);
// return { ...ce, exportQuantity: null, numberOfConversions: null };
// } else {
// sLoad(false);
// return {
// ...ce,
// exportQuantity: newSoluongxuat,
// numberOfConversions: newSoluongquydoi,
// };
// }
// } else if (type === "kho") {
// const checkKho = e?.child
// ?.map((house) => house)
// ?.some((i) => i?.kho?.value === value?.value);
// sSurvive(Number(value?.qty));
// sErrSurvive(false);
// if (checkKho) {
// handleKhoError("Kho xuất và vị trí xuất đã được chọn");
// return { ...ce };
// } else {
// return { ...ce, kho: value };
// }
// } else if (type === "unit") {
// return {
// ...ce,
// unit: value,
// exchangeValue: Number(value?.coefficient),
// };
// } else if (type === "increase") {
// if (ce?.kho == null) {
// Toast.fire({
// title: `${"Vui lòng chọn kho trước"}`,
// icon: "error",
// });
// return { ...ce };
// }
// if (ce?.unit == null) {
// Toast.fire({
// title: `${"Vui lòng chọn đơn vị tính trước"}`,
// icon: "error",
// });
// return { ...ce };
// }
// // if (check?.numberOfConversions == check?.kho) {
// // handleQuantityError(check?.kho);
// // return { ...ce };
// // }
// console.log("numberOfConversions", ce?.numberOfConversions);
// return {
// ...ce,
// exportQuantity: Number(ce?.exportQuantity) + 1,
// numberOfConversions:
// (Number(ce?.exportQuantity) + 1) _ Number(ce?.exchangeValue),
// };
// } else if (type === "decrease") {
// if (ce?.kho == null) {
// handleKhoError("Vui lòng chọn kho trước");
// return { ...ce };
// }
// if (ce?.unit == null) {
// handleKhoError("Vui lòng chọn đơn vị tính trước");
// return { ...ce };
// }
// if (ce?.exportQuantity < 2) {
// return {
// ...ce,
// exportQuantity: 1,
// };
// } else {
// return {
// ...ce,
// exportQuantity: Number(ce?.exportQuantity) - 1,
// numberOfConversions:
// (Number(ce?.exportQuantity) - 1) \* Number(ce?.exchangeValue),
// };
// }
// } else if (type === "note") {
// return { ...ce, note: value?.target.value };
// }
// }
// return ce;
// });
// return { ...e, child: newChild };
// } else {
// return e;
// }
// });
// sListData(newData);
// // sListData([...newData]);
// };

// const \_HandleChangeChild = (parentId, childId, type, value) => {
// const newData = listData.map((parent) => {
// if (parent.id !== parentId) {
// return parent;
// }

// const updatedChild = parent.child.map((child) => {
// if (child.id !== childId) {
// return child;
// }

// if (type === "exportQuantity") {
// const newSoluongxuat = Number(value?.value);
// const newSoluongquydoi = newSoluongxuat _ Number(child?.exchangeValue);
// if (newSoluongquydoi > +child?.kho?.qty) {
// handleQuantityError(child?.kho?.qty);
// setTimeout(() => {
// sLoad(true);
// }, 500);
// setTimeout(() => {
// sLoad(false);
// }, 1000);
// return { ...child, exportQuantity: null, numberOfConversions: null };
// } else {
// sLoad(false);
// return {
// ...child,
// exportQuantity: newSoluongxuat,
// numberOfConversions: newSoluongquydoi,
// };
// }
// } else if (type === "kho") {
// const checkKho = parent.child.some(
// (i) => i?.kho?.value === value?.value
// );
// sSurvive(Number(value?.qty));
// sErrSurvive(false);
// if (checkKho) {
// handleKhoError("Kho xuất và vị trí xuất đã được chọn");
// return child;
// } else {
// return { ...child, kho: value };
// }
// } else if (type === "unit") {
// return {
// ...child,
// unit: value,
// exchangeValue: Number(value?.coefficient),
// };
// } else if (type === "increase") {
// if (child.kho == null) {
// Toast.fire({
// title: `${"Vui lòng chọn kho trước"}`,
// icon: "error",
// });
// return child;
// }
// if (child.unit == null) {
// Toast.fire({
// title: `${"Vui lòng chọn đơn vị tính trước"}`,
// icon: "error",
// });
// return child;
// }
// const newSoluongxuat = Number(child.exportQuantity) + 1;
// const newSoluongquydoi = newSoluongxuat _ Number(child?.exchangeValue);
// if (newSoluongquydoi === child.kho.qty) {
// handleQuantityError(child?.kho?.qty);
// return child;
// }
// return {
// ...child,
// exportQuantity: newSoluongxuat,
// numberOfConversions: newSoluongquydoi,
// };
// } else if (type === "decrease") {
// if (child.kho == null) {
// handleKhoError("Vui lòng chọn kho trước");
// return child;
// }
// if (child.unit == null) {
// handleKhoError("Vui lòng chọn đơn vị tính trước");
// return child;
// }
// if (child.exportQuantity < 2) {
// return { ...child, exportQuantity: 1 };
// }
// const newSoluongxuat = Number(child.exportQuantity) - 1;
// const newSoluongquydoi = newSoluongxuat \* Number(child?.exchangeValue);
// return {
// ...child,
// exportQuantity: newSoluongxuat,
// numberOfConversions: newSoluongquydoi,
// };
// } else if (type === "note") {
// return { ...child, note: value?.target.value };
// }

// return child;
// });

// return { ...parent, child: updatedChild };
// });

// sListData(newData);
// };
