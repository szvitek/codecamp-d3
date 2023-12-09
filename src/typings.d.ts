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

export type EducationDataset = {
  fips: number
  state: State
  area_name: string
  bachelorsOrHigher: number
}[]

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

export type CountiesDataset = {
  type: string
  objects: Objects
  arcs: Array<Array<number[]>>
  bbox: number[]
  transform: Transform
}

export type Objects = {
  counties: Counties
  states: States
  nation: Nation
}

export type Counties = {
  type: string
  geometries: CountiesGeometry[]
}

export type CountiesGeometry = {
  type: Type
  id: number
  arcs: Array<Array<number[] | number>>
}

export type Type = 'Polygon' | 'MultiPolygon'

export type Nation = {
  type: string
  geometries: NationGeometry[]
}

export type NationGeometry = {
  type: Type
  arcs: Array<Array<number[]>>
}

export type States = {
  type: string
  geometries: StatesGeometry[]
}

export type StatesGeometry = {
  type: Type
  arcs: Array<Array<number[]>>
  id: string
}

export type Transform = {
  scale: number[]
  translate: number[]
}
