import styled, { keyframes, css } from 'styled-components';

interface IControlsWrapper {
  alignmentPosition: string;
}

interface IContainer {
  width: number;
}

export const videoModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    border: 'none',
    background: 'none',
    position: 'relative',
    padding: 0,
    borderRadius: 0,
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    width: '80vw',
    height: 'auto',
    overflow: 'hidden',
    maxHeight: 476,
    maxWidth: 824
  },
};

const spin = keyframes`
  0% {transform:rotate(0deg);}
  50% {transform:rotate(180deg);}
  100% {transform:rotate(360deg);}
`;

export const FooterWrapper = styled.div`
  position: relative;
`;

export const ControlsWrapper = styled.div<IControlsWrapper>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  ${props =>
    props.alignmentPosition === 'left' &&
    css`
      align-items: flex-start;
    `}
`;

export const ToggleButtonWrapper = styled.div`
  margin-top: 1.5em;
`;

export const TranslationWrapper = styled.div`
  display: flex;
  flex-flow: column;
  max-width: 750px;
  justify-content: space-between;
  margin: 0 auto;
  margin-top: 80px;
  color: grey;
  font-size: 20px;
`;

export const TranslationModeWrapper = styled.div`
  display: flex;
  direction: rtl;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
  max-width: 750px;
  margin: 0 auto;
`;

export const Container = styled.div<IContainer>`
  display: flex;
  padding: 1em;
  box-sizing: border-box;
  flex-flow: column;
  height: 100%;
  text-align: center;

  .not-supported {
    margin-top: 5em;
    color: gray;
  }

  .intro-message > .demo-video-link {
    color: inherit;
    text-decoration: underline;

   &:hover{
      cursor: pointer;
    }
  }

  h2 {
    margin-bottom: 25px;
    font-weight: normal;
    font-size: 28px;
  }

  .partial-query {
    font-size: 24px;
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
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .surah-wrapper {
        font-size: calc(1vmin + ${props => Math.abs(props.width) * 0.05}px);
        @media screen and (min-width: ${props =>
            props.theme.breakpoints.md}px) {
          font-size: calc(1vmin + ${props => Math.abs(props.width) * 0.02}px);
        }
        @media screen and (min-width: ${props =>
            props.theme.breakpoints.lg}px) {
          font-size: calc(2vmin + ${props => Math.abs(props.width) * 0.01}px);
        }
      }
    }

    a {
      color: ${props => props.theme.colors.linkColor};
    }

    .footer-text {
      font-size: 14px;
      padding: 10px 0;
      @media screen and (min-width: ${props => props.theme.breakpoints.md}px) {
        //TODO: move the FooterWrapper to be on the same vertical position as .footer-text
        align-self: flex-end;
        position: absolute;
        padding-bottom: 3px;
        right: 0;
        bottom: 0;
        transform: translateY(-50%);
      }
      a {
        text-decoration: underline;
        color: inherit;
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
      box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
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

    .header-container {
      margin-top: 0;
    }
  }
  .header-container {
    width: 100%;
    margin-top: 18px;
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

  .ayah-info {
    padding-top: 17px;
    color: ${props => props.theme.colors.textColor};
  }

  .surah-name {
    color: ${props => props.theme.colors.black};
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
    color: #d2d2d2;
  }

  .icon:hover {
    filter: brightness(20%);
  }

  .intro-message {
    font-size: 18px;
    text-align: center;
    width: 100%;
    margin-bottom: 20px;
    max-width: 600px;
    margin: auto;
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
    .ayahs-content {
      margin-top: 0 !importent;
    }

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
