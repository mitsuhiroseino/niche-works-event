/**
 * イベントマップの基本型\
 * キーがイベント名、値がペイロードの型
 */
export type EventMap = Record<string, Record<string, unknown>>;

/**
 * イベントの情報
 */
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

/**
 * ハンドラー追加時のオプション
 */
export type OnHandlerOptions = {
  /**
   * イベントハンドラーのオーナー
   */
  owner?: any;
};

/**
 * ハンドラー削除時のオプション\
 * ハンドラーを指定して削除する場合はhandlerを、\
 * オーナーを指定して削除する場合はownerを指定する（両方の指定は不可）
 */
export type OffHandlerOptions =
  | {
      /**
       * 削除対象のハンドラー
       */
      handler: EventHandler<any, any>;

      owner?: never;
    }
  | {
      /**
       * 削除対象のハンドラーのオーナー
       */
      owner: any;
      handler?: never;
    };

/**
 * EventDispatcherのインターフェイス
 */
export interface EventDispatcherLike<M extends EventMap = EventMap> {
  /**
   * イベントハンドラーを登録する\
   * 同一ハンドラーの重複登録は無視される
   */
  on<K extends keyof M>(
    type: K,
    handler: EventHandler<M, K>,
    options?: OnHandlerOptions,
  ): void;

  /**
   * イベントハンドラーを削除する\
   * @param type - イベント名。省略した場合は全イベントが対象になる\
   * @param options - handler を指定するとそのハンドラーのみ削除、owner を指定するとそのオーナーのハンドラーをすべて削除
   */
  off<K extends keyof M>(type: K, options?: OffHandlerOptions): void;
  off(options: OffHandlerOptions): void;
  off<K extends keyof M>(
    typeOrOptions: K | OffHandlerOptions,
    options?: OffHandlerOptions,
  ): void;

  /**
   * イベントを発火する
   */
  emit<K extends keyof M>(type: K, payload: M[K]): void;

  /**
   * イベントの発火を抑止する
   */
  suppress(): void;

  /**
   * イベントの発火抑止を解除する
   */
  unsuppress(): void;

  /**
   * 全ハンドラーを削除しリソースを解放する
   */
  destructor(): void;
}

/**
 * EventDispatcherLikeを持つクラスのインターフェイス
 */
export interface Dispatchable<M extends EventMap = EventMap> {
  readonly events: EventDispatcherLike<M>;
}
