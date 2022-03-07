import { GET_GLOSSARYTERMS, GET_TOOLTIPTERMS } from '../constants/ActionTypes';

const initialState = {
  error: null,
  hasErrror: false,
  result: [],
  loadingResults: false,
};

export const glossarytermsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case `${GET_GLOSSARYTERMS}_PENDING`:
      return {
        ...state,
        loadingResults: true,
      };
    case `${GET_GLOSSARYTERMS}_SUCCESS`:
      return {
        ...state,
        result: action.result,
        loadingResults: false,
      };
    case `${GET_GLOSSARYTERMS}_FAIL`:
      return {
        ...state,
        error: action.error,
        hasError: true,
        loadingResults: false,
      };
    default:
      return state;
  }
};

export const glossarytooltiptermsReducer = (
  state = initialState,
  action = {},
) => {
  switch (action.type) {
    case `${GET_TOOLTIPTERMS}_PENDING`:
      return {
        ...state,
        loadingResults: true,
      };
    case `${GET_TOOLTIPTERMS}_SUCCESS`:
      return {
        ...state,
        result: action.result,
        loadingResults: false,
      };
    case `${GET_TOOLTIPTERMS}_FAIL`:
      return {
        ...state,
        error: action.error,
        hasError: true,
        loadingResults: false,
      };
    default:
      return state;
  }
};
