import ModernHero from "@/components/modern-hero"
import ModernCategories from "@/components/modern-categories"
import FeaturedProducts from "@/components/featured-products"
import StatsSection from "@/components/stats-section"
import TestimonialsSection from "@/components/testimonials-section"
import NewsletterSection from "@/components/newsletter-section"
import ModernFeatures from "@/components/modern-features"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <ModernHero />
      <ModernCategories />
      <FeaturedProducts />
      <StatsSection />
      <ModernFeatures />
      <TestimonialsSection />
      <NewsletterSection />
    </main>
  )
}
