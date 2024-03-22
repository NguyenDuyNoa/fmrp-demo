const useActionRole = (auth, type) => {

    //conver lại type của be trả về theo type của mình thông qua props
    const conversionRules = {
        "quotes": "price_quote",
        "orders": "sales_product",
        "deliveries": "deliveryReceipt",
        "returned_goods": "returnSales",
        "customers": "client_customers",
        "client_contact": "client_contact",
        "client_status": "client_status",
        "client_group": "client_group",
        "suppliers": "suppliers",
        "contacts_suppliers": "contacts_suppliers",
        "suppliers_groups": "suppliers_groups",
        "material_category": "material_category",
        "materials": "materials",
        "category_products": "category_products",
        "products": "products",
        "staff": "personnel_staff",
        //   phần quyền ng dùng mà chỉ amdin mới sửa tọa axoas
        "department": "department",
        'purchases': "purchases",
        "purchase_order": "order",
        "position": "personnel_roles",
        "services": "serviceVoucher",
        "import": "import",
        "return_suppliers": 'returns',
        "warehouse": "warehouse",
        'warehouse_location': "warehouse_location",
        "transfer": "warehouseTransfer",
        "suggest_exporting": "production_warehouse",
        "purchase_products": "productsWarehouse",
        "purchase_internal": 'recall',
        "export_different": "exportToOther",
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

    let checkDelete = false;
    let checkEdit = false;
    let checkAdd = false;
    let checkExport = false;
    let checkBrowser = false;
    for (const x of convertedAuth) {
        if (x?.module == type) {
            if (x?.is_delete == 1) {
                checkDelete = true;
            }
            if (x?.is_edit == 1) {
                checkEdit = true;
            }
            if (x?.is_create == 1) {
                checkAdd = true;
            }
            if (x?.is_export == 1) {
                checkExport = true;
            }
            if (x?.is_agree == 1) {
                checkBrowser = true;
            }
        }
    }
    return { checkDelete, checkEdit, checkAdd, checkExport, checkBrowser };


    //     const checkDelete = convertedAuth.some(x => x?.module == type && x?.is_delete == 1);

    //     const checkEdit = convertedAuth.some(x => x?.module == type && x?.is_edit == 1);

    //     const checkAdd = convertedAuth.some(x => x?.module == type && x?.is_create == 1);

    //     const checkExport = convertedAuth.some(x => x?.module == type && x?.is_export == 1);

    //     const checkBrowser = convertedAuth.some(x => x?.module == type && x?.is_agree == 1);


    //     return { checkDelete, checkEdit, checkAdd, checkExport, checkBrowser };


}
export default useActionRole