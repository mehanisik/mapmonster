import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'
import HeatmapLayer from 'ol/layer/Heatmap'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OlMap from 'ol/Map'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'
import View from 'ol/View'
import type { Country, DataAnomaly } from '~/libs/types/game'
import 'ol/ol.css'

export type MapEventHandler = (id: string, type: 'data' | 'country') => void

export class GameMap {
  private map: OlMap | null = null
  private countrySource: VectorSource
  private borderSource: VectorSource
  private dataSource: VectorSource
  private heatmapLayer: HeatmapLayer
  private geojsonFormat: GeoJSON

  constructor(target: HTMLElement, onClick: MapEventHandler) {
    this.countrySource = new VectorSource()
    this.borderSource = new VectorSource()
    this.dataSource = new VectorSource()
    this.geojsonFormat = new GeoJSON()

    const dataLayer = this.createDataLayer()
    const borderLayer = this.createBorderLayer()
    const countryLayer = this.createCountryMarkerLayer()
    this.heatmapLayer = this.createHeatmapLayer()

    this.map = new OlMap({
      target,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attributions:
              '© <a href="https://carto.com/attributions">CARTO</a>',
          }),
        }),
        borderLayer,
        this.heatmapLayer,
        countryLayer,
        dataLayer,
      ],
      view: new View({
        center: fromLonLat([0, 20]),
        zoom: 2.5,
        minZoom: 2,
        maxZoom: 8,
      }),
    })

    this.bindEvents(onClick, target)
  }

  public updateCountries(countries: Country[]) {
    if (this.countrySource.getFeatures().length === 0 && countries.length > 0) {
      this.initialRender(countries)
    } else {
      this.updateProperties(countries)
    }
  }

  public updateDataAnomalies(anomalies: DataAnomaly[]) {
    this.dataSource.clear()
    const features = anomalies.map((anomaly) => {
      const country = this.countrySource.getFeatureById(
        `country-${anomaly.countryId}`
      )

      const coordinates = country
        ? (country.getGeometry() as Point).getCoordinates()
        : fromLonLat([0, 0])

      const feature = new Feature({
        geometry: new Point(coordinates),
      })
      feature.setId(anomaly.id)
      return feature
    })
    this.dataSource.addFeatures(features)
  }

  public destroy() {
    if (this.map) {
      this.map.setTarget(undefined)
      this.map = null
    }
  }

  private initialRender(countries: Country[]) {
    const markerFeatures: Feature[] = []
    const borderFeatures: Feature[] = []

    for (const country of countries) {
      const marker = new Feature({
        geometry: new Point(fromLonLat([country.lng, country.lat])),
        name: country.name,
        synchronized: country.synchronized,
        population: country.population,
        assimilated: country.assimilated,
      })
      marker.setId(`country-${country.id}`)
      markerFeatures.push(marker)

      if (country.geometry) {
        let geometry = null
        try {
          geometry = this.geojsonFormat.readGeometry(country.geometry, {
            featureProjection: 'EPSG:3857',
          })
        } catch {
          // Silent fail if geometry reading fails
        }

        if (geometry) {
          const border = new Feature(geometry)
          border.setProperties({
            synchronized: country.synchronized,
            population: country.population,
            id: country.id,
          })
          border.setId(`border-${country.id}`)
          borderFeatures.push(border)
        }
      }
    }

    this.countrySource.addFeatures(markerFeatures)
    this.borderSource.addFeatures(borderFeatures)
  }

  private updateProperties(countries: Country[]) {
    for (const country of countries) {
      const marker = this.countrySource.getFeatureById(`country-${country.id}`)
      if (marker) {
        marker.set('synchronized', country.synchronized)
        marker.set('assimilated', country.assimilated)
        marker.set('population', country.population)
      }

      const border = this.borderSource.getFeatureById(`border-${country.id}`)
      if (border) {
        border.set('synchronized', country.synchronized)
        border.set('population', country.population)
      }
    }
  }

  private createDataLayer() {
    return new VectorLayer({
      source: this.dataSource,
      style: new Style({
        image: new CircleStyle({
          radius: 14,
          fill: new Fill({ color: 'rgba(34, 211, 238, 0.8)' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: '📡',
          scale: 1.4,
          font: '14px sans-serif',
          offsetY: -1,
        }),
      }),
      zIndex: 100,
    })
  }

  private createBorderLayer() {
    return new VectorLayer({
      source: this.borderSource,
      style: (feature) => {
        const synchronized = feature.get('synchronized') || 0
        const population = feature.get('population') || 1
        const synchronizationRate = synchronized / population

        let fillColor = 'rgba(255, 255, 255, 0.02)'
        let strokeColor = 'rgba(255, 255, 255, 0.1)'
        let strokeWidth = 1

        if (synchronizationRate > 0) {
          const intensity = Math.min(1, synchronizationRate * 5)
          fillColor = `rgba(34, 211, 238, ${0.1 + intensity * 0.4})`
          strokeColor = `rgba(34, 211, 238, ${0.3 + intensity * 0.5})`
          strokeWidth = 1 + intensity
        }

        return new Style({
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
        })
      },
      zIndex: 5,
    })
  }

  private createCountryMarkerLayer() {
    return new VectorLayer({
      source: this.countrySource,
      style: (feature) => {
        const synchronized = feature.get('synchronized') || 0
        const population = feature.get('population') || 1
        const synchronizationRate = synchronized / population

        let color = 'rgba(100, 100, 100, 0.4)'
        if (synchronizationRate > 0) {
          color = 'rgba(34, 211, 238, 0.9)'
        }

        return new Style({
          image: new CircleStyle({
            radius:
              synchronized > 0 ? 5 + Math.min(10, synchronizationRate * 50) : 3,
            fill: new Fill({ color }),
            stroke: new Stroke({
              color: 'rgba(255,255,255,0.4)',
              width: 1,
            }),
          }),
          text:
            synchronized > 0
              ? new Text({
                  text: feature.get('name'),
                  font: 'bold 10px Inter, sans-serif',
                  fill: new Fill({ color: '#fff' }),
                  stroke: new Stroke({ color: '#000', width: 2 }),
                  offsetY: -12,
                })
              : undefined,
        })
      },
      zIndex: 20,
    })
  }

  private createHeatmapLayer() {
    return new HeatmapLayer({
      source: this.countrySource,
      blur: 40,
      radius: 30,
      gradient: [
        '#000000',
        '#001a1a',
        '#003333',
        '#006666',
        '#009999',
        '#00ccff',
      ],
      weight: (feature) => {
        const synchronized = feature.get('synchronized') || 0
        const population = feature.get('population') || 1
        return Math.min(1, (synchronized / population) * 10)
      },
      zIndex: 10,
    })
  }

  private bindEvents(onClick: MapEventHandler, target: HTMLElement) {
    if (!this.map) return

    this.map.on('click', (e) => {
      const feature = this.map?.forEachFeatureAtPixel(e.pixel, (f) => f)
      if (feature) {
        const id = feature.getId()?.toString()
        if (id) {
          if (id.startsWith('data-')) {
            onClick(id, 'data')
          } else if (id.startsWith('country-')) {
            onClick(id.replace('country-', ''), 'country')
          }
        }
      }
    })

    this.map.on('pointermove', (e) => {
      const hit = this.map?.hasFeatureAtPixel(e.pixel)
      target.style.cursor = hit ? 'pointer' : ''
    })
  }
}
