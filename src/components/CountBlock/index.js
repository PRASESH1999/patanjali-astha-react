import React from 'react';
import {
  Avatar,
  Card,
  Typography,
  styled,
  CardContent,
  Stack
} from '@mui/material';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      color: white;
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
`
);

const CardContentWrapper = styled(CardContent)(
  ({ theme }) => `
     padding: ${theme.spacing(2.5, 3, 3)};
`
);

const CountBlock = (props) => {
  const {
    icon,
    title,
    value,
    iconColor,
  } = props;

  return (
    <Card>
      <CardContentWrapper>
        <Typography variant="overline" color="text.primary">
          {title}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          py={2}
        >
          <AvatarWrapper
            variant="rounded"
            sx={{
              background: iconColor,
            }}
          >
            {icon}
          </AvatarWrapper>

          <Typography
            variant="h1"
            ml={2}
          >
            {value}
          </Typography>
        </Stack>
      </CardContentWrapper>
    </Card>
  )
}

export default CountBlock;