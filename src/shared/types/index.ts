export type Nullable<T> = T | null;

export interface CountryOption {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

export interface AsyncState<T> {
  data: Nullable<T>;
  loading: boolean;
  error: Nullable<string>;
}
