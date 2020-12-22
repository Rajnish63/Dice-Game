import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Layout from '../../components/layout';
import { Row, Col, Space } from '../../components/grid';
import { TextInput, ButtonFilled } from '../../components/form-elements';
import { Welcome } from './style';
import IMAGES from '../../assets/images';
import URL from '../../assets/constant/url';
import Request from '../../utils/request';

export default function Home() {
  const history = useHistory();
  const [authError, setAuthError] = useState('');
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    let user = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      history.push(user.role === 'player' ? '/play' : '/dashboard');
    }
  }, [history]);

  const onSubmit = (data) => {
    Request.post(URL.LOGIN, data)
      .then((response) => {
        const result = response.data;
        if (result.status === 'success') {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          history.push(result.role === 'player' ? '/play' : '/dashboard');
        } else {
          setAuthError(result.message ?? 'Unexpected error occurred');
        }
      })
      .catch(() => {
        setAuthError('Unexpected error occurred');
      });
  };

  return (
    <Layout>
      <Row>
        <Col>
          <Space top="15px" />
          <h3>Dice Game</h3>
          <Space top="62px" />
          <Welcome>
            Welcome to the dice game
            <br /> Start your journey by logging in
          </Welcome>
          <Space top="60px" />

          {authError !== '' && <span className="err-inp">{authError}</span>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              name="username"
              placeholder="Enter your Username"
              ref={register({ required: true, maxLength: 200 })}
            />
            {errors.username && errors.username.type === 'required' && (
              <span className="err-inp">This field is required</span>
            )}
            {errors.username && errors.username.type === 'maxLength' && (
              <span className="err-inp">Max 200 charachters are allowed</span>
            )}
            <Space top="21px" />
            <TextInput
              name="password"
              placeholder="Enter your password"
              type="password"
              ref={register({ required: true, maxLength: 32, minLength: 6 })}
            />
            {errors.password && errors.password.type === 'required' && (
              <span className="err-inp">This field is required</span>
            )}
            {errors.password && errors.password.type === 'maxLength' && (
              <span className="err-inp">Max 32 charachters are allowed</span>
            )}
            {errors.password && errors.password.type === 'minLength' && (
              <span className="err-inp">Min 6 charachters are allowed</span>
            )}
            <Space top="21px" />
            <TextInput
              name="nickname"
              placeholder="Enter your nickname"
              ref={register({ required: true, maxLength: 200 })}
            />
            {errors.nickname && errors.nickname.type === 'required' && (
              <span className="err-inp">This field is required</span>
            )}
            {errors.nickname && errors.nickname.type === 'maxLength' && (
              <span className="err-inp">Max 200 charachters are allowed</span>
            )}
            <Space top="21px" />
            <div className="text-right">
              <ButtonFilled type="submit">Log in</ButtonFilled>
            </div>
          </form>
        </Col>
        <Col>
          <img
            className="hide-sm"
            width="100%"
            src={IMAGES.startUp}
            alt="big-dice"
          />
        </Col>
      </Row>
      <Space top="50px" />
    </Layout>
  );
}
