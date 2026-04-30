import type { EventMap } from '../types';

export type EventInfo<
  M extends EventMap = EventMap,
  K extends keyof M = keyof M,
> = {
  /**
   * イベント名
   */
  type: K;

  /**
   * イベント発火時に設定された引数
   */
  payload: M[K];
};

/**
 * イベントハンドラー
 */
export type EventHandler<
  M extends EventMap = EventMap,
  K extends keyof M = keyof M,
> = (event: EventInfo<M, K>) => void;

export type OnHandlerOptions = {
  /**
   * イベントハンドラーのオーナー
   */
  owner?: any;
};

/**
 * ハンドラーを指定して削除する場合はhandlerを、
 * オーナーを指定して削除する場合はownerを指定する（両方の指定は不可）
 */
export type OffHandlerOptions =
  | { handler: EventHandler<any, any>; owner?: never }
  | { owner: any; handler?: never };

export type HandlerEntry = {
  handler: EventHandler<any, any>;
  options: OnHandlerOptions;
};
