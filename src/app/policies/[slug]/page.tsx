import Link from "next/link";

const pages: Record<string, { title: string; intro: string; sections: [string, string][] }> = {
  about: { title: "About SmartCart Africa", intro: "Useful finds for everyday life, chosen with care for customers in Kenya.", sections: [["A considered catalogue", "We focus on practical products that earn their place at home, at work and on the move."], ["Built for clarity", "Prices, availability and delivery information should be easy to understand before you place an order."]] },
  faq: { title: "Frequently asked questions", intro: "Clear answers as the store grows.", sections: [["Where do you deliver?", "Delivery coverage and estimated timing will be shown during checkout for your address."], ["Which payment methods are supported?", "Payment methods depend on the configured IntaSend account and will be shown before payment."]] },
  delivery: { title: "Delivery information", intro: "Delivery details are confirmed at checkout.", sections: [["Delivery estimates", "Delivery estimates are configurable and may vary by county, town, product and supplier."], ["Tracking", "Tracking information will appear in your account when a shipment reference is available."]] },
  returns: { title: "Returns and refunds", intro: "We are preparing a clear returns workflow for every order.", sections: [["Before returning an item", "Contact support with your order reference and a description of the issue."], ["Refund timing", "Refund processing depends on the payment provider and the outcome of the review."]] },
  privacy: { title: "Privacy policy", intro: "We only use customer information to operate and improve the store.", sections: [["Information we collect", "Account, delivery and order information is collected when needed to fulfil your purchase."], ["Your choices", "You can request access to or correction of your personal information through support."]] },
  terms: { title: "Terms and conditions", intro: "These store terms are a working draft and should receive legal review before launch.", sections: [["Using the store", "Product availability, pricing and delivery estimates may change before an order is accepted."], ["Orders", "An order is confirmed only after the store has verified the order and payment status."]] },
};

export function generateStaticParams() { return Object.keys(pages).map((slug) => ({ slug })); }
export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = pages[(await params).slug] ?? pages.about;
  return <main className="policy-page"><Link href="/" className="back-link">← Back to shop</Link><p className="eyebrow">SmartCart Africa</p><h1>{page.title}</h1><p className="policy-intro">{page.intro}</p>{page.sections.map(([heading, text]) => <section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}</main>;
}
