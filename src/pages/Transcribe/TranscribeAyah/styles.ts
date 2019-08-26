import Styled from 'styled-components';

import { colors } from '../../../theme';

interface IWordProps {
  color: string;
}

export const WordWrapper = Styled.span`
	color: ${(props: IWordProps) => (props.color ? props.color : colors.black)};
  font-size: 20px;
  @media only screen and (min-width: ${props => props.theme.breakpoints.lg}px) {
    font-size: 22px;
  }
`;
