import { Grid, Typography, Avatar, useTheme } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import { format } from 'date-fns';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

function PageHeader() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <PageTitleWrapper>
      <Grid container alignItems="center">
        <Grid item>
          <Avatar
            sx={{
              mr: 2,
              width: theme.spacing(8),
              height: theme.spacing(8)
            }}
            variant="rounded"
            alt={user.name}
            src={user.avatar}
          />
        </Grid>
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Welcome, {user.Name}!
          </Typography>
          <Typography variant="subtitle2">
            These are your analytics stats for today, {' '}
            <b>{format(new Date(), 'MMMM dd yyyy')}</b>
          </Typography>
        </Grid>
      </Grid>
    </PageTitleWrapper>
  );
}

export default PageHeader;
