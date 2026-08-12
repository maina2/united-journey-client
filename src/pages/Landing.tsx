export const Landing = () => {
  return (
    <div className="min-h-screen bg-united-white">
      {/* Match Hero */}
      <section className="relative h-[620px] w-full overflow-hidden bg-united-black">
        <img
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600"
          alt="Man Utd vs Leeds"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-united-black/95 via-united-black/30 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-10 md:px-16">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-4">
              <img src="/crests/manutd.png" alt="Manchester United" className="h-14 w-14 object-contain" />
              <span className="font-serif text-3xl md:text-4xl text-united-white">Man Utd</span>
            </div>
            <div className="flex items-center gap-4">
              <img src="/crests/leeds.png" alt="Leeds" className="h-14 w-14 object-contain" />
              <span className="font-serif text-3xl md:text-4xl text-united-white">Leeds</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm md:text-base text-united-white/90">
            <span className="font-semibold text-united-red">Friendly</span>
            <span className="h-1 w-1 rounded-full bg-united-white/60" />
            <span>Wednesday, 21:30</span>
            <span className="h-1 w-1 rounded-full bg-united-white/60" />
            <span>Croke Park</span>
          </div>
        </div>
      </section>

      {/* Promo card carousel */}
      <section className="py-8">
        <div className="flex gap-4 overflow-x-auto px-8 md:px-16 pb-4 snap-x snap-mandatory scrollbar-hide">
          <PromoCard
            image="https://images.unsplash.com/photo-1580891536153-2f01571ff6b9?w=500"
            label="Last chance to buy"
            title="Visit the outlet"
            subtitle="Up to 75% off"
          />
          <PromoCard
            image="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500"
            label="Three up for grabs"
            title="Exclusive competition"
            subtitle="Signed adidas third shirts"
          />
          <PromoCard
            image="https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500"
            label="Add to your shirt"
            title="Champions League badges"
            subtitle="Now available to order"
          />
          <PromoCard
            image="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500"
            label="Get match ready"
            title="Anthem jacket"
            subtitle="Shop the new range"
          />
        </div>
      </section>
    </div>
  )
}

function PromoCard({
  image,
  label,
  title,
  subtitle,
}: {
  image: string
  label: string
  title: string
  subtitle: string
}) {
  return (
    <div className="flex-none w-72 snap-start">
      <div className="h-72 w-72 overflow-hidden rounded-sm bg-united-gray-100">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="pt-3">
        <p className="text-sm font-semibold text-united-red">{label}</p>
        <h3 className="mt-1 font-serif text-2xl text-united-black leading-snug">{title}</h3>
        <p className="mt-1 text-united-gray-600">{subtitle}</p>
      </div>
    </div>
  )
}