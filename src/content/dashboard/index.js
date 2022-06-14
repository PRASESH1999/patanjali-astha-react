import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
  useTheme
} from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import YardTwoToneIcon from '@mui/icons-material/YardTwoTone';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CountBlock from 'src/components/CountBlock';
import { useDispatch, useSelector } from 'src/store';
import { getCustomersMonthly, getCustomersWeekly, getDashboardCounts } from 'src/slices/dashboard';
import CountBlockBorder from 'src/components/CountBlockBorder';
import UserStatus from './blocks/UserStatus'
import PageHeader from './PageHeader';
import Activity from './blocks/Activity';

function Dashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const customerCount = useSelector((state) => state.dashboard.customerCount);
  const userCount = useSelector((state) => state.dashboard.userCount);
  const activeUserCount = useSelector((state) => state.dashboard.activeUserCount);
  const punchedInUserCount = useSelector((state) => state.dashboard.punchedInUserCount);
  const presentUserCount = useSelector((state) => state.dashboard.presentUserCount);
  const weeklyCustomers = useSelector((state) => state.dashboard.weeklyCustomers);
  const monthlyCustomers = useSelector((state) => state.dashboard.monthlyCustomers);
 
  useEffect(() => {
    dispatch(getDashboardCounts());
    dispatch(getCustomersWeekly());
    dispatch(getCustomersMonthly());
  }, [])
  
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <PageHeader />
      <Grid container direction="column" spacing={2} px={2}>
        <Grid item>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={6} lg={3}>
              <CountBlock
                title="Products"
                icon={<Inventory2Icon fontSize="large" />}
                value="0"
                iconColor={theme.colors.gradients.orange3}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <CountBlock
                title="Customers"
                icon={<YardTwoToneIcon fontSize="large" />}
                value={customerCount}
                iconColor={theme.colors.gradients.green2}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <CountBlock
                title="Orders"
                icon={<ReceiptTwoToneIcon fontSize="large" />}
                value="0"
                iconColor={theme.colors.gradients.purple3}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <CountBlock
                title="Users"
                icon={<PeopleAltIcon fontSize="large" />}
                value={userCount}
                iconColor={theme.colors.gradients.pink1}
              />
            </Grid>


            <Grid item xs={12} md={6} >
              <UserStatus
                activeUserCount={activeUserCount}
                presentUserCount={presentUserCount}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={12}>
                  <CountBlockBorder
                    title="Active Users"
                    value={activeUserCount}
                    borderColor={theme.colors.primary.main}
                    routeLink='/active-users'
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={12}>
                  <CountBlockBorder
                    title="Present Users"
                    value={presentUserCount}
                    borderColor={theme.colors.success.main}
                    routeLink='/present-users'
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={12}>
                  <CountBlockBorder
                    title="Punched In Users"
                    value={punchedInUserCount}
                    borderColor={theme.colors.secondary.main}
                    routeLink='/punched-in-users'
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Activity
                weeklyData={weeklyCustomers}
                monthlyData={monthlyCustomers}
              />
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
