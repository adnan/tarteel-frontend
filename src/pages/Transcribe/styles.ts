import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {transform:rotate(0deg);}
  50% {transform:rotate(180deg);}
  100% {transform:rotate(360deg);}
`;

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ToggleButtonWrapper = styled.div`
  margin-top: 1em;
`;

export const TranslationWrapper = styled.div`
  display: flex;
  flex-flow: column;
  max-width: 750px;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 2em;
`;

export const Container = styled.div`
  display: flex;
  padding: 1em;
  box-sizing: border-box;
  flex-flow: column;
  height: 100%;
  position: relative;
  text-align: center;

  .not-supported {
    margin-top: 5em;
    color: gray;
  }

  h2 {
    margin-bottom: 25px;
    font-weight: normal;
    font-size: 28px;
  }

  .fullscreen {
    display: flex;
    flex: 1;
    flex-flow: column;
    align-items: center;

    .fullscreen-body {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 1em;

      .ayahs-content {
        margin-top: auto;
        margin-bottom: auto;
      }
    }

    a {
      color: ${props => props.theme.colors.linkColor};
    }

    .donate-link {
      margin-bottom: 1em;
      margin-top: 1em;
      color: ${props => props.theme.colors.black};
      &:hover {
        text-decoration: underline;
      }
    }

    .status {
      color: #848484;
      font-size: 18px;
      max-width: 600px;
    }
    .words {
      span {
        font-size: 24px;
      }
    }
    .mic {
      margin: 0;
      color: #fff;

      .spin {
        svg {
          animation: 800ms ${spin} infinite;
          transform-origin: center;
        }
      }
    }
    .iqra {
      position: absolute;
      bottom: 1em;
      right: 0;
    }
  }

  .splittable {
    br {
      display: none;
    }
  }

  .fullscreen-enabled {
    background: white;
    padding: 50px;

    .logo-image {
      display: inherit;
    }
  }
  .header-container {
    width: 100%;
    margin-top: 2em;
    margin-bottom: 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-logo {
    display: inline-block;
    float: left;
    width: 68px;
  }

  .logo-image {
    display: none;
    width: 60px;
  }

  .ayah-number {
    color: #969696;
  }

  .icons-container {
    flex: 1;
  }
  .icon {
    width: 19px;
    float: right;
    filter: brightness(80%);
    cursor: pointer;
    margin-left: 15px;
  }

  .icon:hover {
    filter: brightness(20%);
  }

  .settings-icon {
    width: 21px;
  }

  .ayah-display {
    max-width: 1300px;
    font-size: 36px;
    min-height: 30%;
    display: flex;
    align-items: center;
  }
  .transalations-display {
    max-width: 1300px;
    font-size: 25px;
    min-height: 30%;
    display: flex;
    align-items: center;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.sm}px) {
    .fullscreen {
      .splittable {
        margin-bottom: 15px;
        br {
          display: inherit;
          line-height: 1.6;
        }
      }
    }
    .fullscreen-enabled {
      padding: 10px;
      .logo-image {
        display: none;
      }
    }
  }
`;
