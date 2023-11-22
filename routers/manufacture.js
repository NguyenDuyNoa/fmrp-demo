//Kho && sản xuất
const url = "/manufacture";
// Kế hoạch nội bộ

const routerInternalPlan = {
    home: `${url}/internal_plan`,
    form: `${url}/internal_plan/form`,
};

// chuyển kho

const routerWarehouseTransfer = {
    home: `${url}/warehouseTransfer`,
    form: `${url}/warehouseTransfer/form`,
};

export { routerInternalPlan, routerWarehouseTransfer };
