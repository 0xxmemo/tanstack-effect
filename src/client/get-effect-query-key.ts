import type { GetRequestParams, TTanstackEffectClient } from '../types'

/**
 * Build the React Query key used by `useEffectQuery` /
 * `useEffectInfiniteQuery`. Shape must stay aligned with the keys those
 * hooks build internally — see `use-effect-query.ts` and
 * `use-effect-infinite-query.ts`.
 */
export function getEffectQueryKey<
  X extends keyof TTanstackEffectClient,
  Y extends keyof TTanstackEffectClient[X],
>(
  section: X,
  method: Y,
  params: GetRequestParams<X, Y>,
  includeCredentials = false,
  noCache = false
): readonly [X, Y, GetRequestParams<X, Y>, boolean, boolean] {
  return [section, method, params, includeCredentials, noCache] as const
}
