//Kho && sản xuất
const url = "/manufacture";


// Kế hoạch sản xuất
const routerPproductionPlan = {
    home: `${url}/production-plan`,
    form: `${url}/production-plan/form`,
};

// Kế hoạch nội bộ

const routerInternalPlan = {
    home: `${url}/internal-plan`,
    form: `${url}/internal-plan/form`,
};

// chuyển kho

const routerWarehouseTransfer = {
    home: `${url}/warehouse-transfer`,
    form: `${url}/warehouse-transfer/form`,
};
///Xuất kho sản xuất
const routerProductionWarehouse = {
    home: `${url}/production-warehouse`,
    form: `${url}/production-warehouse/form`,
};

/// Nhập kho thành phẩm
const routerProductsWarehouse = {
    home: `${url}/products-warehouse`,
    form: `${url}/products-warehouse/form`,
};

/// Thu hồi nguyên vật liệu
const routerRecall = {
    home: `${url}/recall`,
    form: `${url}/recall/form`,
};

// Xuất kho khác

const routerExportToOther = {
    home: `${url}/export-to-other`,
    form: `${url}/export-to-other/form`,
};

// kiểm kê kho
const routerInventory = {
    home: `${url}/inventory`,
    form: `${url}/inventory/form`,
};

//qc
const routerQc = {
    home: `${url}/check-quality`,
    form: `${url}/check-quality/form`,
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
