import styled from 'styled-components';

export const BlurBoard = styled.div`
  background: url('${(props) => (props.bgImage ? props.bgImage : '')}') center
    center no-repeat;
  background-size: cover;
  width: 100%;
  min-height: 100vh;

  .blur {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    min-height: 80vh;
    color: #ecf0f1;
    border-radius: 8px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: solid 1px rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
  }

  .hide {
    display: none;
  }

  @media (max-width: 767px) {
    background: #000000;

    .blur {
      min-height: auto;
      position: relative;
      transform: translate(0px, 0px);
      top: 0;
      left: 0;
      width: 100%;
    }
  }
`;

export const DiceImage = styled.img`
  margin: 0 auto;
  display: block;
  user-select: none;
`;

export const ScoreBoard = styled.div`
  h2 {
    font-size: 35px;
  }
  .desc {
    line-height: 1.6rem;
  }
  .score-head {
    font-size: 24px;
    text-align: center;
  }
  .score-point {
    display: inline-block;
    padding: 0px 25px;
    border-radius: 6px;
    background: var(--color-dark);
    font-size: 70px;
    font-weight: 700;
    color: #6ff598;
  }

  @media (max-width: 890px) {
    h2 {
      font-size: 25px;
    }

    .desc {
      font-size: 14px;
    }

    .score-head {
      font-size: 21px;
    }

    .score-point {
      font-size: 55px;
    }
  }
`;

export const Chances = styled.h4`
  color: var(--color-dark);
  margin-top: 15px;
  font-size: 20px;

  @media (max-width: 767px) {
    color: #ffffff;
  }
`;

export const Thanking = styled.h4`
  padding: 25px;
  background: var(--color-dark);
  color: #ffffff;
  margin-top: 15px;
  font-size: 45px;
  text-align: center;
  width: 100%;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);

  .score-total {
    color: var(--color-mango);
  }
`;
