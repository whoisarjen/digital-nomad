export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  if (url.pathname === '/' && !url.searchParams.has('months')) {
    const currentMonth = new Date().getMonth() + 1
    const monthString = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`
    return sendRedirect(event, `/?months=${monthString}`, 302)
  }
})
