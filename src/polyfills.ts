// Fix for RN 0.77 Hermes: URL.protocol is a getter-only property
// but Expo internals try to assign to it, causing a TypeError.
const OrigURL = globalThis.URL;
if (OrigURL) {
  const desc = Object.getOwnPropertyDescriptor(OrigURL.prototype, 'protocol');
  if (desc && desc.get && !desc.set) {
    const store = new WeakMap<URL, string>();
    Object.defineProperty(OrigURL.prototype, 'protocol', {
      get() {
        return store.get(this) ?? desc.get!.call(this);
      },
      set(value: string) {
        store.set(this, value);
      },
      configurable: true,
      enumerable: true,
    });
  }
}

export {};
