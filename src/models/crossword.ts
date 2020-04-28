export type CrosswordEntryDirection = 'across' | 'down'

export type CrosswordSeparator = ',' | '-'

export type CrosswordEntry = {
  id: string
  number: number
  humanNumber: string
  clue: string
  direction: string
  length: number
  group: Array<string>
  position: {
    x: number
    y: number
  }
  separatorLocations: Record<CrosswordSeparator, Array<number> | undefined>
  solution: string
}

export const crosswordTypes = [
  'quick',
  'cryptic',
  'prize',
  'weekend',
  'quiptic',
  'speedy',
  'everyman'
] as const

export type CrosswordType = typeof crosswordTypes[number]

export type Crossword = {
  id: string
  number: number
  name: string
  creator: {
    name: string
    webUrl: string
  }
  date: number
  entries: Array<CrosswordEntry>
  solutionAvailable: boolean
  dateSolutionAvailable: number
  dimensions: {
    cols: number
    rows: number
  }
  crosswordType: CrosswordType
  pdf: string
}
