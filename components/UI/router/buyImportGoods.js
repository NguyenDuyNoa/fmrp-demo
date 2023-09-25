// Yêu cầu mua hàng

const routerPurchases = {
    home: "/purchase_order/purchases?tab=",
    form: "/purchase_order/purchases/form",
};

// Đơn đặt hàng PO

const routerOrder = {
    home: "/purchase_order/order?tab=",
    form: "/purchase_order/order/form",
};

// Nhập hàng

const routerImport = {
    home: "/purchase_order/import?tab=",
    form: "/purchase_order/import/form",
};

// Trả hàng

const routerReturns = {
    home: "/purchase_order/returns?tab=",
    form: "/purchase_order/returns/form",
};

export { routerPurchases, routerOrder, routerImport, routerReturns };
