import React from 'react';
import styled from 'styled-components';
import { DebounceInput } from 'react-debounce-input';
import classNames from 'classnames';
import { withCookies } from 'react-cookie';

interface IProps {
  debounce?: boolean;
  label: string;
  type: string;
  error: string;
  [x: string]: any;
}

class Input extends React.Component<IProps, never> {
  render() {
    const {
      cookies,
      label,
      error,
      debounce,
      allCookies,
      ...restProps
    } = this.props;
    const classes = classNames({
      rtl: cookies.get('currentLocale') === 'ar',
    });
    return (
      <Container className={classes}>
        <label>
          {label} {label && ':'}
        </label>
        {debounce ? (
          <DebounceInput
            minLength={0}
            debounceTimeout={300}
            forceNotifyByEnter={true}
            forceNotifyOnBlur={true}
            {...restProps}
          />
        ) : this.props.type !== 'textarea' ? (
          <input {...restProps}  />
        ) : (
          <textarea {...restProps} />
        )}
        <label className="error">{error && error}</label>
      </Container>
    );
  }
}

const Container = styled.div`
  margin-bottom: 1em;
  &.rtl {
    direction: rtl;
  }

  label {
    margin-left: 5px;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .error {
    color: ${props => props.theme.colors.errorColor};
  }
  input,
  textarea {
    height: 38px !important;
    border-radius: 5px;
    border: 1px solid rgb(204, 204, 204) !important;
    display: block;
    padding: 5px 10px !important;
    width: 300px;
    font-size: 14px;

    &:hover {
      border: 2px solid ${props => props.theme.colors.linkColor};
    }
    &:focus {
      border: 2px solid ${props => props.theme.colors.linkColor};
    }
  }

  textarea {
    height: auto;
    padding: 10px;
  }
`;

export default withCookies(Input);
