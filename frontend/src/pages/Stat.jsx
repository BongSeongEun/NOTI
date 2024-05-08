// 통계 페이지
import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDropzone, open } from "react-dropzone";
import axios from "axios"; // axios import 확인
import Chart from "react-apexcharts";
import {
  Navigate,
  useNavigate,
  Link,
  Toggle,
  redirect,
} from "react-router-dom";
import { backgrounds, lighten } from "polished";
import DiaryContainer from "../components/DiaryContainer";
import theme from "../styles/theme"; // 테마 파일 불러오기
import NavBar from "../components/Navigation";

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
  // 아이템을 가로정렬하는 상자
  display: flex; // 정렬하려면 이거 먼저 써야함
  flex-direction: row; // 가로나열
  justify-content: center; // 가운데 정렬
  width: 100%;
  height: auto;
  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
    flex-direction: column;
  }
`;
const VerticalBox = styled.div`
  // 아이템을 세로정렬하는 상자
  display: flex; // 정렬하려면 이거 먼저 써야함
  align-items: left; // 수직 가운데 정렬
  flex-direction: column; // 세로나열
  width: 100%;
  height: auto;
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

const CircularChartLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3em;
  color: black;
`;

const BarChartLabel = styled.div`
  text-align: center;
  font-size: 1.5em;
  margin-top: 20px;
`;

const MonthLabel = styled.div`
  margin-left: 10px;
  font-size: 30px;
  font-weight: bold;
  color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

