import React from 'react';
import {
  alpha,
  Card,
  Box,
  styled,
  Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);

function CardCountBorder(props) {
  const {
    borderColor,
    title,
    value,
    routeLink
  } = props;

  return (
    <Link to={routeLink} style={{ textDecoration: 'none' }}>
      <CardBorderBottom
        sx={{
          borderBottomColor: `${borderColor}`,
          boxShadow: `
                    0 .7rem 1rem ${alpha(borderColor, 0.08)},
                    0 .25rem .7rem ${alpha(borderColor, 0.15)}
                    `,
          display: 'flex',
          alignItems: 'center',
          p: 2,
          ":hover": {
            cursor: 'pointer',
            boxShadow: `
                    0 1rem 1rem ${alpha(borderColor, 0.08)},
                    0 1rem 1rem ${alpha(borderColor, 0.15)}
                    `
          }
        }}
      >
        <Box flexGrow={1} mr={2}>
          <Typography
            component="div"
            fontWeight="bold"
            sx={{
              pb: 0
            }}
            variant="caption"
          >
            {title}
          </Typography>
          <Typography
            sx={{
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center'
            }}
            variant="h2"
          >
            <span>{value}</span>
          </Typography>
        </Box>
        <Box display="inline-flex" position="relative">
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <NavigateNextIcon size='large' />
          </Box>
        </Box>
      </CardBorderBottom>
    </Link>
  )
}

export default CardCountBorder;
