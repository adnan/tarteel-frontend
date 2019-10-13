import React from 'react';
import { withCookies } from 'react-cookie';
import _ from 'lodash';
import format from 'date-fns/format';
import getHours from 'date-fns/getHours';

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
    console.log(this.formatData(data), 'DATA');

    return (
      <div>
        <Table header={header} data={this.formatData(data)} />
      </div>
    );
  }
}

export default withCookies(Progres);
