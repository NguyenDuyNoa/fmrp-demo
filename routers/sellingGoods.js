//bán xuất hàng
const url = "/sales_export_product";

// Trả lại hàng bán

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

//đơn hàng bán
const routerSalesOrder = {
    home: `${url}/salesOrder`,
    form: `${url}/salesOrder/form`,
};

export { routerReturnSales, routerDeliveryReceipt, routerPriceQuote, routerSalesOrder };
