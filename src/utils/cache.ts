import LRU from 'lru-cache'

const STORE_KEY = '_SLATHER_DATA'
const STORE_DELAY = 1000

const cache = new LRU({
  max: 1000,
  maxAge: 7 * 24 * 60 * 60 * 1000,
})

const data = localStorage.getItem(STORE_KEY)
try {
  const dump = JSON.parse(data || '')
  cache.load(dump)
} catch (e) {
  console.error(e)
}

const delayStore = ((ms: number) => {
  let timer: number
  return () => {
    if (timer) {
      clearTimeout(timer)
      timer = 0
    }
    timer = window.setTimeout(() => {
      console.log("store")
      const data = JSON.stringify(cache.dump())
      localStorage.setItem(STORE_KEY, data)
    }, ms)
  }
})(STORE_DELAY)

const get = (key: string) => {
  return cache.get(key)
}

const set = (key: string, value: any) => {
  console.log("set")
  cache.set(key, value)
  delayStore()
}

export default { get, set }
