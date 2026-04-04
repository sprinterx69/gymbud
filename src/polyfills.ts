// Fix for RN 0.77+ Hermes: URL.protocol is defined as getter-only,
// but Expo internals (getManifestBaseUrl) try to assign to it.
try {
  const OrigURL = globalThis.URL;
  if (OrigURL) {
    const desc = Object.getOwnPropertyDescriptor(OrigURL.prototype, 'protocol');
    if (desc?.get && !desc.set) {
      const store = new WeakMap<object, string>();
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
} catch {
  // polyfill failed silently — app will still attempt to run
}

export {};
