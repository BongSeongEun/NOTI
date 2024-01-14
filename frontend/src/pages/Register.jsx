/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React from "react";
import styled from "styled-components";
import NOTI from '../asset/KakaoTalk_20240105_025742662.png';

const MainDiv = styled.div` //전체화면 테두리
    display: flex;
    flex-basis: auto;
    flex-direction: row; // 가로 나열
    align-items: center; // 가운데 놓기
    justify-content: center; // 가운데 놓기
    width: 100%;
    background-color: #Ffffff;
    height: 100vh;
`;

const LogoDiv = styled.div` // 로고쪽 큰 박스
    border: 1px solid black; // 테두리 박스
    height: 100%;
    width: 50%; // 가로 50%
    display: flex; // 전체 체우기?
    flex-direction: column; // column : 세로 (row : 가로)
    align-items: center; 
    justify-content: center;
`;

const MainLogo = styled.img` //토끼로고
    width: 300px;
    height: 400px;

`;

const RegDiv = styled.div` //회원가입 제일큰 박스
    border: 1px solid red; // 테두리 박스
    height: 100vh;
    width: 50%; // 가로 50%
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column; // 내용 세로나열
`;

const RegBox = styled.div` //회원가입 회색 큰 박스
    border: 3px solid #B7BABF;
    width: 350px;
    height: 400px;
    padding: 1.2rem;
    background-color: #F9F9F9;
    border-radius: 20px; //모서리 둥글게
    display: flex; // 정렬하려면 이거 먼저 써야함
    align-items: center; // 수직 가운데 정렬
    flex-direction: column; // 내용 세로나열
`;

const MainTextBox = styled.div` // 큰 텍스트 박스
    // border: 1px solid blue;
    letter-spacing: 1px;
    color: #000000;
    text-align: center;
    font-size: 20px;
    width: 100%;
    height: 30px;
    font-weight: normal;
`;

const HorizontalBox = styled.div` // 아이템을 가로정렬하는 상자
    display: flex; // 정렬하려면 이거 먼저 써야함
    flex-direction: row; // 가로나열
    justify-content: center; // 가운데 정렬
    width: 100%;
    height: auto;
`;

const VerticalBox = styled.div` // 아이템을 세로정렬하는 상자
    display: flex; // 정렬하려면 이거 먼저 써야함
    align-items: center; // 수직 가운데 정렬
    flex-direction: column; // 세로나열
    width: 100%;
    height: auto;
`;

const SubTextBox = styled.div` // 소제목 textBox
    letter-spacing: 1px;
    color: #000000;
    width: 100%;
    height: 30px;
`;


const RegBtn = styled.button` // 가입하기 버튼
    width: 250px;
    height: 30px;
    border-radius: 40px; // 모서리 둥굴게
    background-color: #000000;
    color: #FFFFFF;
    font-size: 12px; // 글씨크기
    font-weight: bold;
    letter-spacing: 1px; // 글자사이 간격
     // transition: transform 80ms ease-in; // 부드럽게 전환
    text-align: center; // 텍스트 가운데 정렬
`;

const InputBox = styled.input` // 수정불가능한 input box
    border-radius: 30px; // 모서리 둥굴게
    background-color: #E3E4E6;
    color: #505050;
    font-size: 10px;
    text-align: center;
`;

const InputBox2 = styled.input` // 사용자에게 입력받는 input box
    width: 250px;
    height: 30px;
    border-radius: 30px; // 모서리 둥굴게
    background-color: #f2f3f5;
    color: #000000;
    font-size: 10px;
    text-align: center;
`;

const Button2 = styled.button`
  height: 30px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border-radius: 3px;  
`;

function Register () {  
    return(
    <div>
        <MainDiv>
            <LogoDiv>
                <MainLogo src={NOTI} alt="로고" />
                <MainTextBox style={{fontSize : '30px'}}>노티와 대화하며 하루를 만들어보세요</MainTextBox>
            </LogoDiv>
            <RegDiv>
                <RegBox>
                    <MainTextBox>가입을 축하드려요!</MainTextBox>
                    <MainTextBox>프로필을 등록해보세요</MainTextBox>
                    <HorizontalBox> 
                        사진
                        <VerticalBox> 
                            <SubTextBox>이름</SubTextBox>
                            <SubTextBox>닉네임*</SubTextBox>
                            <div id="info__id">
                            <input type="text" placeholder="닉네임 입력(6~20자)"/>
                            <Button2>중복 확인</Button2>
                            </div>
                        </VerticalBox>
                    </HorizontalBox>
                    <VerticalBox>
                        <SubTextBox>이메일</SubTextBox>
                        <SubTextBox>방해금지 시간 설정</SubTextBox>
                        <SubTextBox>일기 생성 시간 설정*</SubTextBox>
                    </VerticalBox>
                    <RegBtn> 가입하기</RegBtn>
                </RegBox>
            </RegDiv>
        </MainDiv>
    </div>
    ) 

}
export default Register;