import React from 'react';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import format from 'date-fns/format';
import getHours from 'date-fns/getHours';
import Helmet from 'react-helmet';

import { Containr, Body, Title } from './styles';
import withAuth, { AuthType } from '../../hocs/withAuth';
import Navbar from '../../components/Navbar';
import surahs from '../../api/surahs';
import Table from '../../components/Table';
import {
  getSessionsInfo,
  setSessionProgress,
  ISessionData,
} from '../../api/profile';

interface IState {
  loading: boolean;
  data: ISessionData;
}

const header = ['surah', 'ayahs', 'time'];
class Progres extends React.Component {
  state = {
    loading: true,
    data: [],
  };

  formatData = (data: ISessionData) =>
    _.chain(data.results)
      .map(session => ({
        key: session.updated_at,
        surah: surahs[session.surahs[0].surah].latin,
        ayahs: `${_.first(session.ayahs)!.ayah_number} - ${
          _.last(session.ayahs)!.ayah_number
        }`,
        time: `${format(new Date(session.updated_at), 'MM/dd - h:m a')}`,
      }))
      .value();

  async componentDidMount() {
    this.setState({ loading: true }, async () => {
      const res: ISessionData = await getSessionsInfo();
      this.setState({ data: res, loading: false });
    });
  }

  render() {
    const { loading, data } = this.state;
    if (loading) {
      return null;
    }

    return (
      <Containr>
        <Helmet>
          <title>Weekly Progress</title>
        </Helmet>
        <Navbar />

        <Body>
          <Title> Weekly Progress </Title>
          <Table header={header} data={this.formatData(data)} />
        </Body>
      </Containr>
    );
  }
}

export default withAuth(withCookies(Progres), AuthType.PRIVATE);
