"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Heart, Menu, Minus, Plus, Search, ShoppingBag, Truck, X } from "lucide-react";
import { categories, formatKes, products, type Product } from "@/lib/products";
import { useCart } from "@/components/cart-provider";

export default function HomePage() {
  const [category, setCategory] = useState("All finds");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");

  const { cart, itemCount, subtotal, addToCart, changeQuantity, removeFromCart } = useCart();

  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matching = products.filter((product) =>
      (category === "All finds" || product.category === category) &&
      (!normalized || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(normalized))
    );
    if (sort === "Price: low to high") return matching.sort((a, b) => a.price - b.price);
    if (sort === "Price: high to low") return matching.sort((a, b) => b.price - a.price);
    return matching;
  }, [category, query, sort]);

  function addProduct(product: Product) {
    addToCart(product);
    setToast(`${product.name} added to your bag`);
    window.setTimeout(() => setToast(""), 2300);
  }

  return (
    <main id="main-content">
      <div className="announcement">Thoughtful finds, delivered across Kenya <span>•</span> Pay securely with M-Pesa</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SmartCart Africa home"><span className="brand-mark">S<span>↗</span></span><span className="brand-name">smartcart<span>africa</span></span></a>
        <nav className={`main-nav ${mobileMenu ? "is-open" : ""}`} aria-label="Main navigation">
          <a href="#shop" onClick={() => setMobileMenu(false)}>Shop all</a><a href="#categories" onClick={() => setMobileMenu(false)}>Categories</a><a href="#story" onClick={() => setMobileMenu(false)}>Our promise</a>
        </nav>
        <div className="header-actions">
          <label className="search-box"><Search size={17}/><input aria-label="Search products" placeholder="Search for something good" value={query} onChange={(event) => { setQuery(event.target.value); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}/><kbd>⌘ K</kbd></label>
          <button className="icon-button account-button" aria-label="Your account" onClick={() => { setToast("Customer accounts are coming soon"); window.setTimeout(() => setToast(""), 2300); }}><span>Hi, there</span><ArrowUpRight size={17}/></button>
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Shopping bag, ${itemCount} items`}><ShoppingBag size={19}/><span>Bag</span><b>{itemCount}</b></button>
          <button className="mobile-menu-button" aria-label={mobileMenu ? "Close menu" : "Open menu"} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot"/> Good finds for everyday life</p><h1>Little things.<br/><em>Better days.</em></h1><p className="hero-description">Useful, well-made finds that make home feel warmer and everyday life work a little better.</p><a className="button button-dark" href="#shop">Find your next favourite <ArrowRight size={17}/></a><div className="hero-note"><span className="note-line"/> A more thoughtful way to shop, made for Kenya.</div></div>
        <div className="hero-visual"><div className="hero-photo" role="img" aria-label="Curated home and lifestyle essentials"/><div className="hero-sticker"><span>Good things</span><strong>live here</strong><ArrowDown size={18}/></div><div className="hero-caption"><span>THE EVERYDAY EDIT</span><span>01 / 04</span></div><div className="hero-image-frame"/></div>
      </section>

      <section className="trust-strip" aria-label="Shopping benefits"><div><Truck size={19}/><span>Delivery across Kenya</span></div><div><Check size={18}/><span>Thoughtful picks, fair prices</span></div><div><ShoppingBag size={18}/><span>Secure checkout, always</span></div><div className="trust-small">Made for your everyday <span>✳</span></div></section>

      <section className="category-section" id="categories"><div className="section-heading"><div><p className="eyebrow">A good place to start</p><h2>Shop by <em>feeling.</em></h2></div><a href="#shop" className="text-link">See all finds <ArrowUpRight size={16}/></a></div><div className="category-grid">
        <button className="category-tile tile-home" onClick={() => { setCategory("Home & Living"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}><span className="category-number">01</span><span className="category-text"><strong>Home & living</strong><small>Make room for calm</small></span><ArrowUpRight size={19}/></button>
        <button className="category-tile tile-carry" onClick={() => { setCategory("Bags & Accessories"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}><span className="category-number">02</span><span className="category-text"><strong>Bags & accessories</strong><small>Carry a little lighter</small></span><ArrowUpRight size={19}/></button>
        <button className="category-tile tile-daily" onClick={() => { setCategory("Everyday Essentials"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}><span className="category-number">03</span><span className="category-text"><strong>Everyday essentials</strong><small>The useful little things</small></span><ArrowUpRight size={19}/></button>
      </div></section>

      <section className="shop-section" id="shop"><div className="section-heading shop-heading"><div><p className="eyebrow">The good stuff</p><h2>Thoughtful <em>finds.</em></h2><p className="section-subtitle">Useful things, chosen with care. All prices in Kenyan shillings.</p></div><label className="sort-select"><span>Sort:</span><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={15}/></label></div>
        <div className="filter-row" aria-label="Filter by category">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}<span className="result-count">{visibleProducts.length} finds</span></div>
        {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product, index) => <article className="product-card" key={product.id}><button className="product-image-button" aria-label={`View ${product.name}`} onClick={() => { setToast(`${product.name}: ${product.description}`); window.setTimeout(() => setToast(""), 3600); }}><div className="product-image-wrap"><img src={product.image} alt={product.imageAlt} loading={index < 4 ? "eager" : "lazy"}/>{product.tag && <span className="product-tag">{product.tag}</span>}<span className="image-view">Quick look <ArrowUpRight size={14}/></span></div></button><div className="product-info"><div><p className="product-category">{product.category}</p><h3>{product.name}</h3></div><button className="heart-button" aria-label={`Save ${product.name}`} onClick={() => { setToast("Saved items will be available with your account"); window.setTimeout(() => setToast(""), 2300); }}><Heart size={18}/></button></div><div className="product-bottom"><div className="price-line"><strong>{formatKes(product.price)}</strong>{product.oldPrice && <del>{formatKes(product.oldPrice)}</del>}</div><button className="add-button" aria-label={`Add ${product.name} to bag`} onClick={() => addProduct(product)}><Plus size={17}/></button></div><p className="product-stock"><span/> In stock · {product.colors}</p></article>)}</div> : <div className="empty-results"><Search size={25}/><h3>No finds just yet</h3><p>Try a different search or category.</p><button className="text-link" onClick={() => { setQuery(""); setCategory("All finds"); }}>Clear filters <ArrowRight size={16}/></button></div>}
      </section>

      <section className="promise-section" id="story"><div className="promise-art"><div className="promise-art-inner"><span className="sun-shape"/><div className="promise-stilllife"><div className="stilllife-vase"/><div className="stilllife-book"/><div className="stilllife-orb"/></div><span className="art-word">better<br/>by choice.</span></div></div><div className="promise-copy"><p className="eyebrow">A little more considered</p><h2>Good shopping<br/>should feel <em>good.</em></h2><p>We believe the things you bring into your life should earn their place. So we look for everyday pieces that are useful, thoughtfully made and fairly priced.</p><p>That means fewer impulse buys, more keepers, and a shopping experience that respects your time and your budget.</p><a href="#shop" className="text-link">A closer look at our finds <ArrowRight size={16}/></a><span className="promise-scribble">Thoughtful, always <span>✳</span></span></div></section>

      <section className="newsletter"><div><p className="eyebrow">A note now and then</p><h2>Good things, <em>in your inbox.</em></h2><p>New finds, useful ideas and the occasional little surprise.</p></div><form onSubmit={(event) => { event.preventDefault(); setToast("Thanks for joining. We’ll be in touch soon."); window.setTimeout(() => setToast(""), 3000); }}><label htmlFor="newsletter-email" className="sr-only">Email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required/><button type="submit">Count me in <ArrowRight size={16}/></button></form></section>

      <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a className="brand brand-light" href="#top"><span className="brand-mark">S<span>↗</span></span><span className="brand-name">smartcart<span>africa</span></span></a><p>Shop smart. Live better.<br/>Good finds for the way you live.</p></div><div className="footer-links"><div><h3>Explore</h3><a href="#shop">Shop all</a><a href="#categories">Categories</a><a href="#story">Our promise</a></div><div><h3>We can help</h3><a href="mailto:hello@smartcart.africa">Contact us</a><a href="#delivery">Delivery information</a><a href="#returns">Returns & refunds</a></div><div><h3>Good to know</h3><a href="#about">About us</a><a href="#privacy">Privacy policy</a><a href="#terms">Terms of service</a></div></div><div className="footer-contact"><span>Questions? We’re here.</span><a href="mailto:hello@smartcart.africa">hello@smartcart.africa <ArrowUpRight size={14}/></a><span>Made for Kenya, with care <span className="kenya-dot">●</span></span></div></div><div className="footer-bottom"><span>© 2025 SmartCart Africa</span><span>Shop smart. Live better.</span><span>Kenya · KSh</span></div></footer>

      {toast && <div className="toast" role="status"><Check size={16}/>{toast}</div>}
      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()} aria-label="Shopping bag"><div className="drawer-header"><div><p className="eyebrow">YOUR GOOD FINDS</p><h2>Your bag <span>({itemCount})</span></h2></div><button className="close-button" aria-label="Close bag" onClick={() => setCartOpen(false)}><X/></button></div>{cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={34}/><h3>Your bag is taking a breather.</h3><p>When something catches your eye, you’ll find it here.</p><button className="button button-dark" onClick={() => { setCartOpen(false); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the finds <ArrowRight size={16}/></button></div> : <><div className="cart-lines">{cart.map(({ product, quantity }) => <div className="cart-line" key={product.id}><img src={product.image} alt={product.imageAlt}/><div className="cart-line-info"><span>{product.category}</span><strong>{product.name}</strong><b>{formatKes(product.price)}</b><div className="quantity-control"><button aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={13}/></button><span>{quantity}</span><button aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={13}/></button></div></div><button className="remove-line" aria-label={`Remove ${product.name}`} onClick={() => removeFromCart(product.id)}><X size={16}/></button></div>)}</div><div className="cart-summary"><p><span>Subtotal</span><strong>{formatKes(subtotal)}</strong></p><small>Delivery is calculated at checkout.</small><button className="button button-dark checkout-button" onClick={() => setToast("Checkout will be available once secure ordering is connected.")}>Continue to checkout <ArrowRight size={17}/></button><button className="continue-link" onClick={() => setCartOpen(false)}>Keep looking around</button></div></>}</aside></div>}
    </main>
  );
}
