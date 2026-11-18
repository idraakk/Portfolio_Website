import React from 'react';
import CodeView from '@/components/CodeView.jsx';
import { MdH1, MdH2, MdLink } from '@/components/tokens.jsx';
import { cv, FILES } from '@/data/cv.js';

const file = FILES.find((entry) => entry.id === 'products');

export default function ProductsMd() {
  const { collection, products } = cv;
  const productLines = products.flatMap((product) => [
    <MdH2 key={`${product.name}-heading`}>## {product.name}</MdH2>,
    <span key={`${product.name}-status`}>{product.platform} · {product.status}</span>,
    <span key={`${product.name}-description`}>{product.description}</span>,
    <span key={`${product.name}-link`}><MdLink href={product.url}>Explore {product.name}</MdLink></span>,
    product.previewUrl && (
      <span key={`${product.name}-preview`}><MdLink href={product.previewUrl}>Preview live in browser</MdLink></span>
    ),
  ]);

  return (
    <CodeView id="products" file={file} footer="markdown">
      <MdH1># Live Products</MdH1>
      <span>{collection.description}</span>
      <span><MdLink href={collection.url}>{collection.name}</MdLink> · <MdLink href={collection.repo}>Collection repository</MdLink></span>
      <></>
      {productLines}
    </CodeView>
  );
}
