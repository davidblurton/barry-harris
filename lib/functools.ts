export const pipeline = <T>(value: T) => {
  return {
    pipeTo<R extends any>(fn: (value: T) => R) {
      return pipeline(fn(value));
    },
    value,
  };
};
