import type {
  QueryObserver,
  QueryFunction,
  QueryOptions,
  QueryKey,
} from '@tanstack/query-core'
import { InfiniteQueryObserver } from '@tanstack/query-core'
import type {
  CreateInfiniteQueryOptions,
  CreateInfiniteQueryResult,
} from './types'
import { createBaseQuery } from './createBaseQuery'
import { parseQueryArgs } from './utils'

export function createInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: CreateInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >,
): {result: CreateInfiniteQueryResult<TData, TError>}
export function createInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<
    CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >,
    'queryKey'
  >,
): {result: CreateInfiniteQueryResult<TData, TError>}
export function createInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >,
    'queryKey' | 'queryFn'
  >,
): {result: CreateInfiniteQueryResult<TData, TError>}
export function createInfiniteQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  arg1:
    | TQueryKey
    | CreateInfiniteQueryOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
      >,
  arg2?:
    | QueryFunction<TQueryFnData, TQueryKey>
    | CreateInfiniteQueryOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
      >,
  arg3?: CreateInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >,
): {result: CreateInfiniteQueryResult<TData, TError>} {
  // The parseQuery Args functions helps normalize the arguments into the correct form.
  // Whatever the parameters are, they are normalized into the correct form.
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3);

  return createBaseQuery(
    parsedOptions as QueryOptions<any, any, any, TQueryKey>,
    InfiniteQueryObserver as typeof QueryObserver,
  ) as {result: CreateInfiniteQueryResult<TData, TError>}
}
