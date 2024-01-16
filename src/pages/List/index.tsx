import { useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import { Delete, Star } from '@mui/icons-material';

// import { User } from '../../models/user';
import { RequireLoginPage } from '../Error';
import { UserContext } from '../../models/user';
import { Place, placePlaceHolder } from '../../models/place';
import placeImageFallback from '../../image/placeImageFallback.png';

/**
 * 전체적인 구조는 MainPage와 비슷합니다. (MainPage를 먼저 보고 오세요)
 * 여기서는 user 한 명이 아닌, 배열로 받습니다.
 * 배열로 받을 때도 크게 다르진 않지만, map 함수를 사용해서 배열을 적절하게 렌더링해줘야 합니다.
 */

export function PlacePage() {
  const [place, setPlace] = useState<Place>(placePlaceHolder);
  const { id } = useParams();

  async function getPlace() {
    try {
      // id를 이용해 장소 정보를 가져옴.
      if (Number(id) < 0) throw new Error('id is negative');
      setPlace({
        id: 1,
        name: '어흥식당',
        isFavorite: true,
        grade: 4.0,
        img: undefined,
      });

      // const { data: userResponse, status } = await axios.get(`${process.env.REACT_APP_API_URL}/user/${age}`);
      // if (status === 200) {
      //   setUsers(userResponse);
      // } else {
      //   throw new Error();
      // }
    } catch {
      console.error('유저 정보를 가져오는데 실패했습니다.');
    }
  }

  useEffect(() => {
    getPlace();
  }, []);

  /**
   * user.map 을 실행하고 있습니다.
   * js에서도 for, while 반복문이 있기는 하지만 금기시하고 있습니다.
   * 대신에 map, filter, reduce 등의 메서드를 사용합니다.
   * for, while보다 더 간결하고, 가독성이 좋습니다.
   * 특히 map은 배열을 렌더링할 때 많이 사용합니다. 매우 중요!!
   */
  return (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <Typography variant="h4">장소 정보</Typography>
      </Box>
      <Box mt={4}>
        <Stack spacing={4}>
          <PlaceCard deletable={false} place={place} />
        </Stack>
      </Box>
    </Box>
  );
}

export function History() {
  const { user } = useContext(UserContext);
  const [places, setPlaces] = useState<Place[]>([]);

  async function getHistory() {
    try {
      const { data: placeResponse, status } = await axios.get(`${process.env.REACT_APP_API_URL}/history/list?userid=${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,

      });

      if (status === 201) {

        alert(JSON.stringify(placeResponse));
        setPlaces([
          {
            id: 1,
            name: '어흥식당',
            isFavorite: false,
            grade: 4.0,
            img: undefined,
          },
        ]);

      // 장소 정보를 가져옴
      // State 사용, 여기선 일단 임시값 사용
      }
  } catch {
      console.error('장소 정보를 가져오는데 실패했습니다.');
    }
  }

  useEffect(() => {
    getHistory();
  }, []);

  return user.isLogin ? (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <Typography variant="h4">히스토리</Typography>
      </Box>
      <Box mt={4}>
        <Stack spacing={4}>
          {places.map((place) => (
            <PlaceCard deletable={true} place={place} />
          ))}
        </Stack>
      </Box>
    </Box>
  ) : (
    <RequireLoginPage />
  );
}

export function Favorites() {
  const { user } = useContext(UserContext);
  const [places, setPlaces] = useState<Place[]>([]);

  async function getFavorites() {
    try {
      // 장소 정보를 가져옴
      // State 사용, 여기선 일단 임시값 사용
      // 장소 정보를 "id"만 가져오고 나중에 하도록 해도 될듯
      setPlaces([
        {
          id: 1,
          name: '어흥식당',
          isFavorite: true,
          grade: 4.0,
          img: undefined,
        },
      ]);
    } catch {
      console.error('장소 정보를 가져오는데 실패했습니다.');
    }
  }

  useEffect(() => {
    getFavorites();
  }, []);

  return user.isLogin ? (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <Typography variant="h4">즐겨찾기</Typography>
      </Box>
      <Box mt={4}>
        <Stack spacing={4}>
          {places.map((place) => (
            <PlaceCard deletable={false} place={place} />
          ))}
        </Stack>
      </Box>
    </Box>
  ) : (
    <RequireLoginPage />
  );
}

/**
 * 이런식으로 mui를 사용해도 커스텀 컴포넌트를 만들어서 사용할 수 있습니다.
 * interface를 사용해서 props의 타입을 정해줄 수 있습니다.
 */
interface PlaceProp {
  place: Place;
  deletable: boolean;
}

export function PlaceCard({ place, deletable }: PlaceProp) {
  const [star, setStar] = useState(place.isFavorite);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    // 즐겨찾기 토글 동작
  }, [star]);

  useEffect(() => {
    // 히스토리 제거 동작
  }, [deleted]);

  return deleted ? (
    <div />
  ) : (
    <Card>
      <Box padding={2}>
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <IconButton
            onClick={() => {
              setStar(!star);
            }}
          >
            <Star color={star ? 'primary' : 'disabled'} />
          </IconButton>
          {deletable ? (
            <IconButton
              onClick={() => {
                setDeleted(true);
              }}
            >
              <Delete />
            </IconButton>
          ) : (
            <div />
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          <img
            width={'100px'}
            height={'100px'}
            src={place.img || placeImageFallback}
            onError={(event) => {
              // eslint-disable-next-line no-param-reassign
              event.currentTarget.src = `/public/placeImageFallback.png`;
            }}
            alt={'🏞️'}
          />
          <Stack>
            <Typography variant="h6">{place.name}</Typography>
            <Typography variant="h6">별점 {place.grade}</Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
