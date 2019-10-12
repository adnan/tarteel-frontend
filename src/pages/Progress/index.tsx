import React from 'react';

import Table from '../../components/Table';

export default function Progress() {
  const header = ['surah', 'ayahs', 'time'];
  const data = [
    { key: 1, surah: 'Al-Najm', ayahs: '1 - 20', time: new Date().toString() },
    { key: 2, surah: 'Al-Najm', ayahs: '1 - 20', time: new Date().toString() },
    { key: 3, surah: 'Al-Najm', ayahs: '1 - 20', time: new Date().toString() },
    { key: 4, surah: 'Al-Najm', ayahs: '1 - 20', time: new Date().toString() },
    { key: 5, surah: 'Al-Najm', ayahs: '1 - 20', time: new Date().toString() },
  ];

  return (
    <div>
      <Table header={header} data={data} />
    </div>
  );
}
