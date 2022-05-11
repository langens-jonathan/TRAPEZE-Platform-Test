import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authenticationReducer from '../features/authentication/authenticationSlice';
import jobOffersReducer from '../features/job-offers/jobOffersSlice';

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    jobOffers: jobOffersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
