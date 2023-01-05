import type {
  ParseFilterArgs,
  ParseQueryArgs,
} from './types'
import type { QueryFilters, QueryFunction, QueryKey, QueryOptions } from '@tanstack/query-core'

export function isQueryKey(value: unknown): value is QueryKey {
  return typeof value === 'function'
}

// The parseQuery Args functions helps normalize the arguments into the correct form.
// Whatever the parameters are, they are normalized into the correct form.
export function parseQueryArgs<
  TOptions extends Omit<
    QueryOptions<any, any, any, TQueryKey>,
    'queryKey'
  > & {
    queryKey?: TQueryKey
  },
  TQueryKey extends readonly unknown[] = QueryKey,
>(
  arg1: TQueryKey | TOptions,
  arg2?: QueryFunction<any, TQueryKey> | TOptions,
  arg3?: TOptions,
): ParseQueryArgs<TOptions, TQueryKey> {
  if (!isQueryKey(arg1)) {
    return arg1 as any
  }

  if (typeof arg2 === 'function') {
    return { ...arg3, queryKey: arg1, queryFn: arg2 } as any
  }

  return { ...arg2, queryKey: arg1 } as any
}

export function parseFilterArgs<
  TFilters extends QueryFilters,
  TOptions = unknown,
>(
  arg1?: TFilters,
  arg2?: TFilters | TOptions,
  arg3?: TOptions,
): [ParseFilterArgs<TFilters>, TOptions | undefined] {
  return (
    isQueryKey(arg1)
      ? [{ ...arg2, queryKey: arg1 }, arg3]
      : [{ ...arg1, queryKey: arg1?.queryKey }, arg2]
  ) as [ParseFilterArgs<TFilters>, TOptions]
}

export function shouldThrowError<T extends (...args: any[]) => boolean>(
  _useErrorBoundary: boolean | T | undefined,
  params: Parameters<T>,
): boolean {
  // Allow useErrorBoundary function to override throwing behavior on a per-error basis
  if (typeof _useErrorBoundary === 'function') {
    return _useErrorBoundary(...params)
  }

  return !!_useErrorBoundary
}

export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

/**
 * Schedules a microtask.
 * This can be useful to schedule state updates after rendering.
 */
export function scheduleMicrotask(callback: () => void) {
  sleep(0).then(callback)
}
