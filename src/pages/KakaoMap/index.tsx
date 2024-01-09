// import { useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
import { useEffect } from 'react';
// import axios from 'axios';
// import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { Box, Button } from '@mui/material';
// @ts-expect-error kakao will be in global
const { kakao } = window;

export function KakaoMap() {
  useEffect(() => {
    const container = document.getElementById('map');
    // 지도를 담을 영역의 DOM 레퍼런스
    const options = {
      // 지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      // 지도의 중심좌표.
      level: 3,
      // 지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
    alert(map);
  }, []);

  return (
    <Box padding={2} paddingTop={4}>
      <Box>
        <div id="map" style={{ width: '100%', height: '20px' }}></div>
      </Box>
      <Button>이 위치로 설정</Button>
    </Box>
  );
}
