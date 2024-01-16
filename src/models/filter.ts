import React, { Dispatch, SetStateAction } from 'react';

export interface Filter {
  reviewCount: number;
  distance: number;
  goLater: number;
  foodType: Map<string, boolean>;
  star: number;
}

export interface FilterContextType {
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
}

export const foodTypeList: string[] = [
  '경양식',
  '곱창 전골/구이',
  '구내식당',
  '국/탕/찌개류',
  '국수/칼국수',
  '그 외 기타 간이 음식점',
  '기타 동남아식 전문',
  '기타 서양식 음식점',
  '기타 일식 음식점',
  '기타 한식 음식점',
  '김밥/만두/분식',
  '냉면/밀면',
  '닭/오리고기 구이/찜',
  '돼지고기 구이/찜',
  '떡/한과',
  '마라탕/훠궈',
  '무도 유흥 주점',
  '백반/한정식',
  '버거',
  '베트남식 전문',
  '복 요리 전문',
  '분류 안된 외국식 음식점',
  '뷔페',
  '빵/도넛',
  '생맥주 전문',
  '소고기 구이/찜',
  '아이스크림/빙수',
  '요리 주점',
  '일반 유흥 주점',
  '일식 면 요리',
  '일식 카레/돈가스/덮밥',
  '일식 회/초밥',
  '전/부침개',
  '족발/보쌈',
  '중국집',
  '치킨',
  '카페',
  '토스트/샌드위치/샐러드',
  '파스타/스테이크',
  '패밀리레스토랑',
  '피자',
  '해산물 구이/찜',
  '횟집',
];

export const foodTypeMapAllTrue = new Map(foodTypeList.map((name) => [name, true]));
export const foodTypeMapAllFalse = new Map(foodTypeList.map((name) => [name, false]));

export const filterPlaceHolder: Filter = {
  reviewCount: 0,
  distance: 500,
  goLater: 0,
  foodType: new Map(foodTypeMapAllTrue),
  star: 0,
};

export const FilterContext = React.createContext<FilterContextType>({
  filter: filterPlaceHolder,
  setFilter: () => {},
});
