import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Calendar, MapPin, Users, Trophy, Image, X, Loader2 } from 'lucide-react'
import { matchSchema, type MatchFormData } from '../../utils/validators'
import { useFixtures, useLogMatch } from '../../hooks/useMatches'
import type { Fixture } from '../../types'

interface MatchFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<MatchFormData>
  fixtureId?: number
}

export const MatchForm = ({ onSuccess, onCancel, initialData, fixtureId }: MatchFormProps) => {
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const logMatch = useLogMatch()
  const { data: fixtures } = useFixtures()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MatchFormData>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      attendance_type: 'in_person',
      is_home: true,
      ...initialData,
    },
  })

  const attendanceType = watch('attendance_type')

  // Auto-populate from fixture
  useEffect(() => {
    if (fixtureId && fixtures) {
      const fixture = fixtures.find((f: Fixture) => f.id === fixtureId)
      if (fixture) {
        setSelectedFixture(fixture)
        setValue('match_date', fixture.match_date)
        setValue('opponent', fixture.opponent)
        setValue('venue', fixture.venue)
        setValue('is_home', fixture.is_home)
        setValue('competition', fixture.competition_name || '')
        setValue('fixture_id', fixture.id)
      }
    }
  }, [fixtureId, fixtures, setValue])

  const onSubmit = async (data: MatchFormData) => {
    try {
      await logMatch.mutateAsync(data)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to log match:', error)
    }
  }

  const handleFixtureSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value)
    if (id && fixtures) {
      const fixture = fixtures.find((f: Fixture) => f.id === id)
      if (fixture) {
        setSelectedFixture(fixture)
        setValue('match_date', fixture.match_date)
        setValue('opponent', fixture.opponent)
        setValue('venue', fixture.venue)
        setValue('is_home', fixture.is_home)
        setValue('competition', fixture.competition_name || '')
        setValue('fixture_id', fixture.id)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Fixture Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Fixture (Optional)
        </label>
        <select
          onChange={handleFixtureSelect}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
        >
          <option value="">Manual Entry</option>
          {fixtures?.filter((f: Fixture) => !f.is_played).map((fixture: Fixture) => (
            <option key={fixture.id} value={fixture.id}>
              {format(new Date(fixture.match_date), 'dd MMM yyyy')} - {fixture.opponent} ({fixture.is_home ? 'H' : 'A'})
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Match Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="datetime-local"
            {...register('match_date')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
          />
        </div>
        {errors.match_date && (
          <p className="mt-1 text-sm text-red-500">{errors.match_date.message}</p>
        )}
      </div>

      {/* Opponent & Competition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opponent <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              {...register('opponent')}
              placeholder="e.g. Liverpool"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
            />
          </div>
          {errors.opponent && (
            <p className="mt-1 text-sm text-red-500">{errors.opponent.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Competition <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              {...register('competition')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
            >
              <option value="">Select Competition</option>
              <option value="Premier League">Premier League</option>
              <option value="FA Cup">FA Cup</option>
              <option value="Carabao Cup">Carabao Cup</option>
              <option value="UEFA Champions League">UEFA Champions League</option>
              <option value="UEFA Europa League">UEFA Europa League</option>
              <option value="Community Shield">Community Shield</option>
              <option value="Friendly">Friendly</option>
            </select>
          </div>
          {errors.competition && (
            <p className="mt-1 text-sm text-red-500">{errors.competition.message}</p>
          )}
        </div>
      </div>

      {/* Venue & Attendance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Venue <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              {...register('venue')}
              placeholder="e.g. Old Trafford"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
            />
          </div>
          {errors.venue && (
            <p className="mt-1 text-sm text-red-500">{errors.venue.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attendance Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register('attendance_type')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
          >
            <option value="in_person">In Person 🏟️</option>
            <option value="watched">Watched 📺</option>
          </select>
          {errors.attendance_type && (
            <p className="mt-1 text-sm text-red-500">{errors.attendance_type.message}</p>
          )}
        </div>
      </div>

      {/* Home/Away & Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Home/Away
          </label>
          <select
            {...register('is_home')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
          >
            <option value="true">Home</option>
            <option value="false">Away</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Home Score
          </label>
          <input
            type="number"
            {...register('score_home', { valueAsNumber: true })}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Away Score
          </label>
          <input
            type="number"
            {...register('score_away', { valueAsNumber: true })}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
          />
        </div>
      </div>

      {/* Score validation error */}
      {errors.score_home && (
        <p className="text-sm text-red-500">{errors.score_home.message}</p>
      )}

      {/* Seat Section (in-person only) */}
      {attendanceType === 'in_person' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seat Section (Optional)
          </label>
          <input
            {...register('seat_section')}
            placeholder="e.g. Stretford End, Block E232"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Personal Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Share your match experience..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DA291C] focus:border-transparent"
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
        )}
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photo (Optional)
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Image className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    setPhotoPreview(event.target?.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
          </label>
          {photoPreview && (
            <div className="relative">
              <img src={photoPreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => setPhotoPreview(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || logMatch.isPending}
          className="flex-1 bg-[#DA291C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting || logMatch.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Log Match'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
