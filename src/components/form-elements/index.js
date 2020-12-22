import styled from 'styled-components';

export const TextInput = styled.input`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0.75rem;
  border-width: 1px;
  border-radius: 0.25rem;
  appearance: none;
  line-height: 1.15;
  border: 1px solid #dae4e9;
  transition: 0.1s ease-in-out;
  font-size: 18px;
  width: 100%;

  :focus {
    border: 1px solid var(--color-mango);
    outline: none;
  }
`;

export const ButtonFilled = styled.button`
  text-align: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 0.7rem 3.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 4px;
  background-color: ${(props) =>
    props.dark ? 'var(--color-dark)' : 'var(--color-mango)'};
  color: ${(props) => (props.dark ? '#ffffff' : 'var(--color-dark)')};
  cursor: pointer;
  width: auto;

  :hover {
    background: ${(props) => (props.dark ? '#131417' : '#f7c54f')};
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 767px) {
    flex-basis: 100%;
  }
`;
