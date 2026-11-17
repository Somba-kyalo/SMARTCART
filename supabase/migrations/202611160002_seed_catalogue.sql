-- Demo catalogue seed for local development.
-- Product image URLs are intentionally external demo assets; replace them with
-- Supabase Storage paths before production launch.

insert into public.categories (name, slug, description)
values
  ('Home & Living', 'home-living', 'Useful pieces for a calmer home.'),
  ('Bags & Accessories', 'bags-accessories', 'Practical pieces for carrying and everyday movement.'),
  ('Everyday Essentials', 'everyday-essentials', 'Small useful things for daily routines.')
on conflict (slug) do update set name = excluded.name, description = excluded.description;

insert into public.products (category_id, name, slug, description, price_kes, compare_at_price_kes, stock_quantity, is_published)
select c.id, p.name, p.slug, p.description, p.price_kes, p.compare_at_price_kes, p.stock_quantity, true
from (values
  ('Home & Living', 'Woven Market Tote', 'woven-market-tote', 'A roomy, everyday carryall with a handwoven finish and sturdy handles. Made for market mornings, errands and everything in between.', 1850, 2400, 20),
  ('Home & Living', 'Ceramic Pour-over Set', 'ceramic-pour-over-set', 'Slow mornings start here. A beautifully simple ceramic dripper and matching cup for your daily coffee ritual.', 3200, null, 12),
  ('Bags & Accessories', 'Everyday Canvas Sling', 'weekend-sling', 'Keep your essentials close without carrying the whole day. Adjustable, lightweight and ready for the commute.', 2450, null, 16),
  ('Home & Living', 'Soft Linen Table Runner', 'linen-table-runner', 'An easy way to make a table feel considered. Soft washed linen with a relaxed drape and timeless natural tone.', 1650, null, 14),
  ('Everyday Essentials', 'Insulated Daily Bottle', 'daily-water-bottle', 'A dependable companion for work, travel and the little things between. Double-wall insulation keeps drinks just right.', 1950, 2300, 25),
  ('Bags & Accessories', 'Travel Weekender Pouch', 'weekender-pouch', 'A practical little organiser for cables, toiletries or the everyday odds and ends that need a place.', 1250, null, 18),
  ('Home & Living', 'Warm Glow Desk Lamp', 'desk-lamp', 'A clean silhouette and a softer pool of light for focused evenings, bedside reading or a calmer desk.', 4100, null, 8),
  ('Bags & Accessories', 'Everyday Acetate Shades', 'everyday-sunglasses', 'A versatile everyday shape with a lightweight feel. An easy finishing touch for bright days out.', 2850, null, 10)
) as p(category_name, name, slug, description, price_kes, compare_at_price_kes, stock_quantity)
join public.categories c on c.name = p.category_name
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price_kes = excluded.price_kes,
  compare_at_price_kes = excluded.compare_at_price_kes,
  stock_quantity = excluded.stock_quantity,
  is_published = true,
  updated_at = now();
