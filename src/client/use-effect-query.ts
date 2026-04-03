'use client'

import type {
  DefinedUseQueryResult,
  UndefinedInitialDataOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { EffectHttpError } from '../error'
import { apiEffectRunner } from '../runner'
import type {
  ApiCallOptions,
  GetCleanSuccessType,
  GetRequestParams,
  TTanstackEffectClient,
} from '../types'

/**
 * @description Create the Tanstack query helper with proper initialData type inference
 * Overloads 1: When initialData is provided, data is non-nullable
 * @param section
 * @param method
 * @param params
 * @param options - API call options and React Query options
 * @returns
 */
export function useEffectQuery<
  X extends keyof TTanstackEffectClient,
  Y extends keyof TTanstackEffectClient[X],
>(
  section: X,
  method: Y,
  params: GetRequestParams<X, Y>,
  options: ApiCallOptions &
    Omit<
      UndefinedInitialDataOptions<
        GetCleanSuccessType<X, Y>,
        EffectHttpError,
        GetCleanSuccessType<X, Y>,
        readonly unknown[]
      >,
      'queryKey' | 'queryFn'
    > & {
      initialData: GetCleanSuccessType<X, Y> | (() => GetCleanSuccessType<X, Y>)
    }
): DefinedUseQueryResult<GetCleanSuccessType<X, Y>, EffectHttpError>

export function useEffectQuery<
  X extends keyof TTanstackEffectClient,
  Y extends keyof TTanstackEffectClient[X],
>(
  section: X,
  method: Y,
  params: GetRequestParams<X, Y>,
  options?: ApiCallOptions &
    Omit<
      UndefinedInitialDataOptions<
        GetCleanSuccessType<X, Y>,
        EffectHttpError,
        GetCleanSuccessType<X, Y>,
        readonly unknown[]
      >,
      'queryKey' | 'queryFn'
    >
): UseQueryResult<
  GetCleanSuccessType<X, Y> extends never ? {} : GetCleanSuccessType<X, Y>,
  EffectHttpError
>

// Implementation
export function useEffectQuery<
  X extends keyof TTanstackEffectClient,
  Y extends keyof TTanstackEffectClient[X],
>(
  section: X,
  method: Y,
  params: GetRequestParams<X, Y>,
  options?: ApiCallOptions &
    Omit<
      UndefinedInitialDataOptions<
        GetCleanSuccessType<X, Y>,
        EffectHttpError,
        GetCleanSuccessType<X, Y>,
        readonly unknown[]
      >,
      'queryKey' | 'queryFn'
    >
) {
  const {
    includeCredentials = false,
    noCache = false,
    ...useQueryParams
  } = options || {}

  const query = useQuery<GetCleanSuccessType<X, Y>, EffectHttpError>({
    queryKey: [section, method, params, includeCredentials, noCache],
    queryFn: () =>
      apiEffectRunner(section, method, params, includeCredentials, noCache),
    ...useQueryParams,
  })

  return query as UseQueryResult<GetCleanSuccessType<X, Y>, EffectHttpError>
}
