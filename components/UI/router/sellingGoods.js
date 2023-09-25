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
export { routerReturnSales, routerDeliveryReceipt };
