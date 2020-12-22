import styled from 'styled-components';

export const Welcome = styled.h1`
  font-family: 'Ubuntu', sans-serif;
  color: var(--color-dark);
  font-size: 39px;

  @media (max-width: 1024px) {
    font-size: 30px;
  }

  @media (max-width: 767px) {
    text-align: center;
  }

  @media (max-width: 425px) {
    font-size: 26px;
  }
`;
