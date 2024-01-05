export type CyclistData = {
  Time: string
  Place: number
  Seconds: number
  Name: string
  Year: number
  Nationality: string
  Doping: string
  URL: string
}

export type MonthlyVariance = {
  year: number
  month: number
  variance: number
}

export type HeatMapDataset = {
  baseTemperature: number
  monthlyVariance: MonthlyVariance[]
}

export type EducationData = {
  fips: number
  state: State
  area_name: string
  bachelorsOrHigher: number
}

export type EducationDataset = EducationData[]

export enum State {
  Ak = 'AK',
  Al = 'AL',
  Ar = 'AR',
  Az = 'AZ',
  CA = 'CA',
  CT = 'CT',
  Co = 'CO',
  Dc = 'DC',
  De = 'DE',
  FL = 'FL',
  Ga = 'GA',
  Hi = 'HI',
  ID = 'ID',
  IL = 'IL',
  Ia = 'IA',
  In = 'IN',
  Ks = 'KS',
  Ky = 'KY',
  La = 'LA',
  MS = 'MS',
  MT = 'MT',
  Ma = 'MA',
  Md = 'MD',
  Me = 'ME',
  Mi = 'MI',
  Mn = 'MN',
  Mo = 'MO',
  Nc = 'NC',
  Nd = 'ND',
  Ne = 'NE',
  Nh = 'NH',
  Nj = 'NJ',
  Nm = 'NM',
  Nv = 'NV',
  Ny = 'NY',
  Oh = 'OH',
  Ok = 'OK',
  Or = 'OR',
  Pa = 'PA',
  Ri = 'RI',
  SD = 'SD',
  Sc = 'SC',
  Tn = 'TN',
  Tx = 'TX',
  Ut = 'UT',
  VT = 'VT',
  Va = 'VA',
  Wa = 'WA',
  Wi = 'WI',
  Wv = 'WV',
  Wy = 'WY'
}

export interface CountiesDataSet extends TopoJSON.Topology {
  objects: {
    counties: {
      type: Type
      geometries: Array<TopoJSON.Polygon | TopoJSON.MultiPolygon>
    }
    states: {
      type: 'GeometryCollection'
      geometries: Array<TopoJSON.Polygon | TopoJSON.MultiPolygon>
    }
    nation: TopoJSON.GeometryCollection
  }
  bbox: [number, number, number, number]
  transform: TopoJSON.Transform
}

// not sure about the correct type, but this seems to be fine
export type TreemapDataset = {
  name: string
  category: string
  value: number
  children: TreemapDataset[]
}
