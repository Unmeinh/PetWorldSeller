import { createSelector } from '@reduxjs/toolkit';
export const listShopSelector = state => state.listShop.data;
export const listPetSelector = state => state.listPet.data;
export const listProductSelector = state => state.listProduct.data;
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
        return bills?.all;
    },
);

export const selectProcessingBills = createSelector(
    listBillSelector,
    (bills) => {
        return bills?.processing;
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
