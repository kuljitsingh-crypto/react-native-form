export const setNestedObjectValue = (
  name: string,
  value: string | number | Record<string, unknown> | undefined,
) => {
  const nameArr = name.replace(/\.{1,}$/, '').split('.');
  const arrObject: Record<string, unknown> = {};
  let obj = arrObject;
  const nameArrLength = nameArr.length;
  const lastIndx = nameArrLength - 1;
  for (let i = 0; i < nameArrLength; i++) {
    if (i === lastIndx) {
      obj[nameArr[i]] = value;
    } else {
      obj[nameArr[i]] = {};
      obj = obj[nameArr[i]] as Record<string, unknown>;
    }
  }
  return arrObject;
};

const getObjectValue = (value: any): string | number =>
  typeof value === 'object' &&
  value.constructor === Object &&
  typeof value.value !== 'undefined'
    ? value.value
    : value;

export const pushValueToNestedObject = (
  name: string,
  obj: Record<string, unknown>,
  value: string | number | Record<string, unknown> | Record<string, unknown>[],
  shouldRemoveIfExists?: boolean,
) => {
  const nameArr = name.replace(/\.{1,}$/, '').split('.');
  const arrObject: Record<string, unknown> = {};
  let current = arrObject,
    objRef = obj,
    temp,
    i;
  const lastIndx = nameArr.length - 1;
  for (i = 0; i < lastIndx; i++) {
    temp = nameArr[i];
    current[temp] = {};
    current = current[temp] as Record<string, unknown>;
    objRef = (objRef[temp] || {}) as Record<string, unknown>;
  }
  const lastKeyName = nameArr[lastIndx];
  const preValue = (objRef[lastKeyName] || []) as (
    | string
    | number
    | Record<string, unknown>
  )[];
  const isArrayTypeValue = Array.isArray(value);
  const finalValue = isArrayTypeValue ? value : getObjectValue(value);
  const isValueExist = isArrayTypeValue
    ? false
    : preValue.some(v => getObjectValue(v) === finalValue);

  const newValue = isValueExist
    ? shouldRemoveIfExists
      ? preValue.filter(v => getObjectValue(v) !== finalValue)
      : [...preValue]
    : isArrayTypeValue
    ? [...value]
    : [...preValue, value];
  current[lastKeyName] = newValue;
  return arrObject;
};

export const getNestedObjectValue = (
  name: string,
  obj: Record<string, unknown>,
) => {
  const nameArr = name.replace(/\.{1,}$/, '').split('.');
  let value = obj;
  for (let name of nameArr) {
    if (!(name in value)) {
      return undefined;
    }
    value = value[name] as Record<string, unknown>;
  }

  return value as unknown;
};
