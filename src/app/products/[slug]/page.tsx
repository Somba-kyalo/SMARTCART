import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Truck } from "lucide-react";
import { formatKes, products } from "@/lib/products";
import { AddToBagButton } from "@/components/add-to-bag-button";

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.id === slug);
  return product
    ? { title: `${product.name} | SmartCart Africa`, description: product.description }
    : { title: "Product | SmartCart Africa" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.id === slug);

  if (!product) {
    return <main className="product-not-found"><p className="eyebrow">That find has moved</p><h1>We couldn’t find that product.</h1><Link href="/#shop" className="button button-dark">Back to the shop <ArrowRight size={16} /></Link></main>;
  }

  return (
    <main className="product-page">
      <header className="product-page-header">
        <Link href="/" className="brand" aria-label="SmartCart Africa home"><span className="brand-mark">S<span>↔</span></span><span className="brand-name">smartcart<span>africa</span></span></Link>
        <Link href="/#shop" className="back-link"><ArrowLeft size={15} /> Back to all finds</Link>
        <Link href="/#shop" className="cart-trigger"><ShoppingBag size={18} /><span>Bag</span></Link>
      </header>
      <div className="product-detail">
        <div className="product-detail-image"><img src={product.image} alt={product.imageAlt} /><span>{product.tag ?? "Thoughtful pick"}</span></div>
        <div className="product-detail-copy">
          <p className="eyebrow">{product.category}</p><h1>{product.name}</h1>
          <div className="detail-price"><strong>{formatKes(product.price)}</strong>{product.oldPrice && <del>{formatKes(product.oldPrice)}</del>}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-availability"><Check size={16} /> In stock · {product.colors}</div>
          <AddToBagButton product={product} />
          <p className="detail-note">The bag is currently managed from the main shop. Secure checkout and delivery details will be connected in the next commerce milestone.</p>
          <div className="detail-promises"><span><Truck size={17} /> Delivery across Kenya</span><span><Check size={17} /> Fair, clear pricing</span></div>
        </div>
      </div>
    </main>
  );
}
