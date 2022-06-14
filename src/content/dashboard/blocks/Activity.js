import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tabs,
  Tab,
  Box,
  styled,
  useTheme
} from '@mui/material';
import Chart from 'react-apexcharts';

const TabsContainerWrapper = styled(CardContent)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[5]};
`
);

function Activity({ weeklyData, monthlyData }) {
  const theme = useTheme();

  const [currentTab, setCurrentTab] = useState('weekly');

  const tabs = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: [3, 3],
      dashArray: [0, 5],
      colors: [theme.colors.error.main]
    },
    fill: {
      opacity: [1, 0.2]
    },
    theme: {
      mode: theme.palette.mode
    },
    markers: {
      hover: {
        sizeOffset: 1
      },
      shape: 'circle',
      size: 5,
      strokeWidth: 1,
      strokeOpacity: 1,
      strokeColors: theme.colors.alpha.white[100],
      colors: [theme.colors.error.main, theme.colors.primary.main]
    },
    colors: [theme.colors.error.main],
    dataLabels: {
      enabled: false
    },
    legend: {
      labels: {
        useSeriesColors: true
      },
      itemMargin: {
        horizontal: 15
        ,
        vertical: 15
      },
      show: true
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      labels: {
        show: true
      }
    },
    yaxis: {
      show: true,
      labels: {
        show: true
      }
    },
    grid: {
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      strokeDashArray: 5,
      borderColor: theme.colors.alpha.black[10]
    }
  };

  const weeklyChartData = [
    {
      type: 'line',
      name: 'New Customers',
      data: weeklyData
    }
  ];

  const monthlyChartData = [
    {
      type: 'line',
      name: 'New Customers',
      data: monthlyData
    }
  ];

  return (
    <Card
      sx={{
        height: '100%'
      }}
    >
      <CardHeader
        title="New Customers"
      />
      
      <Divider />

      <TabsContainerWrapper>
        <Tabs
          onChange={handleTabsChange}
          value={currentTab}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>
      <Divider />

      <Box>
        {currentTab === 'weekly' && (
          <Chart
            options={chartOptions}
            series={weeklyChartData}
            type="line"
            height={322}
          />
        )}

        {currentTab === 'monthly' && (
          <Chart
            options={chartOptions}
            series={monthlyChartData}
            type="line"
            height={322}
          />
        )}
      </Box>
    </Card>
  );
}

export default Activity;
