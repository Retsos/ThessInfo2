declare module "leaflet" {
  export type LatLngExpression = any
  export type LatLngBoundsExpression = any

  export type FitBoundsOptions = Record<string, any>

  export type MapOptions = {
    center?: LatLngExpression
    zoom?: number
    minZoom?: number
    maxZoom?: number
    [key: string]: any
  }

  export type TileLayerOptions = {
    attribution?: string
    [key: string]: any
  }

  export type GeoJSONOptions = {
    style?: any
    onEachFeature?: any
    [key: string]: any
  }

  export class Map {
    fitBounds(bounds: any, options?: any): void
  }

  export class TileLayer {}

  export class GeoJSON<T = any, G = any> {
    getBounds(): { isValid: () => boolean }
  }

  const L: any
  export default L
}
