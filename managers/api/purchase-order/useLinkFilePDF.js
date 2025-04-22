import apiOrder from "@/Api/apiPurchaseOrder/apiOrder";

export const fetchPDFPurchaseOrder = async ({ id }) => {
    const res = await apiOrder.apiPrintPurchaseOrder({
        data: {
            id: id,
        },
    });
    return res;
};

export const fetchPDFPurchaseOrderImport = async ({ id, type }) => {
    const res = await apiOrder.apiPrintPurchaseImport({
        data: {
            id: id,
            type: type
        },
    });
    return res;
};