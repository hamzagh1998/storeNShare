export async function tryToCatch(fn: Function, ...args: any): Promise<[any, any]> {
  
  try {
    return [null, await fn(...args)]
  } catch (error) {
    return [error, null]
  };
};