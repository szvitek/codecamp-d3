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
