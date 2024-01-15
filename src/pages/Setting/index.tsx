import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { Box, Button, Divider, , TextField, Typography } from '@mui/material';
import {
  Box,
  Button,
  // Divider,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Slider,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { MyLocation } from '@mui/icons-material';

import { GeoContext, getCurrentLocation } from '../../models/geo';
import { FilterContext } from '../../models/filter';
// @ts-expect-error kakao will be in global
const { kakao } = window;

export function FilterPage() {
  const { filter, setFilter } = useContext(FilterContext);
  const [localFilter, setLocalFilter] = useState(filter);

  const navigate = useNavigate();

  const filterList = [
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

  return (
    <Box padding={2} paddingTop={4}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">리뷰수 (이상)</FormLabel>
          <Slider
            aria-label="Temperature"
            defaultValue={30}
            getAriaValueText={(value) => `${value}°C`}
            valueLabelDisplay="auto"
            step={10}
            min={10}
            max={500}
            onChange={(event, value) => {
              if (value !== null && typeof value === 'number') {
                setLocalFilter({
                  reviewCount: value,
                  distance: localFilter.distance,
                  goLater: localFilter.goLater,
                  foodType: localFilter.foodType,
                  star: localFilter.star,
                });
              }
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">거리</FormLabel>
          <ToggleButtonGroup
            color="primary"
            value={localFilter.distance}
            exclusive
            onChange={(event, value) => {
              if (value !== null) {
                setLocalFilter({
                  reviewCount: localFilter.reviewCount,
                  distance: value,
                  goLater: localFilter.goLater,
                  foodType: localFilter.foodType,
                  star: localFilter.star,
                });
              }
            }}
            aria-label="Platform"
          >
            <ToggleButton value={300}>300m 근처</ToggleButton>
            <ToggleButton value={500}>500m 근처</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">별점 (이상)</FormLabel>
          <Slider
            aria-label="Temperature"
            defaultValue={localFilter.star}
            getAriaValueText={(value) => `${value}°C`}
            valueLabelDisplay="auto"
            onChange={(event, value) => {
              if (value !== null && typeof value === 'number') {
                setLocalFilter({
                  reviewCount: localFilter.reviewCount,
                  distance: localFilter.distance,
                  goLater: localFilter.goLater,
                  foodType: localFilter.foodType,
                  star: value,
                });
              }
            }}
            step={0.1}
            min={0}
            max={5}
          />
        </FormControl>
        <FormControl>
          <FormLabel id="foodType-label">음식 종류</FormLabel>
          <Select
            aria-labelledby="foodType-select"
            defaultValue={localFilter.foodType}
            name="foodType"
            onChange={(event) => {
              if (event.target.value !== null && typeof event.target.value === 'string') {
                setLocalFilter({
                  reviewCount: localFilter.reviewCount,
                  distance: localFilter.distance,
                  goLater: localFilter.goLater,
                  foodType: event.target.value,
                  star: localFilter.star,
                });
              }
            }}
          >
            {filterList.flatMap((v) => (
              <MenuItem value={v}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">운영 시간</FormLabel>
          <ToggleButtonGroup
            color="primary"
            value={localFilter.goLater}
            exclusive
            onChange={(event, value) => {
              if (value !== null) {
                setLocalFilter({
                  reviewCount: localFilter.reviewCount,
                  distance: localFilter.distance,
                  goLater: value,
                  foodType: localFilter.foodType,
                  star: localFilter.star,
                });
              }
            }}
            aria-label="Platform"
          >
            <ToggleButton value={false}>현재 운영 중</ToggleButton>
            <ToggleButton value={true}>1시간 뒤 운영 중</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
      </Stack>
      <Button
        onClick={() => {
          setFilter(localFilter);
          navigate('/');
        }}
      >
        확인
      </Button>
      <Button
        onClick={() => {
          navigate('/');
        }}
      >
        취소
      </Button>
    </Box>
  );
}

export function MapPage() {
  const { geo, setGeo } = useContext(GeoContext);
  const [localGeo, setLocalGeo] = useState(geo);
  const [localGeoText, setLocalGeoText] = useState('');

  const navigate = useNavigate();
  const geocoder = new kakao.maps.services.Geocoder();

  useEffect(() => {
    if (geo.auto === true) getCurrentLocation(setGeo);
    setLocalGeo(geo);

    const map = new kakao.maps.Map(document.getElementById('map'), {
      center: new kakao.maps.LatLng(localGeo.x, localGeo.y),
      level: 3,
    });
    const marker = new kakao.maps.Marker({ position: map.getCenter() });
    marker.setMap(map);

    // 드래그가 끝났을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'dragend', function () {
      marker.setPosition(map.getCenter());
      const y = map.getCenter().getLng();
      const x = map.getCenter().getLat();
      setLocalGeo({ x, y, auto: false });
    });
  }, []);

  useEffect(() => {
    geocoder.coord2RegionCode(localGeo.y, localGeo.x, displayCenterInfo);

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result: Array<{ address_name: string; region_type: string }>, status: unknown) {
      if (status === kakao.maps.services.Status.OK) {
        result.forEach((value) => {
          if (value.region_type === 'H') {
            setLocalGeoText(value.address_name);
          }
        });
      }
    }
  }, [localGeo]);

  return (
    <Box padding={2} paddingTop={4}>
      <Box>
        <div id="map" style={{ width: '1000px', height: '1000px' }}></div>
      </Box>
      <Button
        onClick={() => {
          setGeo(localGeo);
          navigate('/');
        }}
      >
        {localGeoText}
        에서 찾기
      </Button>
      <Button
        onClick={() => {
          getCurrentLocation(setLocalGeo);
          navigate('/');
        }}
        startIcon={<MyLocation />}
      >
        현재 기기 위치에서 찾기
      </Button>
    </Box>
  );
}
