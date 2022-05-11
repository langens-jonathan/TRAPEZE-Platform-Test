import { DependencyList, EffectCallback, useEffect } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useDebouncedEffect = (effect: EffectCallback, deps: DependencyList, delay: number) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...deps || [], delay]);
};