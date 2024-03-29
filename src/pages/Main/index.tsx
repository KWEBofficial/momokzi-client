import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState /* , useState */ } from 'react';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress, Stack } from '@mui/material';

import { UserContext } from '../../models/user';
import { GeoContext, GeoContextType, getCurrentLocation } from '../../models/geo';
import { FilterContext } from '../../models/filter';
import thinkFish from '../../image/thinkFish.png';

// @ts-expect-error kakao will be in global
const { kakao } = window;

export function MainPage() {
  /**
   * user 상태(state)를 선언했습니다.
   * 이 state는 User 타입이며, 초기값은 아래와 같습니다.
   */
  const { geo, setGeo } = useContext<GeoContextType>(GeoContext);
  const { filter } = useContext(FilterContext);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  /**
   * 백엔드 서버에 요청을 보내서 유저 정보를 가져오는 함수입니다.
   * 이런 api호출하는데 axios 라이브러리를 많이 사용합니다.
   * 서버와 통신하는데 시간이 걸리기 때문에 비동기 함수(async)로 선언했습니다.
   * 비동기 함수는 항상 try-catch문으로 감싸주는 것이 좋습니다. (에러가 발생할 수 있기 때문에)
   */

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

  const geocoder = new kakao.maps.services.Geocoder();

  const [geoText, setGeoText] = useState('<지원되지 않는 위치>');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (geo.auto === true) getCurrentLocation(setGeo);
  }, []);

  useEffect(() => {
    geocoder.coord2RegionCode(geo.y, geo.x, displayCenterInfo);

    function displayCenterInfo(result: Array<{ address_name: string; region_type: string }>, status: unknown) {
      if (status === kakao.maps.services.Status.OK) {
        result.forEach((value) => {
          if (value.region_type === 'H') {
            setGeoText(value.address_name);
          }
        });
      }
    }
  }, [geo]);

  useEffect(() => {
//    const randomint = Math.floor(Math.random() * 3) + 1;
    if (searching) {
      axios
        .post(
//          `${process.env.REACT_APP_API_URL}/place/db?id=${randomint}`,
          `${process.env.REACT_APP_API_URL}/place`,
          {
            latitude: geo.x,
            longitude: geo.y,
            distanceStd: filter.distance,
            reviewCountStd: filter.reviewCount,
            opentimeStd: filter.goLater,
            foodTypeStd: Array.from(filter.foodType)
              .filter(([, v]) => v)
              .map(([s]) => s),
            starStd: filter.star,
            locationName: geoText.split(' ').at(-1),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          },
        )
        .then(async (value) => {
          // alert(JSON.stringify(value));
          if(user.isLogin){
          await axios.post(`${process.env.REACT_APP_API_URL}/history`, { id: value.data.placeId }, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });}
          else{
          await axios.post(`${process.env.REACT_APP_API_URL}/place/db`, { id: value.data.placeId }, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });}
          // alert(value.data.name);
          navigate(`/place/${value.data.placeId}`);
        })
        .catch((e) => {
          alert(e);
          navigate('/fail');
        });
    }
  }, [searching]);

  return (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <img src={thinkFish} />
        <Typography variant="h4">Momokzi</Typography>
      </Box>
      <Box height={40} />
      <Box>
        <Stack>
          <Typography>
            {`${geoText}에서 ${((foodType: Map<string, boolean>) => {
              const trueArray = Array.from(foodType, ([name, value]) => ({ name, value })).filter(({ value }) => value);
              return (
                (trueArray.length === 0
                  ? '[선택되지 않음]'
                  : trueArray[Math.floor(Math.random() * trueArray.length)].name) +
                (trueArray.length > 1 ? ` 외 ${trueArray.length - 1}개` : ``)
              );
            })(filter.foodType)}을(를) 검색합니다`}
          </Typography>
          <Button onClick={() => navigate('/locate')}>위치 설정</Button>
          <Button onClick={() => navigate('/filter')}>필터 설정</Button>
          {searching ? (
            <Button startIcon={<CircularProgress />} disabled={true}>
              돌리는 중..
            </Button>
          ) : (
            <Button onClick={() => setSearching(true)}>돌리기</Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
