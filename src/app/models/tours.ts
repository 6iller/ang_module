export interface ITour {
  id: string
  name: string
  description: string
  tourOperator: string
  price: string
  img: string
  type?: string
  date?: string
}

export interface ITourTypeSelect {
  label?: string,
  value?: string
  date?: Date
}

export interface INearestTour {
  locationId: string
  region?: ITourLocation
}

export interface ITourLocation {
  name: string
  id: string
}
