import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

import { Geo } from '../../models/geo';

export function MainPage() {
  /**
   * user 상태(state)를 선언했습니다.
   * 이 state는 User 타입이며, 초기값은 아래와 같습니다.
   */
  const [geo, setGeo] = useState<Geo>({
    x: 0,
    y: 0,
  });
  const navigate = useNavigate();

  /**
   * 백엔드 서버에 요청을 보내서 유저 정보를 가져오는 함수입니다.
   * 이런 api호출하는데 axios 라이브러리를 많이 사용합니다.
   * 서버와 통신하는데 시간이 걸리기 때문에 비동기 함수(async)로 선언했습니다.
   * 비동기 함수는 항상 try-catch문으로 감싸주는 것이 좋습니다. (에러가 발생할 수 있기 때문에)
   */

  async function getLocation() {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
        if (result.state === 'granted') {
          console.log(result.state);
          console.log('granted!');
          // If granted then you can directly call your function here
          navigator.geolocation.getCurrentPosition((position) => {
            setGeo({ x: position.coords.latitude, y: position.coords.longitude });
          });
        } else if (result.state === 'prompt') {
          console.log(result.state);
          navigator.geolocation.getCurrentPosition((position) => {
            setGeo({ x: position.coords.latitude, y: position.coords.longitude });
          });
        } else if (result.state === 'denied') {
          console.log('denided!');
          navigator.geolocation.getCurrentPosition((position) => {
            setGeo({ x: position.coords.latitude, y: position.coords.longitude });
          });
          // If denied then you have to show instructions to enable location
        }
        // result.onchange = function () {
        //   console.log(result.state);
        // };
      });
    } else {
      alert('Sorry Not available!');
    }
  }

  /**
   * useEffect는 컴포넌트가 렌더링 될 때마다 실행되는 함수입니다.
   * 두번째 인자로 빈 배열을 넣어주면, 컴포넌트가 처음 렌더링 될 때만 실행됩니다.
   * 이런식으로 사용하면, 컴포넌트가 처음 렌더링 될 때만 실행되는 코드를 작성할 수 있습니다.
   * (처음 렌더링 될 때만 실행되는 코드는 보통 api 호출 코드입니다.) -> api 호출은 렌더링된 후 딱 한 번만 실행해야 합니다.
   * api 호출하는 액션 자체만으로 프론트나 백엔드나 성능이 저하됩니다.
   *
   * deps(=의존성) 배열이 빈 배열이므로 첫 렌더링 때만 실행됩니다.
   * 만약 의존성 배열에 어떠한 변수나 상태를 넣어주면, 해당 변수나 상태가 변경될 때마다 실행됩니다. -> 상황에 따라 유용하게 사용할 수 있습니다.
   */
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <Typography variant="h4">Momokzi</Typography>
      </Box>
      <Box height={40} />
      <Box>
        <Box>
          <Typography>{'<위치>에서 검색합니다'}</Typography>
          <Button onClick={() => navigate('/locate')}>위치 설정</Button>
        </Box>
        <Typography>{`좌표: ${geo.x} 와 ${geo.y}`}</Typography>
        <Button onClick={() => navigate('/filter')}>필터 설정</Button>
        <Button onClick={() => navigate('/place/10')}>돌리기</Button>
      </Box>
    </Box>
  );
}
