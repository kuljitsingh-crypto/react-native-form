import {createContext, useContext} from 'react';

type FormContextType = {
  values: Record<string, unknown>;
  touched: Record<string, unknown>;
  active: string | undefined;
  errors: Record<string, unknown>;
  primaryColor?: string;
  changeFormValues: (
    name: string,
    type: string,
    value: string | number | undefined,
  ) => void;
  addFieldToTouched: (name: string) => void;
  updateActiveField: (name: string, isFocused?: boolean) => void;
  addFieldError: (name: string, err: string | undefined | null) => void;
};

const ReactNativeFormContext = createContext<FormContextType>(undefined as any);

export const FormContextProvider = ReactNativeFormContext.Provider;

export const useFormContext = () => {
  const context = useContext(ReactNativeFormContext);
  return context;
};
