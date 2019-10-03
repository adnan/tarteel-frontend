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
  `;

export const NormalWordWrapper = styled(BaseWordWrapper)``;

export const MemoWordWrapper = styled(BaseWordWrapper)<IMemoWordWrapper>`
  position: relative;
  transition: color 1.5s cubic-bezier(0.25, 1, 0.1, 1);
  &::before {
    content: '';
    display: block;
    top: 50%;
    left: 0;
    right: 0;
    position: absolute;
    height: 1px;
    transition: background 0.3s;
    width: 100%;
    background: ${({ isActive, isAyahNumber }) =>
      !isActive && !isAyahNumber ? colors.textMuted : `none`};
  }
  margin: 0 2px;
`;
