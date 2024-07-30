//bán xuất hàng
const url = "/sales-export-product";

// Trả lại hàng bán

const routerReturnSales = {
    home: `${url}/return-sales`,
    form: `${url}/return-sales/form`,
};

// Phiếu giao hàng

const routerDeliveryReceipt = {
    home: `${url}/delivery-receipt`,
    form: `${url}/delivery-receipt/form`,
};
// báo giá
const routerPriceQuote = {
    home: `${url}/price-quote`,
    form: `${url}/price-quote/form`,
};

//đơn hàng bán
const routerSalesOrder = {
    home: `${url}/sales-order`,
    form: `${url}/sales-order/form`,
};

export { routerReturnSales, routerDeliveryReceipt, routerPriceQuote, routerSalesOrder };
