/* istanbul ignore file */

import type {
  QueryClient,
  QueryKey,
  QueryObserverOptions,
  QueryObserverResult,
  MutateFunction,
  MutationObserverOptions,
  MutationObserverResult,
  DefinedQueryObserverResult,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
  QueryFilters,
  QueryOptions,
} from '@tanstack/query-core'
import { ObservableMap } from '@stencil/store'

export interface StoreOptions {
  /**
   * Use this to pass your Stencil Query store. Otherwise, `defaultStore` will be used.
   */
  store?: ObservableMap<{client: QueryClient | undefined}>
}

export interface CreateBaseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends StoreOptions,
    QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey> {}

export interface CreateQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = QueryKey,
> extends Omit<
    CreateBaseQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >,
    'queryKey'
  > {
  queryKey?: TQueryKey
}

export type CreateBaseQueryResult<
  TData = unknown,
  TError = unknown,
> = QueryObserverResult<TData, TError>

export type CreateQueryResult<
  TData = unknown,
  TError = unknown,
> = CreateBaseQueryResult<TData, TError>

export type DefinedCreateBaseQueryResult<
  TData = unknown,
  TError = unknown,
> = DefinedQueryObserverResult<TData, TError>

export type DefinedCreateQueryResult<
  TData = unknown,
  TError = unknown,
> = DefinedCreateBaseQueryResult<TData, TError>

export type ParseQueryArgs<
  TOptions extends Omit<
    QueryOptions<any, any, any, TQueryKey>,
    'queryKey'
  > & {
    queryKey?: TQueryKey
  },
  TQueryKey extends readonly unknown[] = QueryKey,
> = TOptions['queryKey'] extends () => infer R
  ? Omit<TOptions, 'queryKey'> & { queryKey?: R }
  : TOptions

/* --- Create Infinite Queries Types --- */
export interface CreateInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends readonly unknown[] = QueryKey,
> extends StoreOptions,
    Omit<
      InfiniteQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey
      >,
      'queryKey'
    > {
  queryKey?: TQueryKey
}

export type CreateInfiniteQueryResult<
  TData = unknown,
  TError = unknown,
> = InfiniteQueryObserverResult<TData, TError>

/* --- Create Mutation Types --- */
export interface CreateMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TStore = unknown,
> extends StoreOptions,
    Omit<
      MutationObserverOptions<TData, TError, TVariables, TStore>,
      '_defaulted' | 'variables'
    > {}

export type CreateMutateFunction<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = (
  ...args: Parameters<MutateFunction<TData, TError, TVariables, TContext>>
) => void

export type CreateMutateAsyncFunction<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
> = MutateFunction<TData, TError, TVariables, TContext>

export type CreateBaseMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
> = Override<
  MutationObserverResult<TData, TError, TVariables, TContext>,
  { mutate: CreateMutateFunction<TData, TError, TVariables, TContext> }
> & {
  mutateAsync: CreateMutateAsyncFunction<TData, TError, TVariables, TContext>
}

export type CreateMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
> = CreateBaseMutationResult<TData, TError, TVariables, TContext>

type Override<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] }

/* --- Use Is Fetching Types --- */


export type ParseFilterArgs<T extends QueryFilters> =
  T['queryKey'] extends () => infer R ? T & { queryKey: R } : T
