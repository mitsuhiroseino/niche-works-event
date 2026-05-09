import type { EventHandler, OnHandlerOptions } from '../types';

/**
 * 内部でハンドラーを持つ際の形式
 */
export type HandlerEntry = {
  /**
   * ハンドラー
   */
  handler: EventHandler<any, any>;

  /**
   * オプション
   */
  options: OnHandlerOptions;
};
