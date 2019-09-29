import React from 'react';
import styled from 'styled-components';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';
import { Redirect } from 'react-router';

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

import IRegister from '../shapes/IRegister';
import { register, authAsync } from '../store/actions/auth';
import ReduxState, { IAuth } from '../types/GlobalState';
import Input from './Input';
import FooterButton from './FooterButton';
import NoteButton from './NoteButton';
import FormErrorMessage from './FormErrorMessage';
import KEYS from '../locale/keys';
import T from './T';

interface IOwnProps {
  handleToggle(): void;
}

interface IDispatchProps {
  register(data: IRegister): void;
}

interface IStateProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error;
}

type IProps = IOwnProps & IStateProps & IDispatchProps;

const SigninSchema = Yup.object().shape({
  username: Yup.string().required('Please enter your username!'),
  email: Yup.string()
    .email()
    .required('Please enter your email!'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Please enter password!'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});

function SignupForm(props: IProps) {
  const handleSignUp = async (values: IRegister) => {
    await props.register(values);
  };

  if (props.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
      }}
      onSubmit={handleSignUp}
      validationSchema={SigninSchema}
      render={(formikBag: FormikProps<IRegister>) => {
        const { errors, touched, handleSubmit } = formikBag;
        return (
          <Container>
            <div className="form">
              <Field
                name="username"
                render={({ field, form }: FieldProps<IRegister>) => (
                  <React.Fragment>
                    <Input
                      {...field}
                      type="text"
                      placeholder={'e.g. Mohamed'}
                      label={<T id={KEYS.LOGIN_EMAIL_USERNAME_LABEL} />}
                      debounce={true}
                    />
                  </React.Fragment>
                )}
              />

              {errors.username && touched.username && (
                <FormErrorMessage message={errors.username} />
              )}
              <Field
                name="email"
                render={({ field, form }: FieldProps<IRegister>) => (
                  <React.Fragment>
                    <Input
                      {...field}
                      type="text"
                      placeholder={'e.g. Mohamed@example.com'}
                      label={<T id={KEYS.EMAIL_ADDRESS_INPUT_LABEL} />}
                      debounce={true}
                    />
                  </React.Fragment>
                )}
              />

              {errors.email && touched.email && (
                <FormErrorMessage message={errors.email} />
              )}
              <Field
                name="password"
                render={({ field, form }: FieldProps<IRegister>) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder={'Type your Password'}
                    label={<T id={KEYS.LOGIN_PASSWORD_LABEL} />}
                    debounce={true}
                  />
                )}
              />
              {errors.password && touched.password && (
                <FormErrorMessage message={errors.password} />
              )}
              <Field
                name="confirmPassword"
                render={({ field, form }: FieldProps<IRegister>) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder={'Confirm your password'}
                    label="Confirm Password"
                    debounce={true}
                  />
                )}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <FormErrorMessage message={errors.confirmPassword} />
              )}

              {/*<FormErrorMessage message={this.state.errorMessage} />*/}
              <FooterButton
                className={'submit'}
                isLoading={props.isLoading}
                onClick={handleSubmit}
              >
                <span>
                  <T id={KEYS.SIGNUP_REGISTER_BUTTON} />
                </span>
              </FooterButton>
            </div>

            <NoteButton className={'note-button'} onClick={props.handleToggle}>
              <T id={KEYS.SIGNUP_REGISTER_MESSAGE} />
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
  register: (data: IRegister) => dispatch(register(data)),
});

const mapStateToProps = (state: ReduxState): IStateProps => ({ ...state.auth });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupForm);
