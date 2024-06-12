//Kho && sản xuất
const url = "/manufacture";

// Kế hoạch sản xuất
const routerPproductionPlan = {
    home: `${url}/production_plan`,
    form: `${url}/production_plan/form`,
};

// Kế hoạch nội bộ

const routerInternalPlan = {
    home: `${url}/internal_plan`,
    form: `${url}/internal_plan/form`,
};

// chuyển kho

const routerWarehouseTransfer = {
    home: `${url}/warehouse_transfer`,
    form: `${url}/warehouse_transfer/form`,
};
///Xuất kho sản xuất
const routerProductionWarehouse = {
    home: `${url}/production_warehouse`,
    form: `${url}/production_warehouse/form`,
};

/// Nhập kho thành phẩm
const routerProductsWarehouse = {
    home: `${url}/products_warehouse`,
    form: `${url}/products_warehouse/form`,
};

/// Thu hồi nguyên vật liệu
const routerRecall = {
    home: `${url}/recall`,
    form: `${url}/recall/form`,
};

// Xuất kho khác

const routerExportToOther = {
    home: `${url}/export_to_other`,
    form: `${url}/export_to_other/form`,
};

// kiểm kê kho
const routerInventory = {
    home: `${url}/inventory`,
    form: `${url}/inventory/form`,
};

//qc
const routerQc = {
    home: `${url}/check_quality`,
    form: `${url}/check_quality/form`,
}

export {
    routerPproductionPlan,
    routerInternalPlan,
    routerWarehouseTransfer,
    routerProductionWarehouse,
    routerProductsWarehouse,
    routerRecall,
    routerExportToOther,
    routerInventory,
    routerQc
};
