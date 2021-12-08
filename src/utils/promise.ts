export const sequential = <T>(targets: (() => Promise<T>)[]): Promise<T[]> => {
  return targets.reduce(async (p, t) => {
    const res = await p
    return [...res, await t()]
  }, Promise.resolve([]) as Promise<T[]>)
}
