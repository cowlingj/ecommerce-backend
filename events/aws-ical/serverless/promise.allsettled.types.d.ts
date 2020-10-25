export type PromiseResolvedResult<T> = { status: 'fulfilled', value: T }
export type PromiseRejectedResult = { status: 'rejected', reason: any }
export type PromiseResult<T> = PromiseResolvedResult<T> | PromiseRejectedResult