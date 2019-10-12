import React from 'react';
import T from '../../components/T';
import KEYS from '../../locale/keys';
import { Container, ContentWrapper } from './styles';

class Privacy extends React.Component {
  public render() {
    return (
      <Container>
        <ContentWrapper>
        <h1>
          <T id={KEYS.PRIVACY_POLICY_PAGE_TITLE} />
        </h1>
        <T id={KEYS.PRIVACY_POLICY_PAGE_PARAGRAPH} />
        <br /><br />
        <h1>
          <T id={KEYS.PRIVACY_POLICY_COOKIE_POLICY_TITLE} />
        </h1>
        <T id={KEYS.PRIVACY_POLICY_COOKIE_POLICY_PARAGRAPH} />
        </ContentWrapper>
      </Container>
    );
  }
}

export default Privacy;
