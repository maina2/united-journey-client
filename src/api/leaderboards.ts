import { apiClient } from './client'

export const leaderboardsApi = {
  getGlobal: (limit?: number) =>
    apiClient.get('/leaderboards/global', { params: { limit } }),

  getCountry: (country?: string) =>
    apiClient.get('/leaderboards/country', { params: { country } }),

  getSeason: (season?: string) =>
    apiClient.get('/leaderboards/season', { params: { season } }),

  getFriends: () =>
    apiClient.get('/leaderboards/friends'),
}
