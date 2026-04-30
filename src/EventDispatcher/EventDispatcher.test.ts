import EventDispatcher from './EventDispatcher';

// テスト用イベントマップ
type TestEvents = {
  click: { x: number; y: number };
  change: { value: string };
  focus: { target: string };
};

describe('EventDispatcher', () => {
  let dispatcher: EventDispatcher<TestEvents>;

  beforeEach(() => {
    dispatcher = new EventDispatcher<TestEvents>();
  });

  // -------------------------
  // on
  // -------------------------
  describe('on', () => {
    it('登録したハンドラーがemit時に呼ばれる', () => {
      const handler = vi.fn();
      dispatcher.on('click', handler);
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).toHaveBeenCalledOnce();
    });

    it('emitのペイロードがEventInfoとしてハンドラーに渡される', () => {
      const handler = vi.fn();
      dispatcher.on('click', handler);
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).toHaveBeenCalledWith({
        type: 'click',
        payload: { x: 10, y: 20 },
      });
    });

    it('複数のハンドラーを登録するとすべて呼ばれる', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      dispatcher.on('click', handler1);
      dispatcher.on('click', handler2);
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).toHaveBeenCalledOnce();
    });

    it('異なるイベントのハンドラーは互いに干渉しない', () => {
      const clickHandler = vi.fn();
      const changeHandler = vi.fn();
      dispatcher.on('click', clickHandler);
      dispatcher.on('change', changeHandler);
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(clickHandler).toHaveBeenCalledOnce();
      expect(changeHandler).not.toHaveBeenCalled();
    });

    it('同一ハンドラーを重複登録しても1回しか呼ばれない', () => {
      const handler = vi.fn();
      dispatcher.on('click', handler);
      dispatcher.on('click', handler);
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).toHaveBeenCalledOnce();
    });

    it('イベント名の大文字小文字は区別されない', () => {
      const handler = vi.fn();
      dispatcher.on('click', handler);
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).toHaveBeenCalledOnce();
    });

    it('ownerを指定して登録できる', () => {
      const owner = {};
      const handler = vi.fn();
      dispatcher.on('click', handler, { owner });
      dispatcher.off('click', { owner });
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).not.toHaveBeenCalled();
    });
  });

  // -------------------------
  // off
  // -------------------------
  describe('off', () => {
    it('ハンドラーを指定して削除できる', () => {
      const handler = vi.fn();
      dispatcher.on('click', handler);
      dispatcher.off('click', { handler });
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).not.toHaveBeenCalled();
    });

    it('ownerを指定して削除できる', () => {
      const owner = {};
      const handler = vi.fn();
      dispatcher.on('click', handler, { owner });
      dispatcher.off('click', { owner });
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).not.toHaveBeenCalled();
    });

    it('ownerを指定して全イベントのハンドラーをまとめて削除できる', () => {
      const owner = {};
      const clickHandler = vi.fn();
      const changeHandler = vi.fn();
      dispatcher.on('click', clickHandler, { owner });
      dispatcher.on('change', changeHandler, { owner });
      dispatcher.off({ owner });
      dispatcher.emit('click', { x: 10, y: 20 });
      dispatcher.emit('change', { value: 'test' });
      expect(clickHandler).not.toHaveBeenCalled();
      expect(changeHandler).not.toHaveBeenCalled();
    });

    it('指定したowner以外のハンドラーは削除されない', () => {
      const owner1 = {};
      const owner2 = {};
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      dispatcher.on('click', handler1, { owner: owner1 });
      dispatcher.on('click', handler2, { owner: owner2 });
      dispatcher.off('click', { owner: owner1 });
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledOnce();
    });

    it('存在しないハンドラーを削除してもエラーにならない', () => {
      const handler = vi.fn();
      expect(() => dispatcher.off('click', { handler })).not.toThrow();
    });
  });

  // -------------------------
  // emit
  // -------------------------
  describe('emit', () => {
    it('ハンドラーが登録されていないイベントをemitしてもエラーにならない', () => {
      expect(() => dispatcher.emit('click', { x: 10, y: 20 })).not.toThrow();
    });

    it('emitの実行中にonが呼ばれても同回のemitには影響しない', () => {
      const handler2 = vi.fn();
      const handler1 = vi.fn(() => {
        dispatcher.on('click', handler2);
      });
      dispatcher.on('click', handler1);
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler1).toHaveBeenCalledOnce();
      expect(handler2).not.toHaveBeenCalled();
    });

    it('emitの実行中にoffが呼ばれても同回のemitには影響しない', () => {
      const handler2 = vi.fn();
      const handler1 = vi.fn(() => {
        dispatcher.off('click', { handler: handler2 });
      });
      dispatcher.on('click', handler1);
      dispatcher.on('click', handler2);
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler2).toHaveBeenCalledOnce();
    });
  });

  // -------------------------
  // suppress / unsuppress
  // -------------------------
  describe('suppress / unsuppress', () => {
    it('suppressするとemitが無効になる', () => {
      const handler = vi.fn();
      dispatcher.on('click', handler);
      dispatcher.suppress();
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).not.toHaveBeenCalled();
    });

    it('unsuppressするとemitが有効に戻る', () => {
      const handler = vi.fn();
      dispatcher.on('click', handler);
      dispatcher.suppress();
      dispatcher.unsuppress();
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).toHaveBeenCalledOnce();
    });

    it('suppressを複数回呼んだ場合、同じ回数unsuppressしないと有効に戻らない', () => {
      const handler = vi.fn();
      dispatcher.on('click', handler);
      dispatcher.suppress();
      dispatcher.suppress();
      dispatcher.unsuppress();
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).not.toHaveBeenCalled();
      dispatcher.unsuppress();
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).toHaveBeenCalledOnce();
    });

    it('unsuppressを余分に呼んでも抑止カウントが0未満にならない', () => {
      const handler = vi.fn();
      dispatcher.on('click', handler);
      dispatcher.unsuppress();
      dispatcher.unsuppress();
      dispatcher.emit('click', { x: 10, y: 20 });
      expect(handler).toHaveBeenCalledOnce();
    });
  });

  // -------------------------
  // destructor
  // -------------------------
  describe('destructor', () => {
    it('destructorを呼ぶと全ハンドラーが削除される', () => {
      const clickHandler = vi.fn();
      const changeHandler = vi.fn();
      dispatcher.on('click', clickHandler);
      dispatcher.on('change', changeHandler);
      dispatcher.destructor();
      dispatcher.emit('click', { x: 10, y: 20 });
      dispatcher.emit('change', { value: 'test' });
      expect(clickHandler).not.toHaveBeenCalled();
      expect(changeHandler).not.toHaveBeenCalled();
    });
  });

  // -------------------------
  // 親子の注入パターン
  // -------------------------
  describe('親子の注入パターン', () => {
    it('親のdispatcherを子に渡すと親経由でハンドラーが受け取れる', () => {
      type ParentEvents = {
        click: { x: number; y: number };
        change: { value: string };
      };

      class Child {
        readonly events: EventDispatcher<ParentEvents>;
        constructor(events: EventDispatcher<ParentEvents>) {
          this.events = events;
        }
        doClick() {
          this.events.emit('click', { x: 10, y: 20 });
        }
      }

      class Parent {
        readonly events = new EventDispatcher<ParentEvents>();
        private child = new Child(this.events);
        triggerChildClick() {
          this.child.doClick();
        }
      }

      const parent = new Parent();
      const handler = vi.fn();
      parent.events.on('click', handler);
      parent.triggerChildClick();
      expect(handler).toHaveBeenCalledWith({
        type: 'click',
        payload: { x: 10, y: 20 },
      });
    });
  });
});
