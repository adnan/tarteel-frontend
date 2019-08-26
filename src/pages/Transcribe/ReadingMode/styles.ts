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
  margin-left: ${props => (props.isRightPage ? `.4em` : 0)};
  margin-right: ${props => (props.isLeftPage ? `.4em` : 0)};
  direction: rtl;
  text-align: justify;
  flex: 1;
  flex-wrap: wrap;
  max-width: 25em;
  justify-content: space-evenly;

  @media only screen and (max-width: ${props => props.theme.breakpoints.sm}px) {
    display: ${props => (props.isActivePage ? 'flex' : 'none')};
  }

  &:after {
    content: '';
    flex: auto;
  }
`;
