// const newData = listData.map((e) => {
// if (e?.id !== parentId) return e;

        //     const newChild = e.child?.map((ce) => {
        //         if (ce?.id !== childId) return ce;
        //         const quantityAmount = +ce?.quantityStock - +ce?.quantityDelive;
        //         const totalSoLuong = e.child.reduce((sum, opt) => sum + parseFloat(opt?.quantity || 0), 0);
        //         const checkWarehouse = e?.child?.some((i) => i?.warehouse?.value === value?.value);
        //         switch (type) {
        //             case "quantity":
        //                 sErrSurvive(false);
        //                 ce.quantity = Number(value?.value);
        //                 FunCheckQuantity(parentId, childId);
        //                 break;

        //             case "increase":
        //                 sErrSurvive(false);
        //                 if (+ce.quantity === +ce?.warehouse?.qty) {
        //                     ToatstNotifi(
        //                         "error",
        //                         `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(
        //                             +ce?.warehouse?.qty
        //                         )} số lượng tồn kho`,
        //                         3000
        //                     );
        //                 } else if (+ce.quantity === quantityAmount) {
        //                     ToatstNotifi(
        //                         "error",
        //                         `Số lượng chỉ được bé hơn hoặc bằng ${formatNumber(quantityAmount)} số lượng chưa giao`,
        //                         3000
        //                     );
        //                 } else {
        //                     ce.quantity = Number(ce?.quantity) + 1;
        //                 }
        //                 break;

        //             case "decrease":
        //                 sErrSurvive(false);
        //                 ce.quantity = Number(ce?.quantity) - 1;
        //                 break;

        //             case "price":
        //                 ce.price = Number(value?.value);
        //                 break;

        //             case "discount":
        //                 ce.discount = Number(value?.value);
        //                 break;

        //             case "note":
        //                 ce.note = value?.target.value;
        //                 break;

        //             case "warehouse":
        //                 if (!checkWarehouse && +ce?.quantity > +value?.qty) {
        //                     ToatstNotifi("error", `Số lượng chưa giao vượt quá số lượng tồn kho`);
        //                     ce.warehouse = value;
        //                     ce.quantity = value?.qty;
        //                 } else if (!checkWarehouse && totalSoLuong > quantityAmount) {
        //                     ToatstNotifi("error", `Tổng số lượng vượt quá số lượng chưa giao`);
        //                     HandTimeout();
        //                     ce.warehouse = value;
        //                     ce.quantity = "";
        //                 } else if (checkWarehouse) {
        //                     ToatstNotifi("error", `Kho - vị trí kho đã được chọn`);
        //                 } else {
        //                     ce.warehouse = value;
        //                 }
        //                 break;

        //             case "tax":
        //                 ce.tax = value;
        //                 break;

        //             default:
        //         }

        //         return { ...ce };
        //     });

        //     return { ...e, child: newChild };
        // });

        // sListData([...newData]);
