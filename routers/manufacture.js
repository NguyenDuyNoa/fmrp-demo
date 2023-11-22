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
///Xuất kho sản xuất
const routerProductionWarehouse = {
    home: `${url}/production_warehouse`,
    form: `${url}/production_warehouse/form`,
};

export { routerInternalPlan, routerWarehouseTransfer, routerProductionWarehouse };
