import { useNavigate } from 'react-router-dom';
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
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';

import { RequireLoginPage } from '../Error';
import { notLoginUserState, UserContext } from '../../models/user';


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
        withCredentials: true,
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

  // 로그인 요청을 보내는 함수
  async function handleLogin() {
    try {
      const { data: userResponse, status } = await axios.post(`${process.env.REACT_APP_API_URL}/auth/sign_in`, input, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (status === 201) {
        setUser({
        isLogin: true,
        id: userResponse.id,
        username: userResponse.username,
        password: '',
        nickname: userResponse.nickname,
        age: userResponse.age,
        gender: userResponse.gender,
      });
      window.alert('로그인이 완료되었습니다.');
      navigate('/');
      }
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

  const { user, setUser } = useContext(UserContext);

  async function logout() {
    try {
      const { status } = await axios.get(`${process.env.REACT_APP_API_URL}/auth/sign_out`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if(status === 201 || user !== notLoginUserState){
        setUser(notLoginUserState);
        window.alert('로그아웃이 완료되었습니다.');
        navigate('/');
      }
    } catch {
      console.log("error")
    }
  }

  useEffect(() => {
    // 로그아웃 관련 처리 더 해야함
    logout();
  }, []);

  return <Box padding={2} paddingTop={4}></Box>;
}

export function MyPage() {
  const { user } = useContext(UserContext);

  async function getMyPage() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/info`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log(response)
    } catch {
      console.log("error")
    }
  }
  
  useEffect(() => {
    // 받아오지 않고 세션 정보 직접 사용
    getMyPage();
  }, []);

  return user.isLogin ? (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <Typography variant="h4">사용자 정보</Typography>
      </Box>
      <Box height={40} />
      <Box>
        <Typography variant="h6">고유번호: {user.id}</Typography>
        <Typography variant="h6">아이디: {user.username}</Typography>
        <Typography variant="h6">닉네임: {user.nickname}</Typography>
        <Typography variant="h6">나이: {user.age}</Typography>
        <Typography variant="h6">성별: {user.gender}</Typography>
      </Box>
    </Box>
  ) : (
    <RequireLoginPage />
  );
}


