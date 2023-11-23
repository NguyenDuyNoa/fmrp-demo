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

/// Nhập kho thành phẩm
const routerProductsWarehouse = {
    home: `${url}/productsWarehouse`,
    form: `${url}/productsWarehouse/form`,
};

/// Thu hồi nguyên vật liệu
const routerRecall = {
    home: `${url}/recall`,
    form: `${url}/recall/form`,
};

// Xuất kho khác

const routerExportToOther = {
    home: `${url}/exportToOther`,
    form: `${url}/exportToOther/form`,
};

export {
    routerInternalPlan,
    routerWarehouseTransfer,
    routerProductionWarehouse,
    routerProductsWarehouse,
    routerRecall,
    routerExportToOther,
};
