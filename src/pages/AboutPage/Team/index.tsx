import React from 'react';
import { facebookOfficial } from 'react-icons-kit/fa/facebookOfficial';
import { linkedinSquare } from 'react-icons-kit/fa/linkedinSquare';
import { InjectedIntl, injectIntl } from 'react-intl';

import {
  TeamWrapper,
  MemberCardWrapper,
  MemberCardName,
  MemberCardImage,
  MemberCardPosition,
  StyledIcon,
  SocialMediaIconsWrapper,
} from './styles';
import KEYS from '../../../locale/keys';
import T from '../../../components/T';
import teamData from './data';

interface IProps {
  intl: InjectedIntl;
}

function Team({ intl }: IProps) {
  const rtl = intl.messages.local === 'arabic' ? 'rtl' : '';

  return (
    <React.Fragment>
      <h2 className={rtl}>
        <T id={KEYS.ABOUT_PAGE_FIFTH_PARAGRAPH_TITLE} />
      </h2>
      <TeamWrapper className={rtl}>
        {teamData.map(
          ({ nameKey, positionKey, facebookURL, linkedinURL, imageSrc }) => (
            <MemberCardWrapper key={nameKey}>
              <MemberCardImage src={imageSrc} />
              <MemberCardName>
                <T id={nameKey} />
              </MemberCardName>
              <MemberCardPosition>
                <T id={positionKey} />
              </MemberCardPosition>
              <SocialMediaIconsWrapper>
                {facebookURL && (
                  <a target='__blank'  href={facebookURL}>
                    <StyledIcon icon={facebookOfficial} />
                  </a>
                )}
                {linkedinURL && (
                  <a target='__blank' href={linkedinURL}>
                    <StyledIcon icon={linkedinSquare} />
                  </a>
                )}
              </SocialMediaIconsWrapper>
            </MemberCardWrapper>
          )
        )}
      </TeamWrapper>
    </React.Fragment>
  );
}

export default injectIntl(Team)
