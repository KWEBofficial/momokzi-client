import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Box, Button, Divider, Stack, TextField, Typography, Card } from '@mui/material';

import { RequireLoginPage } from '../Error';
import { notLoginUserState, User, UserContext } from '../../models/user';

/**
 * 유저 생성 페이지입니다.
 * 회원가입을 위한 정보를 입력받습니다.
 * 회원가입 버튼을 누르면 백엔드 서버에 회원가입 요청을 보냅니다.
 */
export function RegisterPage() {
  const [input, setInput] = useState({
    username: '',
    password: '',
    nickname: '',
    age: '20',
    gender: 'M',
  });

  const navigate = useNavigate();

  /**
   * 아래에서 Textfield의 값을 변경할 때 사용하는 함수입니다.
   * Textfield의 값을 변경할 때마다 함수가 실행됩니다.
   * input state를 변경하고 있습니다.
   */
  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    /**
     * type이 number인 경우, event.target.value는 기본적으로 string이므로 Number() 함수를 사용해서 숫자로 변환해줍니다.
     */
    const value = event.target.type === 'number' ? Number(event.target.value) : event.target.value;

    setInput({
      ...input,
      [event.target.id]: value,
    });
  }

  function handleGender(event: React.ChangeEvent<HTMLInputElement>) {
    setInput({
      ...input,
      gender: event.target.value,
    });
  }

  function handleAge(event: SelectChangeEvent) {
    setInput({
      ...input,
      age: event.target.value,
    });
  }

  /**
   * 회원가입 버튼을 클릭하면 발생하는 함수입니다.
   * 백엔드 서버에 회원가입 요청을 보냅니다.
   * 회원가입이 완료되면 메인 페이지로 이동합니다.
   * 상태코드 201은 생성 성공을 의미합니다.
   * navigate('주소')는 해당 주소로 이동하는 함수입니다.
   * 참고로, navigate(-1)은 이전 페이지로 이동하는 함수입니다.
   */
  async function handleRegister() {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/sign_up`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        window.alert('회원가입이 완료되었습니다.');
        navigate('/login');
      }
    } catch (e) {
      window.alert('회원가입에 실패했습니다.');
    }
  }

  /**
   * TextField 컴포넌트는 HTML input 태그를 감싼 컴포넌트입니다.
   * onChange에 함수를 넣어주면, input 태그의 값이 변경될 때마다(한 글자 입력할 때마다) 함수가 실행됩니다.
   * 함수의 이름만 써야 합니다. handleInput() 이렇게 쓰면 안됩니다.
   * handleInput함수에 event 객체를 자동으로 넣어서 실행합니다.
   */
  return (
    <Box padding={2} paddingTop={4}>
      <Box marginBottom={4} textAlign={'center'}>
        <Typography variant="h4">회원 가입</Typography>
      </Box>
      <Box>
        <Box marginY={2}>
          <Divider />
        </Box>
        <Stack spacing={2}>
          <TextField required id="username" type="text" label="아이디" onChange={handleInput} />
          <TextField required id="password" type="password" label="비밀번호" onChange={handleInput} />
          <TextField required id="password2" type="password" label="비밀번호 확인" onChange={handleInput} />
          <TextField required id="nickname" type="text" label="닉네임" onChange={handleInput} />
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel required>나이</InputLabel>
              <Select id="age" defaultValue="20" onChange={handleAge}>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
                <MenuItem value={40}>Fourty</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FormControl>
            <FormLabel required>성별</FormLabel>
            <RadioGroup row id="gender" defaultValue="M" onChange={handleGender}>
              <FormControlLabel value="M" control={<Radio />} label="남성" />
              <FormControlLabel value="F" control={<Radio />} label="여성" />
            </RadioGroup>
          </FormControl>
        </Stack>
      </Box>
      <Box paddingY={6}>
        <Stack spacing={3} direction="row" justifyContent={'center'}>
          {/* navigate(-1)은 뒤로가기와 같습니다. */}
          {/* 함수가 간단하다면 () => handler() 형태로 간단하게 넣을 수 있습니다. */}
          <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>
            이전
          </Button>
          <Button variant="contained" color="primary" onClick={handleRegister}>
            회원 가입
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export function LoginPage() {
  const [input, setInput] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  /**
   * 아래에서 Textfield의 값을 변경할 때 사용하는 함수입니다.
   * Textfield의 값을 변경할 때마다 함수가 실행됩니다.
   * input state를 변경하고 있습니다.
   */
  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    /**
     * type이 number인 경우, event.target.value는 기본적으로 string이므로 Number() 함수를 사용해서 숫자로 변환해줍니다.
     */
    const value = event.target.type === 'number' ? Number(event.target.value) : event.target.value;

    setInput({
      ...input,
      [event.target.id]: value,
    });
  }

  const { setUser } = useContext(UserContext);

  /**
   * 회원가입 버튼을 클릭하면 발생하는 함수입니다.
   * 백엔드 서버에 회원가입 요청을 보냅니다.
   * 회원가입이 완료되면 메인 페이지로 이동합니다.
   * 상태코드 201은 생성 성공을 의미합니다.
   * navigate('주소')는 해당 주소로 이동하는 함수입니다.
   * 참고로, navigate(-1)은 이전 페이지로 이동하는 함수입니다.
   */
  async function handleLogin() {
    try {
      // const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/sign_in`, input, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // if (response.status === 201) {
      window.alert('로그인이 완료되었습니다.');
      setUser({
        isLogin: true,
        id: 10,
        username: 'asdf',
        password: '',
        nickname: 'asdgasdgasdg',
        age: 245,
        gender: 'male',
      });
      navigate('/');
      // }
    } catch (e) {
      window.alert('로그인에 실패했습니다.');
    }
  }

  /**
   * TextField 컴포넌트는 HTML input 태그를 감싼 컴포넌트입니다.
   * onChange에 함수를 넣어주면, input 태그의 값이 변경될 때마다(한 글자 입력할 때마다) 함수가 실행됩니다.
   * 함수의 이름만 써야 합니다. handleInput() 이렇게 쓰면 안됩니다.
   * handleInput함수에 event 객체를 자동으로 넣어서 실행합니다.
   */
  return (
    <Box padding={2} paddingTop={4}>
      <Box marginBottom={4} textAlign={'center'}>
        <Typography variant="h4">로그인</Typography>
      </Box>
      <Box>
        <Box marginY={2}>
          <Divider />
        </Box>
        <Stack spacing={2}>
          <TextField required id="username" type="text" label="ID" onChange={handleInput} />
          <TextField required id="password" type="password" label="Password" onChange={handleInput} />
        </Stack>
      </Box>
      <Box paddingY={6}>
        <Stack spacing={3} direction="row" justifyContent={'center'}>
          {/* navigate(-1)은 뒤로가기와 같습니다. */}
          {/* 함수가 간단하다면 () => handler() 형태로 간단하게 넣을 수 있습니다. */}
          <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>
            이전
          </Button>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            로그인
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export function LogOutPage() {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  useEffect(() => {
    // 로그아웃 관련 처리 더 해야함
    (() => {
      setUser(notLoginUserState);
      window.alert('로그아웃이 완료되었습니다.');
      navigate('/');
    })();
  }, []);

  return <Box padding={2} paddingTop={4}></Box>;
}

export function MyPage() {
  const { user } = useContext(UserContext);

  async function getUser() {
    try {
      /**
       * process.env 는 환경변수를 의미합니다
       * .env 파일에 REACT_APP_API_URL 이라는 변수를 선언했기 때문에 이런식으로 불러올 수 있습니다.
       * 실행되는 환경(개발이냐 라이브냐)에 따라 달라지는 값이거나, 보안이 필요한 값들은 .env 파일에 넣어두고 불러와서 사용합니다.
       * .env 파일은 git에 올라가지 않습니다.(지금은 교육용으로 올려놨습니다)
       * .env 파일은 .gitignore에 등록되어 있습니다.
       *
       * axios.get()은 여러 값들을 반환하지만, 우리는 data, status만 사용할 것입니다.
       * data라는 이름은 너무 추상적이기 때문에 userResponse라는 이름으로 사용합니다.
       */
      // const { data: userResponse, status } = await axios.get(`${process.env.REACT_APP_API_URL}/user/info`);
      // if (status === 200) {
      // setUser(userResponse);
      // } else {
      //   throw new Error();
      // }
    } catch {
      //   console.error('유저 정보를 가져오는데 실패했습니다.');
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
    getUser();
  }, []);

  return user.isLogin ? (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <Typography variant="h4">사용자 정보</Typography>
      </Box>
      <Box height={40} />
      <Box>
        <Typography variant="h6">이름: {user.username}</Typography>
        <Typography variant="h6">성: {user.password}</Typography>
        <Typography variant="h6">나이: {user.age}</Typography>
      </Box>
    </Box>
  ) : (
    <RequireLoginPage />
  );
}

/**
 * 전체적인 구조는 MainPage와 비슷합니다. (MainPage를 먼저 보고 오세요)
 * 여기서는 user 한 명이 아닌, 배열로 받습니다.
 * 배열로 받을 때도 크게 다르진 않지만, map 함수를 사용해서 배열을 적절하게 렌더링해줘야 합니다.
 */
export function ListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { age } = useParams();

  async function getUsers() {
    try {
      const { data: userResponse, status } = await axios.get(`${process.env.REACT_APP_API_URL}/user/${age}`);
      if (status === 200) {
        setUsers(userResponse);
      } else {
        throw new Error();
      }
    } catch {
      console.error('유저 정보를 가져오는데 실패했습니다.');
    }
  }

  useEffect(() => {
    getUsers();
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
        <Typography variant="h4">04년생 목록</Typography>
      </Box>
      <Box mt={4}>
        <Stack spacing={4}>
          {users.map((user) => (
            <UserCard key={user.id} firstName={user.username} lastName={user.password} age={user.age} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

/**
 * 이런식으로 mui를 사용해도 커스텀 컴포넌트를 만들어서 사용할 수 있습니다.
 * interface를 사용해서 props의 타입을 정해줄 수 있습니다.
 */
interface UserCardProps {
  firstName: string;
  lastName: string;
  age: number;
}

function UserCard({ firstName, lastName, age }: UserCardProps) {
  return (
    <Card>
      <Box padding={2}>
        <Typography variant="h6">
          이름: {lastName} {firstName}
        </Typography>
        <Typography variant="h6">나이: {age}</Typography>
      </Box>
    </Card>
  );
}
