import type { EventHandler, OnHandlerOptions } from '../types';

/**
 * 内部でハンドラーを持つ際の形式
 */
export type HandlerEntry = {
  handler: EventHandler<any, any>;
  options: OnHandlerOptions;
};
