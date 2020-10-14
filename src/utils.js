export const debounced = (fn, wait) => {
  let timeoutId
  let target

  return (e) => {
    clearTimeout(timeoutId)

    if (e.target !== target) {
      return fn(e)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(e)
    }, wait)
  }
}
