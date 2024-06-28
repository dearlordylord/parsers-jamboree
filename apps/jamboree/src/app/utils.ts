// dyrty, view-only
export const get = (obj: any, path: readonly (string | number)[]) => {
  const travel = (path: readonly (string | number)[]) =>
    path.reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  return travel(path);
};
