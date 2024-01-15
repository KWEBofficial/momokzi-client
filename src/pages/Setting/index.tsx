import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { Box, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { MyLocation } from '@mui/icons-material';

import { GeoContext, getCurrentLocation } from '../../models/geo';
// @ts-expect-error kakao will be in global
const { kakao } = window;

export function FilterPage() {
  return (
    <Box padding={2} paddingTop={4}>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">리뷰수</FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <FormLabel id="demo-radio-buttons-group-label">거리</FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <FormLabel id="demo-radio-buttons-group-label">별점</FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <FormLabel id="demo-radio-buttons-group-label">태그</FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <FormLabel id="demo-radio-buttons-group-label">음식 종류</FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <FormLabel id="demo-radio-buttons-group-label">운영 시간</FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <FormLabel id="demo-radio-buttons-group-label">태그</FormLabel>
        <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="female" name="radio-buttons-group">
          <FormControlLabel value="1" control={<Radio />} label="1" />
          <FormControlLabel value="2" control={<Radio />} label="2" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
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
