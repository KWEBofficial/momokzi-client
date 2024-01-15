import React, { Dispatch, SetStateAction } from 'react';

export interface Filter {
  reviewCount: number;
  distance: number;
  goLater: boolean;
  foodType: string;
  star: number;
}

export interface FilterContextType {
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
}

export const filterPlaceHolder: Filter = { reviewCount: 0, distance: 500, goLater: false, foodType: '경양식', star: 0 };

export const FilterContext = React.createContext<FilterContextType>({
  filter: filterPlaceHolder,
  setFilter: () => {},
});
