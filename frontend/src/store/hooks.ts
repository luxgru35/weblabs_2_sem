// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Обёртка для useDispatch с типизацией
export const useAppDispatch: () => AppDispatch = useDispatch;

// Обёртка для useSelector с типизацией
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
