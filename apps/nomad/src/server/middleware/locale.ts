export default defineEventHandler((event) => {
  const query = getQuery(event);
  event.context.lang = query.lang ?? getCookie(event, 'i18n_locale') ?? 'en';
});
