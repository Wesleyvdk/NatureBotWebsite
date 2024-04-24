export const singleton = <Value>(
  name: string,
  valueFactory: () => Value
): Value => {
  const g = global as any;
  g._singletons ??= {};
  g._singletons[name] ??= valueFactory();
  return g._singletons[name];
};
