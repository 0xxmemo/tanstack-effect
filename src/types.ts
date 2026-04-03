import type { HttpClientResponse } from '@effect/platform'
import { Effect, Layer } from 'effect'
import type { Simplify } from 'effect/Types'

/**
 * @description Base interface to be augmented by consumers with their API client shape.
 */
export interface TTanstackEffectClient {}

/**
 * @description Base interface to be augmented by consumers with their API client shape.
 */
export type TTanstackEffectServiceTag = Effect.Effect<
  { client: TTanstackEffectClient },
  never,
  any
> & {
  Default: Layer.Layer<any, any, any>
}

/**
 * @description Get the request params
 * @param X - The key of the Tanstack Effect client
 * @param Y - The key of the Tanstack Effect client[X]
 * @returns The request params
 */
export type GetRequestParams<
  X extends keyof TTanstackEffectClient,
  Y extends keyof TTanstackEffectClient[X],
> = TTanstackEffectClient[X][Y] extends (params: infer TParams) => any
  ? TParams
  : never

/**
 * @description Get the return type
 * @param X - The key of the Tanstack Effect client
 * @param Y - The key of the Tanstack Effect client[X]
 * @returns The return type
 */
export type GetReturnType<
  X extends keyof TTanstackEffectClient,
  Y extends keyof TTanstackEffectClient[X],
> = TTanstackEffectClient[X][Y] extends (...args: any[]) => infer TReturn
  ? TReturn
  : never

/**
 * @description Exclude the HttpResponse tuple
 * @param T - The type to exclude the HttpResponse tuple from
 * @returns The type without the HttpResponse tuple
 */
export type ExcludeHttpResponseTuple<T> = T extends readonly [
  infer TSuccess,
  HttpClientResponse.HttpClientResponse,
]
  ? TSuccess
  : T

/**
 * @description Get the clean success type
 * @param X - The key of the Tanstack Effect client
 * @param Y - The key of the Tanstack Effect client[X]
 * @returns The clean success type
 */
export type ExtractEffectSuccess<T> =
  T extends Effect.Effect<infer TSuccess, any, any> ? TSuccess : never

export type GetCleanSuccessType<
  X extends keyof TTanstackEffectClient,
  Y extends keyof TTanstackEffectClient[X],
> =
  GetReturnType<X, Y> extends Effect.Effect<infer TSuccess, any, any>
    ? Simplify<TSuccess> extends infer TResolvedSuccess
      ? TResolvedSuccess extends readonly [
          any,
          HttpClientResponse.HttpClientResponse,
        ]
        ? TResolvedSuccess[0]
        : TResolvedSuccess
      : never
    : never

/**
 * @description Get the promise success type
 * @param X - The key of the Tanstack Effect client
 * @param Y - The key of the Tanstack Effect client[X]
 * @returns The promise success type
 */
export type PromiseSuccess<
  X extends keyof TTanstackEffectClient,
  Y extends keyof TTanstackEffectClient[X],
> = Promise<GetCleanSuccessType<X, Y>>

/**
 * @description Options for API calls
 */
export interface ApiCallOptions {
  /**
   * @description Whether to include credentials (cookies) in the request
   * @default false
   */
  includeCredentials?: boolean
  /**
   * @description Whether to bypass cache by setting X-No-Cache header
   * @default false
   */
  noCache?: boolean
}
