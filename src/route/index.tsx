import { Route, Routes } from 'react-router-dom';

import { FilterPage, MapPage } from '../pages/Setting';
import { RegisterPage, LoginPage, MyPage, LogOutPage } from '../pages/Register';
import { MainPage } from '../pages/Main';
import { History, Favorites, PlacePage } from '../pages/List';
import { NotFoundPage, SearchFailedPage } from '../pages/Error';

/**
 * 어느 url에 어떤 페이지를 보여줄지 정해주는 컴포넌트입니다.
 * Routes 안에 Route 컴포넌트를 넣어서 사용합니다.
 */
export function RouteComponent() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/filter" element={<FilterPage />} />
      <Route path="/locate" element={<MapPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<LogOutPage />} />
      <Route path="/history" element={<History />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/fail" element={<SearchFailedPage />} />
      <Route path="/place/:id" element={<PlacePage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
