export interface SearchState {
  
  args: SearchArgs;
  
  status: SearchStatus;
    
  result?: SearchResult | null;
  
}

export interface SearchArgs {

  query?: string

  filters?: Filter[]

  selectedFacet?: string

  fitMap?: boolean

}

export interface Filter {

  name: string

  [key: string]: any;

}

export enum SearchStatus {

  PENDING = 'PENDING',

  OK = 'OK',

  FAILED = 'FAILED'

}

export interface SearchResult {

  total: number,

  items: ResultItem[]

}

export interface ResultItem {

    id: string;

    [key: string]: any;

  }