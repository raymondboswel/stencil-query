import type {
  QueryObserver,
  QueryFunction,
  QueryOptions,
} from '@tanstack/query-core'
import { InfiniteQueryObserver } from '@tanstack/query-core'
import type {
  CreateInfiniteQueryOptions,
  CreateInfiniteQueryResult,
  SolidQueryKey,
} from './types'
import { createBaseQuery } from './createBaseQuery'
import { parseQueryArgs } from './utils'

export function createInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends SolidQueryKey = SolidQueryKey,
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
  TQueryKey extends SolidQueryKey = SolidQueryKey,
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
  TQueryKey extends SolidQueryKey = SolidQueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, ReturnType<TQueryKey>>,
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
  TQueryKey extends SolidQueryKey = SolidQueryKey,
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
    | QueryFunction<TQueryFnData, ReturnType<TQueryKey>>
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
    parsedOptions as QueryOptions<any, any, any, ReturnType<TQueryKey>>,
    InfiniteQueryObserver as typeof QueryObserver,
  ) as {result: CreateInfiniteQueryResult<TData, TError>}
}
