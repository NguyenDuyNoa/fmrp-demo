//bán xuất hàng
const url = "/sales_export_product";

// Trả lại hàng bán

const routerReturnSales = {
    home: `${url}/return_sales`,
    form: `${url}/return_sales/form`,
};

// Phiếu giao hàng

const routerDeliveryReceipt = {
    home: `${url}/delivery_receipt`,
    form: `${url}/delivery_receipt/form`,
};
// báo giá
const routerPriceQuote = {
    home: `${url}/price_quote`,
    form: `${url}/price_quote/form`,
};

//đơn hàng bán
const routerSalesOrder = {
    home: `${url}/sales_order`,
    form: `${url}/sales_order/form`,
};

export { routerReturnSales, routerDeliveryReceipt, routerPriceQuote, routerSalesOrder };
