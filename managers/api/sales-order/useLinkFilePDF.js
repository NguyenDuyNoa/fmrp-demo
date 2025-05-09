import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";
import apiReceipts from "@/Api/apiAccountant/apiReceipts";

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

export const fetchPDFReceipts = async ({ id }) => {
    const res = await apiReceipts.apiPrintReceipts({
        data: {
            id: id,
        },
    });
    return res;
};

export const fetchPDFPayments = async ({ id }) => {
    const res = await apiReceipts.apiPrintPayments({
        data: {
            id: id,
        },
    });
    return res;
};