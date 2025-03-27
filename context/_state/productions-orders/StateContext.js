import React, { createContext, useState } from 'react';

export const StateContext = createContext();

const initialState = {
    productionsOrders: {
        isTabSheet: undefined,
        isTabList: undefined, // new
        countAll: 0,
        productionOrdersList: [],
        // listDataRight: {
        //     title: "",
        //     statusManufacture: null,
        //     dataPPItems: [],
        //     dataSemiItems: [],
        // },
        // openModal: false,
        next: null,
        page: 1,
        limit: 10,
        search: "",
        dataModal: {},
        valueOrders: null,
        valuePlan: null,
        valueProductionOrdersDetail: null,
        valueProductionOrders: null,
        valueProducts: [],
        valueBr: null,
        dataProductionOrderDetail: undefined,
        selectStatusFilter: [], // selected trạng thái sản xuất
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
        itemDetailPoi: undefined,
    }
};
export const StateProvider = ({ children }) => {
    const [isStateProvider, setIsStateProvider] = useState(initialState);

    const queryStateProvider = (key) => setIsStateProvider((prve) => ({ ...prve, ...key }));

    return (
        <StateContext.Provider value={{ isStateProvider, setIsStateProvider, queryStateProvider }}>
            {children}
        </StateContext.Provider>
    );
};
