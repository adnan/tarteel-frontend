import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const CounterWrapper = styled.div`
  margin-top: 5em;
  margin-bottom: 2em;
  width: 200px;
  height: 200px;
  position: relative;
`;

export const CounterText = styled.div`
  position: absolute;
  top: 64%;
  left: 50%;
  min-width: 125px;
  transform: translateX(-50%);
  font-weight: bold;
  color: #7a7e7b;
`;
