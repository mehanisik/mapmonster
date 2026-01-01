import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface EarthQuakeFeature {
  id: string
  properties: {
    title: string
    time: number
  }
  [key: string]: unknown
}

export interface FeatureCollection {
  type: 'FeatureCollection'
  features: EarthQuakeFeature[]
}

export const usgsApi = createApi({
  reducerPath: 'usgsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/',
  }),
  endpoints: (builder) => ({
    getRecentEarthquakes: builder.query<FeatureCollection, string>({
      query: (timeframe) => `all_${timeframe}.geojson`,
    }),
  }),
})

export const { useGetRecentEarthquakesQuery } = usgsApi
