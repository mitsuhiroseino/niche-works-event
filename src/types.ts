import EventDispatcher from './EventDispatcher';

/**
 * イベントマップの基本型
 * キーがイベント名、値がペイロードの型
 */
export type EventMap = Record<string, Record<string, unknown>>;

/**
 * EventDispatcherを持つクラスのインターフェイス
 */
export interface Dispatchable<M extends EventMap = EventMap> {
  readonly events: EventDispatcher<M>;
}
