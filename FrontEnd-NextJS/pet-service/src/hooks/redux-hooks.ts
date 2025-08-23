import { AppDispatch, RootState } from "@/store/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
