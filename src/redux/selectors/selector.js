import { createSelector } from '@reduxjs/toolkit';
export const indexHomeTabSelector = state => state.listLayout?.HomeTab?.index;
export const listShopSelector = state => state.listShop.data;
export const listPetSelector = state => state.listPet.data;
export const listPetHideSelector = state => state.listPet.dataHide;
export const listProductSelector = state => state.listProduct.data;
export const listProductHideSelector = state => state.listProduct.dataHide;
export const listBillSelector = state => state.listBill.data;
export const shopSelectStatus = state => state.listShop.status;

export const selectShops = createSelector(
    listShopSelector,
    (shops) => {
        return shops;
    },
);

export const selectAllBills = createSelector(
    listBillSelector,
    (bills) => {
        return bills?.all?.listBill;
    },
);

export const selectCanActionAllBills = createSelector(
    listBillSelector,
    (bills) => {
        return [bills?.all?.canConfirmAll, bills?.all?.canCancelAll];
    },
);

export const selectProcessingBills = createSelector(
    listBillSelector,
    (bills) => {
        return bills?.processing?.listBill;
    },
);

export const selectCanActionProcessingBills = createSelector(
    listBillSelector,
    (bills) => {
        return [bills?.processing?.canConfirmAll, bills?.processing?.canCancelAll];
    },
);

export const selectDeliveringBills = createSelector(
    listBillSelector,
    (bills) => {
        return bills?.delivering;
    },
);

export const selectDeliveredBills = createSelector(
    listBillSelector,
    (bills) => {
        return bills?.delivered;
    },
);

export const selectEvaluatedBills = createSelector(
    listBillSelector,
    (bills) => {
        return bills?.evaluated;
    },
);

export const selectCancelledBills = createSelector(
    listBillSelector,
    (bills) => {
        return bills?.cancelled;
    },
);
