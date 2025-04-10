import React, { createContext, useState } from 'react';

export const StateContext = createContext();

const initialState = {
    productionsOrders: {
        poiId: undefined,
        isTabSheet: undefined,
        isTabList: undefined, // new
        countAll: 0,
        productionOrdersList: [],
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
        limitSheet: {
            limitMaterialCost: 5,
            limitMaterialReturn: 5,
            limitFGReceiptHistory: 5,
            limitMaterialIssueHistory: 5,
        },
        searchSheet: {
            searchMaterialCost: "",
            searchMaterialReturn: "",
            searchFGReceiptHistory: "",
            searchMaterialIssueHistory: "",
            searchMaterialOutput: ""
        },
        selectedImages: [], // ✅ thêm mới
        uploadProgress: {},  // ✅ thêm mới
        inputCommentText: "",
        taggedUsers: []
    },
};
export const StateProvider = ({ children }) => {
    const [isStateProvider, setIsStateProvider] = useState(initialState);

    const queryStateProvider = (updater) => {
        setIsStateProvider((prev) => {
            const next = typeof updater === "function" ? updater(prev) : updater;

            return {
                productionsOrders: {
                    ...prev.productionsOrders, // Giữ lại state hiện tại
                    ...next.productionsOrders // Gộp với state mới
                }
            };
        });
    };

    return (
        <StateContext.Provider value={{ isStateProvider, setIsStateProvider, queryStateProvider }}>
            {children}
        </StateContext.Provider>
    );
};
