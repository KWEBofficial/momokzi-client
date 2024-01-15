/**
 * User model
 * User 객체의 타입을 정의해 놓은 인터페이스입니다.
 * 필요에 따라 수정하거나 삭제하셔도 됩니다.
 * 자주 쓰이는 인터페이스는 models 폴더에 정의해 놓고 import해서 사용하면 됩니다.
 * @interface User
 * @property {number} id - 유저의 고유 id
 * @property {string} firstName - 유저의 이름
 * @property {string} lastName - 유저의 성
 * @property {number} age - 유저의 나이
 */
import React, { Dispatch, SetStateAction } from 'react';

export interface Geo {
  x: number;
  y: number;
  auto: boolean;
}

export interface GeoContextType {
  geo: Geo;
  setGeo: Dispatch<SetStateAction<Geo>>;
}

export const GeoContext = React.createContext<GeoContextType>({
  geo: { x: 33.450701, y: 126.570667, auto: true },
  setGeo: () => {},
});

export async function getCurrentLocation(setGeoCallback: React.Dispatch<React.SetStateAction<Geo>>) {
  if (navigator.geolocation) {
    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      if (result.state === 'granted') {
        console.log(result.state);
        console.log('granted!');
        // If granted then you can directly call your function here
        navigator.geolocation.getCurrentPosition((position) => {
          setGeoCallback({ x: position.coords.latitude, y: position.coords.longitude, auto: true });
        });
      } else if (result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition((position) => {
          setGeoCallback({ x: position.coords.latitude, y: position.coords.longitude, auto: true });
        });
      } else if (result.state === 'denied') {
        navigator.geolocation.getCurrentPosition((position) => {
          setGeoCallback({ x: position.coords.latitude, y: position.coords.longitude, auto: true });
        });
      }
    });
  } else {
    console.log('navigator-geolocation not available!');
  }
}
