import type { WritableComputedRef } from 'vue';
import type { Language } from '~/constants/global.constant';

export const useCustomI18n = () => {
  const { locale, ...options } = useI18n();

  return {
    ...options,
    locale: locale as WritableComputedRef<Language>,
  };
};
