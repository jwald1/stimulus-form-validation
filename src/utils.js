export const debounced = (fn, wait) => {
  let timeoutId

  return (...args) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, wait)
  }
}
