// import { useNavigate } from 'react-router-dom';
// import { useContext, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

// import { GlobalAppContext } from '../../models/user';

export function NotFoundPage() {
  return (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <Typography variant="h4">404 Not Found</Typography>
      </Box>
      <Box height={40} />
      <Box>
        <Typography>요청하신 페이지를 찾을 수 없습니다.</Typography>
      </Box>
    </Box>
  );
}

export function RequireLoginPage() {
  return (
    <Box paddingX={3} paddingY={5}>
      <Box>
        <Typography variant="h4">이 페이지는 로그인해야 볼 수 있습니다.</Typography>
      </Box>
      <Box height={40} />
      <Box>
        <Button>로그인</Button>
      </Box>
    </Box>
  );
}
