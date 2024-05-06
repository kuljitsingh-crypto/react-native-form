import {useMemo} from 'react';

type OptionType = {value: string | number; label: string};

const isOptionValid = (options: OptionType[]) => {
  return !!(
    Array.isArray(options) &&
    options.every(
      option =>
        option &&
        option.value &&
        option.label &&
        typeof option.label === 'string' &&
        (typeof option.value === 'string' || typeof option.value === 'number'),
    )
  );
};

export const useOptionValidator = (options: OptionType[]) => {
  const isOptionCorrect = useMemo(() => isOptionValid(options), [options]);
  if (!isOptionCorrect) {
    throw new Error(
      'The Options should be an array of objects, each object must include properties named value and label.',
    );
  }
};
