import { AppDispatchType, AppRootStateType } from "utils/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {ResponseType} from "api/types";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatchType;
  rejectValue: null | ResponseType;
}>()