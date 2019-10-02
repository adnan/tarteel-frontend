import React from 'react';
import styled from 'styled-components';
import { Auth } from 'aws-amplify';
import { History } from 'history';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';
import { ActionType } from 'typesafe-actions';
import {
  Formik,
  FormikActions,
  FormikProps,
  Form,
  Field,
  FieldProps,
  ErrorMessage,
} from 'formik';
import * as Yup from 'yup';

import theme from '../theme';
import ILogin from '../shapes/ILogin';
import { login, authAsync } from '../store/actions/auth';
import ReduxState, { IAuth } from '../types/GlobalState';
import Input from './Input';
import FooterButton from './FooterButton';
import NoteButton from './NoteButton';
import FormErrorMessage from './FormErrorMessage';
import KEYS from '../locale/keys';
import T from './T';

interface IOwnProps {
  history: History;
}

interface IDispatchProps {
  login(data: ILogin): void;
}

interface IStateProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error;
}

interface ILoginValues {
  username: string;
  password: string;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

const SigninSchema = Yup.object().shape({
  username: Yup.string().required('Please enter your email or username!'),
  password: Yup.string().required('Please enter password!'),
});

function LoginForm(props: IProps) {
  const handleLogin = async (values: ILoginValues) => {
    const { username, password } = values;
    await props.login({
      username,
      password,
    });
  };

  if (props.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={handleLogin}
      validationSchema={SigninSchema}
      render={(formikBag: FormikProps<ILoginValues>) => {
        const { errors, touched, handleSubmit } = formikBag;
        return (
          <Container>
            <div className="form">
              <Field
                name="username"
                render={({ field, form }: FieldProps<ILoginValues>) => (
                  <React.Fragment>
                    <Input
                      {...field}
                      type="text"
                      placeholder={'e.g. Mohamed'}
                      label={<T id={KEYS.LOGIN_EMAIL_USERNAME_LABEL} />}
                      debounce={true}
                      error={
                        errors.username && touched.username
                          ? errors.username
                          : ''
                      }
                    />
                  </React.Fragment>
                )}
              />

              <Field
                name="password"
                render={({ field, form }: FieldProps<ILoginValues>) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder={'Type your Password'}
                    label={<T id={KEYS.LOGIN_PASSWORD_LABEL} />}
                    debounce={true}
                    error={
                      errors.password && touched.password ? errors.password : ''
                    }
                  />
                )}
              />
              {errors.password && touched.password && (
                <FormErrorMessage message={errors.password} />
              )}

              {props.error && (
                <FormErrorMessage message={props.error.message} />
              )}
              <FooterButton
                className={'submit'}
                isLoading={props.isLoading}
                onClick={handleSubmit}
              >
                <span>
                  <T id={KEYS.LOGIN_BUTTON} />
                </span>
              </FooterButton>
            </div>

            <NoteButton className={'note-button'} onClick={props.handleToggle}>
              <T id={KEYS.LOGIN_DONT_HAVE_ACCOUNT} />
            </NoteButton>
            <NoteButton
              className={'note-button'}
              onClick={() => props.history.push('/forgot_password')}
            >
              <T id={KEYS.LOGIN_FORGET_PASSWORD} />
            </NoteButton>
          </Container>
        );
      }}
    />
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-flow: column;

  .form {
    width: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
  }

  .submit {
    margin-top: 1em;
  }

  .note-button {
    font-size: 14px;
    text-decoration: underline;
    color: #485364;
    margin-top: 1em;
  }
`;

const mapDispatchToProps = (dispatch: IDispatchProps) => ({
  login: (data: ILogin) => dispatch(login(data)),
});

const mapStateToProps = (state: ReduxState): IStateProps => ({ ...state.auth });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
