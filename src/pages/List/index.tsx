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
  const { id } = useParams();
  alert(id);

  useEffect(() => {
    // id는 카드에서 처리
  }, []);

  return (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <Typography variant="h4">장소 정보</Typography>
      </Box>
      <Box mt={4}>
        <Stack spacing={4}>
          <PlaceCardWithId deletable={false} placeId={Number(id)} />
        </Stack>
      </Box>
    </Box>
  );
}

export function History() {
  const { user } = useContext(UserContext);
  const [ placeids, setPlaceids ] = useState<number[]>([]);

  async function getHistory() {
    try {
      const { data: placeResponse, status } = await axios.get(`${process.env.REACT_APP_API_URL}/history/list`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,

      });

      if (status === 201) {
        setPlaceids(placeResponse.historyList.map((e: {id: number; placeId: string})=>Number(e.placeId)));
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
          {placeids.length ? placeids.map((placeid) => (
            <PlaceCardWithId deletable={true} placeId={placeid} />
          )) : <Typography>표시할 내용이 없습니다.</Typography>}
        </Stack>
      </Box>
    </Box>
  ) : (
    <RequireLoginPage />
  );
}

export function Favorites() {
  const { user } = useContext(UserContext);
  const [placeids, setPlaceids] = useState<number[]>([]);

  async function getFavorites() {
    try {
      const { data: placeResponse, status } = await axios.get(`${process.env.REACT_APP_API_URL}/bookmark/list`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,

      });

      if (status === 201) {
        setPlaceids(placeResponse.historyList.map((e: {id: number; placeId: string})=>Number(e.placeId)));

      // 장소 정보를 가져옴
      // State 사용, 여기선 일단 임시값 사용
      }
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
          {placeids.length ? placeids.map((placeid) => (
            <PlaceCardWithId deletable={false} placeId={placeid} />
          )) : <Typography>표시할 내용이 없습니다.</Typography>}
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
// interface PlaceProp {
//   place: Place;
//   deletable: boolean;
// }

interface PlaceOnlyIdProp {
  placeId: number;
  deletable: boolean;
}

// export function PlaceCard({ place, deletable }: PlaceProp) {
//   const [star, setStar] = useState(place.isFavorite);
//   const [deleted, setDeleted] = useState(false);

//   useEffect(() => {
//     // 즐겨찾기 토글 동작
//   }, [star]);

//   useEffect(() => {
//     // 히스토리 제거 동작
//   }, [deleted]);

//   return deleted ? (
//     <div />
//   ) : (
//     <Card>
//       <Box padding={2}>
//         <Stack direction="row" justifyContent="flex-end" spacing={2}>
//           <IconButton
//             onClick={() => {
//               setStar(!star);
//             }}
//           >
//             <Star color={star ? 'primary' : 'disabled'} />
//           </IconButton>
//           {deletable ? (
//             <IconButton
//               onClick={() => {
//                 setDeleted(true);
//               }}
//             >
//               <Delete />
//             </IconButton>
//           ) : (
//             <div />
//           )}
//         </Stack>
//         <Stack direction="row" spacing={2}>
//           <img
//             width={'100px'}
//             height={'100px'}
//             src={place.img || placeImageFallback}
//             onError={(event) => {
//               // eslint-disable-next-line no-param-reassign
//               event.currentTarget.src = `/public/placeImageFallback.png`;
//             }}
//             alt={'🏞️'}
//           />
//           <Stack>
//             <Typography variant="h6">{place.name}</Typography>
//             <Typography variant="h6">별점 {place.grade}</Typography>
//           </Stack>
//         </Stack>
//       </Box>
//     </Card>
//   );
// }

export function PlaceCardWithId({ placeId, deletable }: PlaceOnlyIdProp ) {
  const [place, setPlace] = useState<Place>(placePlaceHolder);
  const [star, setStar] = useState(place.isFavorite);
  const [deleted, setDeleted] = useState(false);

  async function getPlace() {
    // id를 이용해 장소 정보를 가져옴.
    alert('getting place');
    if (Number(placeId) < 0) throw new Error('id is negative');
    const { data: placeResponse } = await axios.post(`${process.env.REACT_APP_API_URL}/place/id?id=${placeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    alert(placeResponse);
    setPlace({
      id: placeResponse.placeId,
      name: placeResponse.name,
      isFavorite: true,
      grade: placeResponse.star,
      img: undefined,
    });
  }

  async function getBookmarkIdfromPlace() {
    try {
      const { data: bookmarkId, status } = await axios.get(`${process.env.REACT_APP_API_URL}/bookmark/place?placeId=${placeId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,

      });
      if (status === 201) return bookmarkId;
      return -1;
    } catch {
      return -1;
    }
  }


  async function setFavorite(newValue: boolean, bookmarkId: number) {
    try {
      const { data: placeResponse, status } = newValue ?
      await axios.post(`${process.env.REACT_APP_API_URL}/bookmark`, { placeId }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,

      }) : await axios.delete(`${process.env.REACT_APP_API_URL}/bookmark/${bookmarkId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (status === 201) {
        console.log(placeResponse)
        setStar(newValue);
      }
  } catch {
      console.error('장소 정보를 가져오는데 실패했습니다.');
    }
  }

  useEffect(()=>{
    getPlace()
  }, []);

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
              if (star === true) {
                getBookmarkIdfromPlace().then((v)=>
                setFavorite(false,  v));
              }
              if (star === false) {
                getBookmarkIdfromPlace().then((v)=>
                setFavorite(true, v));
              }
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
