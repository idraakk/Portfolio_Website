export const PRODUCT_RETURN_PARAM = 'microgram-return';

export function productReturnKind(search) {
  const kind = new URLSearchParams(search).get(PRODUCT_RETURN_PARAM);
  return kind === 'demo' || kind === 'collection' ? kind : null;
}
