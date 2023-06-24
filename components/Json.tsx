export function Json(obj: any) {
  return <pre>{JSON.stringify(obj, undefined, 2)}</pre>;
}
