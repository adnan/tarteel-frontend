import styled from 'styled-components';

interface IPageWrapper {
  isRightPage: boolean;
  isLeftPage: boolean;
  isActivePage: boolean;
}

export const PagesWrapper = styled.div`
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  direction: rtl;
  display: flex;
`;

export const PageWrapper = styled.div<IPageWrapper>`
  display: flex;
  line-height: 1.5;
	flex-direction: column;
  margin-left: ${props => (props.isRightPage ? `15px` : 0)};
	margin-right: ${props => (props.isLeftPage ? `15px` : 0)};
  direction: rtl;
  text-align: center;

  @media only screen and (max-width: ${props => props.theme.breakpoints.sm}px) {
    display: ${props => (props.isActivePage ? 'flex' : 'none')};
  }
`;
