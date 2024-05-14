import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import Chart from "react-apexcharts";
import theme from "../styles/theme";
import NavBar from "../components/Navigation";
import CaretLeft from "../asset/fi-rr-caret-left.png";
import CaretRight from "../asset/fi-rr-caret-right.png";
import CaretRightGray from "../asset/fi-rr-caret-right-gray.png";

const MainDiv = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 350px;
  margin-left: 350px;
  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-top: 140px;
  justify-content: center;
`;

const DateHeader = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 3px;
  height: 40px;
  width: 100%;
  color: black;
  border-bottom: 2px solid
    ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

const HorizontalBox = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
    flex-direction: column;
  }
`;

const StatsContainer = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  margin-top: 20px;
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const FlexContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 30px;
`;

const VerticalBox = styled.div`
  display: flex;
  align-items: left;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const TextBox = styled.div`
  font-weight: bold;
  color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

const Btn = styled.img`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: relative;
  margin: 0 10px;

  &:hover + div {
    display: block;
  }
`;

const Tooltip = styled.div`
  display: none;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
`;

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border: 1px solid ${props => props.theme.color1 || theme.OrangeTheme.color1};
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  position: relative;
  width: 100%;
  max-width: 1000px;
`;

const SummaryHeader = styled.div`
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  position: absolute;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
  top: -20px;
  left: 50%;
  width: 30%;
  transform: translateX(-50%);
`;

const SummaryText = styled.div`
  font-size: 15px;
  color: black;
  margin-top: 20px;
`;

