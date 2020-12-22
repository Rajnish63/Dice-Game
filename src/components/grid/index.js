import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const Col = styled.div`
  flex-basis: 50%;

  @media (max-width: 767px) {
    flex-basis: 100%;
  }
`;

export const Space = styled.div`
  margin-top: ${(props) => (props.top ? props.top : '0px')};
  margin-left: ${(props) => (props.left ? props.left : '0px')};
  margin-bottom: ${(props) => (props.bottom ? props.bottom : '0px')};
  margin-right: ${(props) => (props.right ? props.right : '0px')};
`;
