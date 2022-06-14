import { 
  Box, 
  Card,
  Typography, 
  styled 
} from '@mui/material';

const FooterWrapper = styled(Card)(
  ({ theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(2)};
        padding: ${theme.spacing(0)}
  `
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        p={2}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">
            &copy; 2021 Patanjali Astha
          </Typography>
        </Box>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