function Stat() {
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
  const token = window.localStorage.getItem("token");
  const [summaryText, setSummaryText] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
  );
  const [statsData, setStatsData] = useState(null);
  const [monthlyAchievement, setMonthlyAchievement] = useState(null);
  const [weeklyAchievement, setWeeklyAchievement] = useState(null);
  const [barColors, setBarColors] = useState([]);

  const formatDate = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    return `${year}.${month}`;
  };
  const [displayDate, setDisplayDate] = useState(formatDate(selectedDate));

  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);
    return decodedJSON.id.toString();
  };

  const fetchUserData = async () => {
    const userId = getUserIdFromToken();
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v1/userInfo/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const userThemeName = response.data.userColor;
      if (theme[userThemeName]) {
        setCurrentTheme(theme[userThemeName]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchAllData = async date => {
    const userId = getUserIdFromToken();
    const statsDate = formatDate(date);

    try {
      const [
        summaryResponse,
        statsResponse,
        monthlyAchievementResponse,
        weeklyAchievementResponse,
      ] = await Promise.all([
        axios.get(
          `http://15.164.151.130:4000/api/v4/summary/${userId}/${statsDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
        axios.get(
          `http://15.164.151.130:4000/api/v4/statsTag/${userId}/${statsDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
        axios.get(
          `http://15.164.151.130:4000/api/v4/statsMonth/${userId}/${statsDate}`,
        ),
        axios.get(
          `http://15.164.151.130:4000/api/v4/dayWeek/${userId}/${statsDate}`,
        ),
      ]);

      setSummaryText(summaryResponse.data.summaryResult);
      setStatsData(statsResponse.data);
      setMonthlyAchievement(monthlyAchievementResponse.data);
      const weeklyData = weeklyAchievementResponse.data;
      setWeeklyAchievement(weeklyData);

      const maxVal = Math.max(
        weeklyData.WEDdoneTodos,
        weeklyData.THUdoneTodos,
        weeklyData.FRIdoneTodos,
        weeklyData.MONdoneTodos,
        weeklyData.TUEdoneTodos,
        weeklyData.SATdoneTodos,
        weeklyData.SUNdoneTodos,
      );

      const newBarColors = [
        weeklyData.MONdoneTodos,
        weeklyData.TUEdoneTodos,
        weeklyData.WEDdoneTodos,
        weeklyData.THUdoneTodos,
        weeklyData.FRIDdoneTodos,
        weeklyData.SATdoneTodos,
        weeklyData.SUNdoneTodos,
      ].map(val => (val === maxVal ? currentTheme.color1 : "#d3d3d3"));

      setBarColors(newBarColors);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const chartOptions = {
    chart: {
      type: "polarArea",
    },
    labels: [
      statsData?.Word1st,
      statsData?.Word2st,
      statsData?.Word3st,
      statsData?.Word4st,
      "기타",
    ],
    fill: {
      opacity: 1,
    },
    stroke: {
      width: 1,
      colors: undefined,
    },
    yaxis: {
      show: false,
    },
    colors: [
      currentTheme.color1,
      currentTheme.color2,
      currentTheme.color3,
      currentTheme.color4,
      currentTheme.color5,
    ],
    tooltip: {
      enabled: true,
      y: {
        formatter(val) {
          return `${val}%`;
        },
      },
    },
    legend: {
      position: "right",
      formatter(seriesName, opts) {
        return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}%`;
      },
      markers: {
        width: 12,
        height: 12,
      },
      itemMargin: {
        vertical: 3,
      },
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 0,
        },
        spokes: {
          strokeWidth: 0,
        },
      },
    },
  };

  const chartSeries = [
    statsData?.Word1stPercent,
    statsData?.Word2stPercent,
    statsData?.Word3stPercent,
    statsData?.Word4stPercent,
    statsData?.etcPercent,
  ];

  const barChartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        endingShape: "rounded",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        statsData?.Word1st,
        statsData?.Word2st,
        statsData?.Word3st,
        statsData?.Word4st,
        "기타",
      ],
    },
    yaxis: {
      title: {
        text: "시간 (분)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter(val) {
          return `${val}분`;
        },
      },
    },
    colors: [
      currentTheme.color1,
      currentTheme.color2,
      currentTheme.color3,
      currentTheme.color4,
      currentTheme.color5,
    ],
  };

  const barChartSeries = [
    {
      name: "시간",
      data: [
        statsData?.Word1stTime,
        statsData?.Word2stTime,
        statsData?.Word3stTime,
        statsData?.Word4stTime,
        statsData?.etcTime,
      ],
    },
  ];

  const achievementChartOptions = {
    chart: {
      height: 280,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: -10,
        offsetX: -20,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "45%",
          background: "transparent",
        },
        track: {
          show: true,
          background: "#e1e5ff",
          strokeWidth: "100%",
          opacity: 1,
          margin: 15,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "22px",
            fontFamily: undefined,
            color: undefined,
            offsetY: -10,
          },
          total: {
            show: true,
            label: "이번 달",
            formatter(w) {
              return `${w.globals.series[0]}%`;
            },
            color: currentTheme.color1,
            fontSize: "16px",
            fontFamily: undefined,
          },
          value: {
            formatter(val) {
              return `${parseInt(val, 10)}%`;
            },
            color: "#111",
            fontSize: "36px",
            show: true,
            offsetY: 16,
          },
        },
      },
    },
    colors: [currentTheme.color1, "#B7BABF"],
    labels: ["이번 달 달성률", "저번 달 달성률"],
    legend: {
      show: true,
      floating: true,
      fontSize: "16px",
      position: "right",
      offsetX: -40,
      offsetY: 0,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0,
      },
      formatter(seriesName, opts) {
        return `${seriesName}:  ${opts.w.globals.series[opts.seriesIndex]}%`;
      },
      itemMargin: {
        vertical: 3,
      },
    },
  };

  const achievementChartSeries = [
    monthlyAchievement?.thisMonth || 0,
    monthlyAchievement?.prevMonth || 0,
  ];

  const weeklyAchievementChartOptions = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        distributed: true,
        horizontal: false,
        borderRadius: 15,
        columnWidth: "50%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: ["월", "화", "수", "목", "금", "토", "일"],
      labels: {
        style: {
          colors: [],
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    colors: barColors,
    tooltip: {
      enabled: true,
      y: {
        formatter(val) {
          return `${val} 건`;
        },
      },
    },
  };

  const weeklyAchievementChartSeries = [
    {
      name: "달성 노티",
      data: [
        weeklyAchievement?.MONdoneTodos || 0,
        weeklyAchievement?.TUEdoneTodos || 0,
        weeklyAchievement?.WEDdoneTodos || 0,
        weeklyAchievement?.THUdoneTodos || 0,
        weeklyAchievement?.FRIdoneTodos || 0,
        weeklyAchievement?.SATdoneTodos || 0,
        weeklyAchievement?.SUNdoneTodos || 0,
      ],
    },
  ];

  const handleMonthChange = offset => {
    const newDate = new Date(
      selectedDate.setMonth(selectedDate.getMonth() + offset),
    );
    setSelectedDate(newDate);
    setDisplayDate(formatDate(newDate));
    fetchAllData(newDate); // 날짜 변경 시 데이터 로드
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchAllData(selectedDate); // 초기 로드 시 데이터 로드
  }, []);

  const isPreviousMonth = () => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const selectedMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1,
    );
    return selectedMonth >= currentMonth;
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <NavBar setDate={setSelectedDate} />
      <div>
        <MainDiv>
          <DateHeader>
            <HorizontalBox>
              <div style={{ position: "relative" }}>
                <Btn
                  src={CaretLeft}
                  alt="지난달"
                  onClick={() => handleMonthChange(-1)}
                />
                <Tooltip>이전 달</Tooltip>
              </div>
              <TextBox>{displayDate} 노티분석</TextBox>
              <div style={{ position: "relative" }}>
                <Btn
                  src={isPreviousMonth() ? CaretRightGray : CaretRight}
                  alt="다음달"
                  onClick={() => !isPreviousMonth() && handleMonthChange(1)}
                  style={{
                    cursor: isPreviousMonth() ? "not-allowed" : "pointer",
                  }}
                />
                <Tooltip>다음 달</Tooltip>
              </div>
            </HorizontalBox>
          </DateHeader>
          <FlexContainer>
            <VerticalBox>
              <HorizontalBox>
                <SummaryContainer>
                  <SummaryHeader>⭐ 노티 분석 결과 ⭐</SummaryHeader>
                  <SummaryText>{summaryText}</SummaryText>
                </SummaryContainer>
              </HorizontalBox>
              <HorizontalBox>
                <StatsContainer>
                  {statsData ? (
                    <>
                      <Chart
                        options={chartOptions}
                        series={chartSeries}
                        type="polarArea"
                        width="450"
                      />
                      <Chart
                        options={barChartOptions}
                        series={barChartSeries}
                        type="bar"
                        width="500"
                      />
                    </>
                  ) : (
                    <p>데이터를 로드하는 중입니다...</p>
                  )}
                </StatsContainer>
                <StatsContainer>
                  <Chart
                    options={achievementChartOptions}
                    series={achievementChartSeries}
                    type="radialBar"
                    height={280}
                  />
                  <Chart
                    options={weeklyAchievementChartOptions}
                    series={weeklyAchievementChartSeries}
                    type="bar"
                    height={350}
                  />
                </StatsContainer>
              </HorizontalBox>
            </VerticalBox>
          </FlexContainer>
        </MainDiv>
      </div>
    </ThemeProvider>
  );
}

export default Stat;
