import apiProducts from "@/Api/apiProducts/products/apiProducts";


export const fetchPDFManufactures = async ({ idManufacture }) => {
    const { pdf_url } = await apiProducts.apiPostLinkPDFManufactures({
        data: {
            id: idManufacture,
        },
    });

    return pdf_url;
};
