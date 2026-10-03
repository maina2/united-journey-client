import type { CardTemplateId } from '../../types/card'

interface CardTemplateProps {
  template: CardTemplateId
  imageSrc: string | null
  isLoading?: boolean
  alt?: string
}

const TEMPLATE_GRADIENTS: Record<CardTemplateId, string> = {
  i_was_there: 'from-united-red to-united-red-dark',
  goal_moment: 'from-united-red-dark to-united-black',
  clean_sheet: 'from-united-charcoal to-united-black',
  debut: 'from-united-red to-united-red-dark',
  classic_win: 'from-united-gold to-united-gold-dark',
  away_day: 'from-united-black to-united-charcoal',
  european_night: 'from-blue-900 to-blue-950',
  custom: 'from-united-red to-united-red-dark',
}

export const CardTemplate = ({
  template,
  imageSrc,
  isLoading = false,
  alt = 'Story card preview',
}: CardTemplateProps) => {
  const gradient = TEMPLATE_GRADIENTS[template] ?? TEMPLATE_GRADIENTS.i_was_there

  return (
    <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-united-xl border border-united-gray-200">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <div className="text-center text-white/80 space-y-3 px-8">
            <div className="text-6xl">🖼️</div>
            <p className="text-sm font-medium uppercase tracking-wider">
              {isLoading ? 'Generating preview…' : 'Preview will appear here'}
            </p>
          </div>
        </div>
      )}

      {isLoading && imageSrc && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
