import { Icon } from 'react-icons-kit';
import styled from 'styled-components';

export const TeamWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  grid-gap: 2em;
	margin-top: 3em;
`;

export const MemberCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const MemberCardImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 10px;
  object-fit: cover;
  object-position: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

export const MemberCardName = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

export const MemberCardPosition = styled.span`
  font-size: 14px;
`;

export const SocialMediaIconsWrapper = styled.div`
  display: flex;
`;

export const StyledIcon = styled(Icon).attrs({
  size: 24,
})`
  margin: 10px 8px;
`;
