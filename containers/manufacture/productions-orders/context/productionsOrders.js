import React, { createContext, useState } from 'react';

export const ProductionsOrdersContext = createContext();

const initialState = {
    isTab: "products",
    isTabList: undefined, // new
    countAll: 0,
    listDataLeft: [],
    listDataRight: {
        title: "",
        statusManufacture: null,
        dataPPItems: [],
        dataSemiItems: [],
    },
    openModal: false,
    next: null,
    page: 1,
    limit: 15,
    search: "",
    dataModal: {},
    valueOrders: null,
    valuePlan: null,
    valueProductionOrdersDetail: null,
    valueProductionOrders: null,
    valueProducts: [],
    valueBr: null,
    selectStatusFilter:[], // selected trạng thái sản xuất
    seletedRadioFilter: {
        id: 1,
        label: "Đơn hàng bán"
    }, // selected radio filter (đơn hàng bán/kh nội bộ)
    searchProductionOrders: "",
    searchOrders: "",
    searchPODetail: "",
    searchPlan: "",
    searchItemsVariant: "",
    date: { dateStart: null, dateEnd: null },
    idDetailProductionOrder: null,
};
export const ProductionsOrdersProvider = ({ children }) => {
    const [isStateProvider, setIsStateProvider] = useState(initialState);

    const queryState = (key) => setIsStateProvider((prve) => ({ ...prve, ...key }));

    return (
        <ProductionsOrdersContext.Provider value={{ isStateProvider, setIsStateProvider, queryState }}>
            {children}
        </ProductionsOrdersContext.Provider>
    );
};
