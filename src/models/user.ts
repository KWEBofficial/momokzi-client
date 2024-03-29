/**
 * User model
 * User 객체의 타입을 정의해 놓은 인터페이스입니다.
 * 필요에 따라 수정하거나 삭제하셔도 됩니다.
 * 자주 쓰이는 인터페이스는 models 폴더에 정의해 놓고 import해서 사용하면 됩니다.
 * @interface User
 * @property {number} id - 유저의 고유 id
 * @property {string} username - 유저의 이름
 * @property {string} password - 유저의 성
 */
import React from 'react';

export interface User {
  isLogin: boolean;
  id: number;
  username: string;
  password: string;
  nickname: string;
  age: number;
  gender: string;
}

export const notLoginUserState: User = {
  isLogin: false,
  id: 0,
  username: '',
  password: '',
  nickname: '',
  age: 0,
  gender: '',
};

export interface UserContextType {
  // Define the types of values your context will provide
  user: User;
  setUser: (newState: User) => void;
}

// Create the context with a default value
export const UserContext = React.createContext<UserContextType>({
  user: notLoginUserState,
  setUser: () => {},
});
