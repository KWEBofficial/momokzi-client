import React, { useState } from 'react';
import { Box } from '@mui/material';

import BottomNav from '../BottomNavigation';
import { notLoginUserState, User, UserContext } from '../../models/user';
import { Geo, GeoContext } from '../../models/geo';
import { FilterContext, filterPlaceHolder } from '../../models/filter';

/**
 * 이 컴포넌트는 모든 페이지의 레이아웃을 담당합니다.
 * 모든 페이지는 이 컴포넌트 안에 들어갑니다.
 * 모바일처럼 꾸미기 위해서 스타일링 해보았습니다.
 * sx 속성은 mui에서 제공하는 스타일링 속성입니다.(다른 리액트 코드에서는 사용할 수 없습니다!)
 * BottomNav 컴포넌트는 페이지의 하단에 위치하도록 설정했습니다.
 */
interface LayoutProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: LayoutProps) => {
  const [user, setUser] = useState<User>(notLoginUserState);
  const [geo, setGeo] = useState<Geo>({ x: 0, y: 0, auto: true });
  const [filter, setFilter] = useState(filterPlaceHolder);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <GeoContext.Provider value={{ geo, setGeo }}>
        <FilterContext.Provider value={{ filter, setFilter }}>{children}</FilterContext.Provider>
      </GeoContext.Provider>
    </UserContext.Provider>
  );
};

export function Layout({ children }: LayoutProps) {
  return (
    <Provider>
      <Box display={'flex'} justifyContent={'center'} sx={{ backgroundColor: 'grey' }}>
        <Box width={'100%'} height="100vh">
          <BottomNav />
          <Box height="90%" sx={{ backgroundColor: '#ffffff' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Provider>
  );
}
