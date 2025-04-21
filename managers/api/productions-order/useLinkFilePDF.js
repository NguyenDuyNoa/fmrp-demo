import apiProducts from "@/Api/apiProducts/products/apiProducts";


export const fetchPDFManufactures = async ({ idManufacture }) => {
    const { pdf_url } = await apiProducts.apiPostLinkPDFManufactures({
        data: {
            id: idManufacture,
        },
    });

    return pdf_url;
};

export const fetchPDFPlanManufactures = async ({ idManufacture }) => {
    const { pdf_url } = await apiProducts.apiPostLinkPDFPlanManufactures({
        data: {
            id: idManufacture,
        },
    });

    return pdf_url;
};

export const fetchItemsManufactures = async ({ idManufacture }) => {
    const res = await apiProducts.apiGetItemsManufactures({
        data: {
            id: idManufacture,
        },
    });

    return res;
};