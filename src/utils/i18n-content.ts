export const useLocalizedField = () => {
  const { locale } = useCustomI18n();

  return <T extends Record<string, any>>(
    item: T,
    fieldBase: string,
  ): string => {
    const suffix = locale.value === 'pl' ? 'Pl' : 'En';
    return (item as any)[`${fieldBase}${suffix}`] ?? (item as any)[`${fieldBase}En`] ?? '';
  };
};
