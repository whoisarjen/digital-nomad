-- Seed initial features for the roadmap
-- Run after `npx prisma db push`

INSERT INTO "Feature" (id, name, description, status, "order", "createdAt") VALUES
  ('feat_compare', 'City vs City comparison', 'Compare two cities side by side across all metrics', 'building', 1, NOW()),
  ('feat_favorites', 'Saved cities / favorites', 'Save cities to your personal list for quick access', 'next', 2, NOW()),
  ('feat_alerts', 'Monthly cost alerts', 'Get notified when cost of living changes in your saved cities', 'researching', 3, NOW()),
  ('feat_visa', 'Visa requirement checker', 'Check visa requirements based on your passport', 'researching', 4, NOW()),
  ('feat_reviews', 'Community reviews & tips', 'Share and read tips from other nomads about cities', 'researching', 5, NOW()),
  ('feat_planner', 'Trip planner', 'Plan multi-city trips with budget and weather optimization', 'researching', 6, NOW())
ON CONFLICT (id) DO NOTHING;
