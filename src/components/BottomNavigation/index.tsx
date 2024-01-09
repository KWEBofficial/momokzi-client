/**
 * 아이콘 목록은 아래 링크에서 확인 가능.
 * 버튼 누르면 바로 복사해서 사용할 수 있음.
 * https://mui.com/material-ui/material-icons/
 */

import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BottomNavigation from '@mui/material/BottomNavigation';
import {
  AccountCircleRounded,
  CreateRounded,
  FavoriteRounded,
  HistoryRounded,
  LoginRounded,
  LogoutRounded,
  SetMealRounded,
} from '@mui/icons-material';

import { LoginContext, LoginContextType } from '../../models/user';

export default function BottomNav() {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isLogin } = useContext<LoginContextType>(LoginContext);
  return (
    <Box sx={{ width: '100%', height: '10%' }}>
      {isLogin ? (
        <BottomNavigation showLabels sx={{ height: '100%', backgroundColor: 'aliceblue' }}>
          <BottomNavigationAction label="momokzi" icon={<SetMealRounded />} onClick={() => navigate('/')} />
          <BottomNavigationAction label="히스토리" icon={<HistoryRounded />} onClick={() => navigate('/history')} />
          <BottomNavigationAction label="즐겨찾기" icon={<FavoriteRounded />} onClick={() => navigate('/favorites')} />
          <BottomNavigationAction
            label="회원정보"
            icon={<AccountCircleRounded />}
            onClick={() => navigate('/mypage')}
          />
          <BottomNavigationAction label="로그아웃" icon={<LogoutRounded />} onClick={() => navigate('/logout')} />
        </BottomNavigation>
      ) : (
        <BottomNavigation showLabels sx={{ height: '100%', backgroundColor: 'aliceblue' }}>
          <BottomNavigationAction label="momokzi" icon={<SetMealRounded />} onClick={() => navigate('/')} />
          <BottomNavigationAction label="로그인" icon={<LoginRounded />} onClick={() => navigate('/login')} />
          <BottomNavigationAction label="회원가입" icon={<CreateRounded />} onClick={() => navigate('/register')} />
        </BottomNavigation>
      )}
    </Box>
  );
}
