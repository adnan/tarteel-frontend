import styled, { css } from 'styled-components';

import { colors } from '../../../theme';

interface IBaseWordWrapperProps {
  color: string;
}

interface IMemoWordWrapper {
  isAyahNumber: boolean;
  isActive: boolean;
}

const BaseWordWrapper = styled.span<IBaseWordWrapperProps>`
  color: ${props => props.color};
  user-select: none;
  font-size: 20px;
  @media only screen and (min-width: ${props => props.theme.breakpoints.lg}px) {
    font-size: 22px;
  }
`;

export const NormalWordWrapper = styled(BaseWordWrapper)``;

export const MemoWordWrapper = styled(BaseWordWrapper)<IMemoWordWrapper>`
  transition: color 1.5s cubic-bezier(0.25, 1, 0.1, 1);
  text-decoration: ${({ isActive, isAyahNumber }) =>
    !isActive && !isAyahNumber ? 'line-through' : 'none'};
  text-decoration-color: ${colors.textMuted};
  padding: 0 2px;
`;
