import { BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import { AppDispatchType, AppRootStateType } from "utils/types";
import { appActions } from "features/CommonActions/App";
import { handleAsyncServerNetworkError } from "utils/error-utils";

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatchType, null | ResponseType>,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const {dispatch, rejectWithValue} = thunkAPI;
  dispatch(appActions.setAppStatus({status: 'loading'}));
  try {
    return await logic();
  } catch (e) {
    handleAsyncServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatus({status: 'idle'}));
  }
}