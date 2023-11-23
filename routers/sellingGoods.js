// Trả lại hàng bán
const url = "/sales_export_product";
const routerReturnSales = {
    home: `${url}/returnSales`,
    form: `${url}/returnSales/form`,
};

// Phiếu giao hàng

const routerDeliveryReceipt = {
    home: `${url}/deliveryReceipt`,
    form: `${url}/deliveryReceipt/form`,
};
// báo giá
const routerPriceQuote = {
    home: `${url}/priceQuote`,
    form: `${url}/priceQuote/form`,
};

const routerSalesOrder = {
    home: `${url}/salesOrder`,
    form: `${url}/salesOrder/form`,
};

export { routerReturnSales, routerDeliveryReceipt, routerPriceQuote, routerSalesOrder };
