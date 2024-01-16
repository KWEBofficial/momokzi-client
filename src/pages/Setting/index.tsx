import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { Box, Button, Divider, , TextField, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Box,
  Button,
  // Divider,
  Stack,
  FormControl,
  FormLabel,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Checkbox,
} from '@mui/material';
import { MyLocation } from '@mui/icons-material';

import { GeoContext, getCurrentLocation } from '../../models/geo';
import { FilterContext, foodTypeList, foodTypeMapAllTrue, foodTypeMapAllFalse } from '../../models/filter';
// @ts-expect-error kakao will be in global
const { kakao } = window;

export function FilterPage() {
  const { filter, setFilter } = useContext(FilterContext);
  const [localFilter, setLocalFilter] = useState(filter);
  const [showChildren, setShowChildren] = React.useState(true);

  const navigate = useNavigate();

  return (
    <Box padding={2} paddingTop={4}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">리뷰수 (이상)</FormLabel>
          <Slider
            aria-label="Temperature"
            getAriaValueText={(value) => `${value}°C`}
            valueLabelDisplay="auto"
            step={10}
            min={0}
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
          <span>
            <FormControlLabel
              label="전체"
              control={
                <Checkbox
                  checked={foodTypeList.every((v) => localFilter.foodType.get(v) === true)}
                  indeterminate={
                    foodTypeList.some((v) => localFilter.foodType.get(v) === false) &&
                    foodTypeList.some((v) => localFilter.foodType.get(v) === true)
                  }
                  onChange={(event, checked) =>
                    setLocalFilter({
                      reviewCount: localFilter.reviewCount,
                      distance: localFilter.distance,
                      goLater: localFilter.goLater,
                      foodType: checked ? new Map(foodTypeMapAllTrue) : new Map(foodTypeMapAllFalse),
                      star: localFilter.star,
                    })
                  }
                />
              }
            />
            <Button
              onClick={() => {
                setShowChildren(!showChildren);
              }}
            >
              {showChildren ? '가리기' : '보이기'}
            </Button>
            {showChildren && (
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                {foodTypeList.flatMap((v) => (
                  <FormControlLabel
                    label={v}
                    control={
                      <Checkbox
                        checked={localFilter.foodType.get(v)}
                        onChange={(event, value) => {
                          if (value !== null) {
                            setLocalFilter({
                              reviewCount: localFilter.reviewCount,
                              distance: localFilter.distance,
                              goLater: localFilter.goLater,
                              foodType: localFilter.foodType.set(v, value),
                              star: localFilter.star,
                            });
                          }
                        }}
                      />
                    }
                  />
                ))}
              </Box>
            )}
          </span>
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
            <ToggleButton value={0}>상관없음</ToggleButton>
            <ToggleButton value={1}>현재 운영 중</ToggleButton>
            <ToggleButton value={2}>1시간 뒤 운영 중</ToggleButton>
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
        <div id="map" style={{ width: '100%', height: '30em' }}></div>
      </Box>
      <Stack>
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
            getCurrentLocation(setGeo).then(() => {
              navigate('/');
            });
          }}
          startIcon={<MyLocation />}
        >
          현재 기기 위치에서 찾기
        </Button>
      </Stack>
    </Box>
  );
}
