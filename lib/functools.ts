export const pipeline = <T>(value: T) => {
  return {
    pipeTo<R extends any>(fn: (value: T) => R) {
      return pipeline(fn(value));
    },
    value,
  };
};

export function range(length: number): number[] {
  return Array.from({ length }, (_, i) => i);
}
