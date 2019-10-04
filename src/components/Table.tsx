import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';

const TableWrapper = styled.table`
  text-align: center;
  border: none;
  border-spacing: 0;
  width: 100%;

  td,
  th {
    border: none;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  tr:hover {
    background-color: #ddd;
  }

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: center;
    background-color: ${props => props.theme.colors.linkColor};
    color: white;
  }
`;

//const j;

interface ITableData {
  [key: string]: string | number | React.ReactElement<any>;
  key: string | number;
}

interface IProps {
  header: string[];
  data: ITableData[];
}

export default function Table(props: IProps) {
  const { header, data } = props;

  return (
    <TableWrapper>
      <tbody>
        <tr>
          {header.map((key, index) => (
            <th key={index}>{key.toUpperCase()}</th>
          ))}
        </tr>

        {data.map(row => (
          <tr key={row.key}>
            {/* exclude the key prop from the table */}
            {_.map(_.omit(row, 'key'), (value, ...rest) => {
              console.log(value, 'ROW');

              return <td key={Math.random()}>{value}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </TableWrapper>
  );
}
