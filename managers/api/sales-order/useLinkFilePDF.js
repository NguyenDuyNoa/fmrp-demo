import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";

export const fetchPDFSaleOrder = async ({ id }) => {
    const res = await apiSalesOrder.apiPrintSaleOrder({
        data: {
            id: id,
        },
    });
    return res;
};

export const fetchPDFDelivery = async ({ id, type }) => {
    const res = await apiSalesOrder.apiPrintDelivery({
        data: {
            id: id,
            type: type
        },
    });
    return res;
};