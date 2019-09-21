import styled from 'styled-components';

export const Container = styled.div`
  padding: 1em;
  color: #485364;
  @media screen and (max-width: ${props => props.theme.breakpoints.sm}px) {
    padding: 10px;
    overflow-x: hidden;
  }

  footer {
    margin: 5em 0;
    text-align: center;
  }
`;

export const ContentWrapper = styled.div`
  padding: 1em 0;
  width: 75%;
  margin: auto;
  @media screen and (max-width: ${props => props.theme.breakpoints.sm}px) {
    width: 100%;
    margin-bottom: 3em;
    padding: 0;
    p,
    ul {
      width: 90%;
    }
    canvas,
    .canvas-container {
      max-width: 300px;
      margin: auto;
    }
  }
	
  a {
    color: ${props => props.theme.colors.linkColor}
    text-decoration: underline;
  }

	ul {
	  margin-top: 1em;
	}

  h2 {
    margin: 20px 0;
  }
`;

export const CoreTextWrapper = styled.div`
  margin-top: 5em;
  line-height: 22px;
  p {
    margin-top: 1em;
  }
`;

export const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* Player ratio: 100 / (1280 / 720) */
  > div {
    position: absolute;
    top: 0;
    left: 0;
  }
`;
