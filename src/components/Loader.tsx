
import React from 'react';
import styled, { keyframes } from 'styled-components';


export default function Loader() {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="box1" />
        <div className="box2" />
        <div className="box3" />
      </div>
    </StyledWrapper>
  );
}

const animate = keyframes`
  to {
    stroke-dashoffset: -100;
  }
`;

const StyledWrapper = styled.div`
 position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: liquid-glass;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Opsional: agar selalu di atas konten lain */

  .loader {
    width: 112px;
    height: 112px;
  }

  .box1,
  .box2,
  .box3 {
    border: 16px solid #f5f5f5;
    box-sizing: border-box;
    position: absolute;
    display: block;
  }

  .box1 {
    width: 112px;
    height: 48px;
    margin-top: 64px;
    margin-left: 0px;
    animation: abox1 4s 1s forwards ease-in-out infinite;
  }

  .box2 {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 0px;
    animation: abox2 4s 1s forwards ease-in-out infinite;
  }

  .box3 {
    width: 48px;
    height: 48px;
    margin-top: 0px;
    margin-left: 64px;
    animation: abox3 4s 1s forwards ease-in-out infinite;
  }

  @keyframes abox1 {
    0% {
      width: 112px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    12.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    25% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    37.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    50% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    62.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }

    75% {
      width: 48px;
      height: 112px;
      margin-top: 0px;
      margin-left: 0px;
    }

    87.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    100% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }
  }

  @keyframes abox2 {
    0% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    12.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    25% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    37.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    50% {
      width: 112px;
      height: 48px;
      margin-top: 0px;
      margin-left: 0px;
    }

    62.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    75% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    87.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    100% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }
  }

  @keyframes abox3 {
    0% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    12.5% {
      width: 48px;
      height: 48px;
      margin-top: 0px;
      margin-left: 64px;
    }

    25% {
      width: 48px;
      height: 112px;
      margin-top: 0px;
      margin-left: 64px;
    }

    37.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    50% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    62.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    75% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    87.5% {
      width: 48px;
      height: 48px;
      margin-top: 64px;
      margin-left: 64px;
    }

    100% {
      width: 112px;
      height: 48px;
      margin-top: 64px;
      margin-left: 0px;
    }
  }`;
