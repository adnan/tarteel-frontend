import styled from 'styled-components';

export const Title = styled.h3`
  margin-bottom: 10px;
	color: ${props => props.theme.colors.gray};
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2em;
`;

export const Containr = styled.div`
  display: flex;
  padding: 1em;
  box-sizing: border-box;
  flex-flow: column;
  height: 100%;
`;

