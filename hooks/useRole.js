const useActionRole = (auth, type) => {
    const conversionRules = {
        "quotes": "price_quote",
        "orders": "sales_product",
        "deliveries": "deliveryReceipt",
        "returned_goods": "returnSales",
        "customers": "client_customers",
        "client_contact": "client_contact",
        "client_status": "client_status",
        "client_group": "client_group"
        // Thêm các type ||  nameModel


    };

    const convertedAuth = Object.entries(auth)?.map(([key, item]) => {
        const newModel = conversionRules[item?.module] || item?.module;
        return {
            key,
            ...item,
            module: newModel
        };
    });

    const checkDelete = convertedAuth.some(x => x?.module == type && x?.is_delete == 1);

    const checkEdit = convertedAuth.some(x => x?.module == type && x?.is_edit == 1);

    const checkAdd = convertedAuth.some(x => x?.module == type && x?.is_create == 1);

    const checkExport = convertedAuth.some(x => x?.module == type && x?.is_export == 1);

    const checkBrowser = convertedAuth.some(x => x?.module == type && x?.is_agree == 1);


    return { checkDelete, checkEdit, checkAdd, checkExport, checkBrowser };
}
export default useActionRole