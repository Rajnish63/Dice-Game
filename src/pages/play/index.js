import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import URL from '../../assets/constant/url';
import Request from '../../utils/request';
import IMAGES from '../../assets/images';
import { Col, Row, Space } from '../../components/grid';
import { ButtonFilled } from '../../components/form-elements';
import { BlurBoard, DiceImage, ScoreBoard, Chances, Thanking } from './style';

const Play = () => {
  const [chance, setChance] = useState(0);
  const [score, setScore] = useState(0);
  const [currentDice, setCurrentDice] = useState(0);
  const [user, setUser] = useState('');
  const history = useHistory();

  const startTime = new Date();
  const diceMap = [
    IMAGES.dice1,
    IMAGES.dice2,
    IMAGES.dice3,
    IMAGES.dice4,
    IMAGES.dice5,
    IMAGES.dice6,
  ];

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('user'));
    setUser(userDetails.name);
  }, []);

  const rollDice = () => {
    const newChance = chance + 1;
    setChance(newChance);
    if (newChance > 3) {
      Request.post(URL.RESULT, {
        score,
        timeTaken: new Date().getTime() - startTime.getTime(),
      });
    }
    const value = Math.floor(Math.random() * 6 + 1);
    setCurrentDice(value - 1);
    setScore(score + value);
  };

  const leave = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    history.push('/');
  };

  return (
    <BlurBoard bgImage={IMAGES.chest}>
      <div className="blur">
        <Row className={chance > 3 ? 'hide' : 'show'}>
          <Col>
            <DiceImage src={diceMap[currentDice]} alt="dice" width="40%" />
            <Space top="100px" />
            <div className="text-center">
              <ButtonFilled onClick={rollDice} dark={true}>
                {chance < 3 ? 'Random' : 'Submit'}
              </ButtonFilled>
              <Chances>Chances: {chance}/3</Chances>
            </div>
          </Col>
          <Col>
            <ScoreBoard>
              <h2>Hey {user}!</h2>
              <Space top="30px" />
              <p className="desc">
                You get three chances to roll the dice 🎲. At the end of the
                challange your score is calculated by summing up all the
                results. Keep track of your score below and 🎉best of luck 🎉.
              </p>
              <Space top="80px" />
              <p className="score-head">Your Score</p>
              <Space top="20px" />
              <div className="text-center">
                <p className="score-point">{score}</p>
                <Space top="20px" />
                <ButtonFilled onClick={leave} dark={true}>
                  Leave
                </ButtonFilled>
              </div>
            </ScoreBoard>
          </Col>
        </Row>
        <Thanking className={chance <= 3 ? 'hide' : 'show'}>
          Thank You for playing!
          <br /> You have scored <span className="score-total">{score}</span>
          &nbsp;points
        </Thanking>
      </div>
    </BlurBoard>
  );
};

export default Play;
