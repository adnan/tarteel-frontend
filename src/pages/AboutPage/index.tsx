import React, { Component } from 'react';
import { History } from 'history';
import ContentLoader from 'react-content-loader';
import Chart from 'chart.js/dist/Chart.bundle.min';
import ReactPlayer from 'react-player';
import humps from 'humps';
import ProgressBar from 'progressbar.js';
import { Helmet } from 'react-helmet';
import { InjectedIntl, injectIntl } from 'react-intl';
import _ from 'lodash';

import AyahsContributedCounter from './AyahsContributedCounter';
import GenderChart from './GenderChart';
import BarChart from './BarChart';
import Team from './Team';
import config from '../../../config';
import { fetchAboutData } from '../../api';
import FooterButton from '../../components/FooterButton';
import Navbar from '../../components/Navbar';
import T from '../../components/T';
import { commaFormatter } from '../../helpers/utils';
import KEYS from '../../locale/keys';
import {
  Container,
  ContentWrapper,
  CoreTextWrapper,
  VideoWrapper,
} from './styles';
import { connect } from 'react-redux';
import ReduxState, { IProfile } from '../../types/GlobalState';

interface IOwnProps {
  intl: InjectedIntl;
  history: History;
}

interface IStateProps {
  profile: IProfile;
}

interface IState {
  data: any;
  loading: boolean;
  error: string;
}

type IProps = IOwnProps & IStateProps;

class About extends Component<IProps, IState> {
  state = {
    loading: true,
    error: '',
    data: {},
  };

  componentDidMount() {
    this.setState(
      {
        loading: true,
        data: {},
        error: '',
      },
      async () => {
        try {
          const data = humps.camelizeKeys(await fetchAboutData());
          this.setState({ data, error: '', loading: false });
        } catch (error) {
          this.setState({
            error:
              'Servers are not available right now! Please email bugs@tarteel.io',
            loading: false,
            data: {},
          });
        }
      }
    );
  }

  renderTheComponent = (component: JSX.Element): JSX.Element => {
    const { loading, data, error } = this.state;
    if (loading) {
      return <div style={{ width: 200, height: 200 }} />;
    }

    if (error) {
      return <CoreTextWrapper>{error}</CoreTextWrapper>;
    }

    return component;
  };

  render() {
    const { intl } = this.props;
    const rtl = intl.messages.local === 'arabic' ? 'rtl' : '';

    return (
      <Container>
        <Helmet>
          <title>
            {this.props.intl.formatMessage({
              id: KEYS.ABOUT_PAGE_TEMPLATE_TITLE,
            })}
          </title>
        </Helmet>
        <Navbar />
        <ContentWrapper>
          {this.renderTheComponent(
            <AyahsContributedCounter
              recitedAyahs={this.state.data.recordingCount}
              recordingCount={this.props.profile.recordingCount}
            />
          )}
          <CoreTextWrapper>
            <h2 className={rtl}>
              <T id={KEYS.ABOUT_PAGE_FIRST_PARAGRAPH_TITLE} />
            </h2>
            <ReactPlayer
              url="https://www.youtube.com/watch?v=GCW_q52RPuE"
              controls={true}
              width="100%"
              height="100%"
              wrapper={VideoWrapper}
            />
            <p className={rtl}>
              <T id={KEYS.ABOUT_PAGE_FIRST_PARAGRAPH_TEXT_1} />
            </p>
            <p className={rtl}>
              <T id={KEYS.ABOUT_PAGE_FIRST_PARAGRAPH_TEXT_2} />
            </p>
            <p className={rtl}>
              <T id={KEYS.ABOUT_PAGE_FIRST_PARAGRAPH_TEXT_3} />
            </p>
          </CoreTextWrapper>
          <CoreTextWrapper>
            <h2 className={rtl}>
              <T id={KEYS.ABOUT_PAGE_SECOND_PARAGRAPH_TITLE} />
            </h2>
            <p className={rtl}>
              <T id={KEYS.ABOUT_PAGE_SECOND_PARAGRAPH_TEXT_1} />
            </p>
            <p className={rtl}>
              <T id={KEYS.ABOUT_PAGE_SECOND_PARAGRAPH_TEXT_2} />
            </p>
            <ul className={rtl}>
              <li>
                <T id={KEYS.FIELDS_OF_USE_FIRST_ITEM} />
              </li>
              <li>
                <T id={KEYS.FIELDS_OF_USE_SECOND_ITEM} />
              </li>
              <li>
                <T id={KEYS.FIELDS_OF_USE_THIRD_ITEM} />
              </li>
            </ul>
          </CoreTextWrapper>
          <CoreTextWrapper>
            <h2 className={rtl}>
              <T id={KEYS.ABOUT_PAGE_THIRD_PARAGRAPH_TITLE} />
            </h2>
            {this.renderTheComponent(
              <GenderChart
                genderLabels={this.state.data.genderLabels}
                genderData={this.state.data.genderData}
              />
            )}
            <p>&nbsp;</p>
            <BarChart
              data={this.state.data.ageData}
              labels={this.state.data.ageLabels}
              text="Reported Age"
              labelString="Number of Users"
            />
            <p>&nbsp;</p>
            {this.renderTheComponent(
              <BarChart
                data={this.state.data.ethnicityData}
                labels={this.state.data.ethnicityLabels}
                text="Reported Ethnic Background"
                labelString="Number of Users"
              />
            )}
            <h2 className={rtl}>
              <T id={KEYS.ABOUT_PAGE_FOURTH_PARAGRAPH_TITLE} />
            </h2>
            <p className={`${rtl} large-arabic-text`}>
              <T id={KEYS.ABOUT_PAGE_FOURTH_PARAGRAPH_TEXT} />
            </p>
            <p>&nbsp;</p>
            {this.renderTheComponent(
              <BarChart
                data={this.state.data.countData}
                labels={this.state.data.countLabels}
                text="How many verses have __ # of recordings"
                labelString="Number of verses"
              />
            )}
          </CoreTextWrapper>
          <CoreTextWrapper>
            <Team />
          </CoreTextWrapper>
          <CoreTextWrapper>
            <h2 className={rtl}>
              <T id={KEYS.ABOUT_PAGE_SEVENTH_PARAGRAPH_TITLE} />
            </h2>
            <p className={`${rtl} large-arabic-text`}>
              <T id={KEYS.ABOUT_PAGE_SEVENTH_PARAGRAPH_TEXT} />
            </p>
          </CoreTextWrapper>
          <CoreTextWrapper>
            <h2 className={rtl}>
              <T id={KEYS.ABOUT_PAGE_LAST_PARAGRAPH_TITLE} />
            </h2>
            <p className={`${rtl} large-arabic-text`}>
              <T id={KEYS.ABOUT_PAGE_LAST_PARAGRAPH_TEXT} />
            </p>
          </CoreTextWrapper>
          <CoreTextWrapper>
            <footer>
              <FooterButton
                onClick={() => {
                  this.props.history.push('/contact');
                }}
              >
                <T id={KEYS.CONTACT_US_BUTTON_TEXT} />
              </FooterButton>
            </footer>
          </CoreTextWrapper>
        </ContentWrapper>
      </Container>
    );
  }
}

const mapStateToProps = (state: ReduxState): IStateProps => {
  return {
    profile: state.profile,
  };
};

export default connect(mapStateToProps)(injectIntl(About));