function Stat() {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수
  const token = window.localStorage.getItem("token"); // 토큰 추가
  const [selectedDate, setSelectedDate] = useState("");
  const [statsData, setStatsData] = useState(null);
  // 이번달과 저번달의 달성률 데이터를 저장할 상태
  const [monthlyAchievement, setMonthlyAchievement] = useState(null);
  // 요일별 달성 갯수 데이터를 저장할 상태
  const [weeklyAchievement, setWeeklyAchievement] = useState(null);
  const [barColors, setBarColors] = useState([]);

  // jwt토큰을 디코딩해서 userid를 가져오는 코드
  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

  const fetchUserData = async () => {
    const userId = getUserIdFromToken(); // 사용자 ID 가져오기
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v1/userInfo/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // 사용자의 테마 정보와 이미지 데이터를 서버로부터 받아옴
      const userThemeName = response.data.userColor; // 사용자 의 테마 이름

      // 사용자의 테마를 상태에 적용
      if (theme[userThemeName]) {
        setCurrentTheme(theme[userThemeName]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // 통계 데이터 가져오기
  const fetchStatsData = async (userId, statsDate) => {
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v4/statsTag/${userId}/${statsDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setStatsData(response.data);
    } catch (error) {
      console.error("Error fetching stats data:", error);
    }
  };

  // 이번달과 저번달의 달성률 데이터를 가져오는 함수
  const fetchMonthlyAchievement = async (userId, statsDate) => {
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v4/statsMonth/${userId}/${statsDate}`,
      );
      setMonthlyAchievement(response.data);
    } catch (error) {
      console.error("Error fetching monthly achievement data:", error);
    }
  };

  const fetchWeeklyAchievement = async (userId, statsDate) => {
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v4/dayWeek/${userId}/${statsDate}`,
      );
      const { data } = response;
      setWeeklyAchievement(data);

      // 요일별 달성률 데이터에서 가장 큰 값을 찾습니다
      const maxVal = Math.max(
        data.WEDdoneTodos,
        data.THUdoneTodos,
        data.FRIdoneTodos,
        data.MONdoneTodos,
        data.TUEdoneTodos,
        data.SATdoneTodos,
        data.SUNdoneTodos,
      );

      // 각 요일에 대한 색상을 설정합니다
      const newBarColors = [
        data.MONdoneTodos,
        data.TUEdoneTodos,
        data.WEDdoneTodos,
        data.THUdoneTodos,
        data.FRIDdoneTodos,
        data.SATdoneTodos,
        data.SUNdoneTodos,
      ].map(val => (val === maxVal ? currentTheme.color1 : "#d3d3d3"));

      // 색상 배열 상태를 업데이트합니다
      setBarColors(newBarColors);
    } catch (error) {
      console.error("Error fetching weekly achievement data:", error);
    }
  };
  // 달력에 년.월.일 나오게 하는 함수
  const formatDate = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // 월은 0부터 시작하므로 1을 더함
    const day = `0${d.getDate()}`.slice(-2);
    return `${year}.${month}`;
  };

  // useEffect 내부에서 두 함수를 호출
  useEffect(() => {
    const userId = getUserIdFromToken(token);
    const statsDate = "2024.03"; // 예시로 사용된 날짜, 실제 사용 시 변경 필요
    fetchStatsData(userId, statsDate);
    fetchMonthlyAchievement(userId, statsDate);
    fetchWeeklyAchievement(userId, statsDate);
  }, [selectedDate]);

  const setDate = date => {
    setSelectedDate(date);
  };

  // 도넛 차트 옵션
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
    ], // 차트 각 섹션별 색상 설정

    // 마우스 호버시 설정
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

  // 도넛 차트 데이터
  const chartSeries = [
    statsData?.Word1stPercent,
    statsData?.Word2stPercent,
    statsData?.Word3stPercent,
    statsData?.Word4stPercent,
    statsData?.etcPercent,
  ];

  // 막대 그래프 옵션
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
        distributed: true, // 막대별로 색상을 다르게 적용
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
    ], // 차트 각 섹션별 색상 설정
  };

  // 막대 그래프 데이터
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

  // 원형 그래프 (달성률) 옵션
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
            show: true, // 중앙에 레이블을 표시합니다.
            label: "이번 달",
            formatter(w) {
              // 첫 번째 시리즈의 값을 이용하여 표시합니다.
              return `${w.globals.series[0]}%`;
            },
            color: currentTheme.color1, // 레이블 색상을 테마 색상으로 설정합니다.
            fontSize: "16px", // 적당한 폰트 크기를 설정합니다.
            fontFamily: undefined,
          },
          value: {
            formatter(val) {
              return `${parseInt(val, 10)}%`; // 여기에 radix 값을 추가합니다.
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

  // 원형 그래프 (달성률) 데이터
  const achievementChartSeries = [
    monthlyAchievement?.thisMonth || 0,
    monthlyAchievement?.prevMonth || 0,
  ];

  // 막대 그래프 (요일별 달성률) 옵션
  const weeklyAchievementChartOptions = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        distributed: true,
        horizontal: false,
        borderRadius: 15, // 막대의 상단을 둥글게
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
    colors: barColors, // 동적으로 할당된 색상 배열 사용
    tooltip: {
      enabled: true,
      y: {
        formatter(val) {
          return `${val} 건`; // 툴팁에 표시할 형식
        },
      },
    },
  };

  // 막대 그래프 (요일별 달성률) 데이터
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
  return (
    <ThemeProvider theme={currentTheme}>
      <NavBar setDate={setDate} />
      <div>
        <MainDiv>
          <DateHeader>노티 분석</DateHeader>
          <FlexContainer>
            <VerticalBox>
              <MonthLabel>{formatDate(selectedDate)} 분석결과</MonthLabel>
              <HorizontalBox>
                <StatsContainer>
                  {/* 조건부 렌더링: statsData가 있을 경우에만 Chart를 렌더링 */}
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
                    // 데이터가 로드되는 중이거나 없을 경우 표시될 메시지
                    <p>데이터를 로드하는 중입니다...</p>
                  )}
                </StatsContainer>
                <StatsContainer>
                  {/* 원형 그래프 (달성률) 렌더링 */}
                  <Chart
                    options={achievementChartOptions}
                    series={achievementChartSeries}
                    type="radialBar"
                    height={280}
                  />

                  {/* 막대 그래프 (요일별 달성률) 렌더링 */}
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
