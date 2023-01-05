import type { QueryFunction, QueryKey, QueryOptions } from '@tanstack/query-core'
import { QueryObserver } from '@tanstack/query-core'
import type {
  CreateQueryOptions,
  CreateQueryResult,
  DefinedCreateQueryResult,
} from './types'
import { parseQueryArgs } from './utils'
import { createBaseQuery } from './createBaseQuery'
import { createStore } from '@stencil/store'

// There are several ways to create a query.
// 1. createQuery(options: CreateQueryOptions)
// 2. createQuery(querykey: () => Serializable[], options: CreateQueryOptions)
// 3. createQuery(querykey: () => Serializable[], queryFunc: Fetcher Function,  options: CreateQueryOptions)
// 4. The fourth overload is a combination of all three function params
export function createQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<
    CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'initialData'
  > & {
    initialData?: () => undefined
  },
): {result: CreateQueryResult<TData, TError>}
export function createQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<
    CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'initialData'
  > & {
    initialData: TQueryFnData | (() => TQueryFnData)
  },
): {result: DefinedCreateQueryResult<TData, TError>}
export function createQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): {result: CreateQueryResult<TData, TError>}
export function createQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<
    CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'initialData'
  > & { initialData?: () => undefined },
): {result: CreateQueryResult<TData, TError>}
export function createQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<
    CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'initialData'
  > & { initialData: TQueryFnData | (() => TQueryFnData) },
): {result: DefinedCreateQueryResult<TData, TError>}
export function createQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<
    CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey'
  >,
): {result: CreateQueryResult<TData, TError>}
export function createQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  // TODO(lukemurray): not sure if we want to use return type here
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  > & { initialData?: () => undefined },
): {result: CreateQueryResult<TData, TError>}
export function createQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  > & { initialData: TQueryFnData | (() => TQueryFnData) },
): {result: DefinedCreateQueryResult<TData, TError>}
export function createQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >,
): {result: CreateQueryResult<TData, TError>}
export function createQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  arg1: TQueryKey | CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg2?:
    | QueryFunction<TQueryFnData, TQueryKey>
    | CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  arg3?: CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): {result: CreateQueryResult<TData, TError>} {
  // The parseQuery Args functions helps normalize the arguments into the correct form.
  // Whatever the parameters are, they are normalized into the correct form.
  const queryArgsStore = createStore(
    parseQueryArgs(arg1, arg2, arg3),
  )

/*   // Watch for changes in the options and update the parsed options.
  createComputed(() => {
    const newParsedOptions = parseQueryArgs(arg1, arg2, arg3)
    setParsedOptions(newParsedOptions)
  })
 */
  return createBaseQuery(
    queryArgsStore.state as QueryOptions<any, any, any, TQueryKey>,
    QueryObserver,
  )
}
