import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import Layout from '../../components/layout';
import { Space } from '../../components/grid';
import URL from '../../assets/constant/url';
import Request from '../../utils/request';

export default function Home() {
  const [list, setList] = useState([]);
  const headers = [
    { label: 'Nickname', key: 'user' },
    { label: 'Score', key: 'score' },
    { label: 'Time Taken', key: 'timeTaken' },
  ];

  useEffect(() => {
    Request.get(URL.RESULT)
      .then((response) => {
        if (response.data.status === 'success') {
          setList(response.data.results);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout>
      <Space top="20px" />
      <h2>Welcome, checkout the latest scores</h2>

      <Space top="30px" />
      <table id="customers">
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Score</th>
            <th>Time Taken</th>
          </tr>
        </thead>
        <tbody>
          {list.map((result, index) => (
            <tr key={index}>
              <td>{result.user}</td>
              <td>{result.score}</td>
              <td>{result.timeTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Space top="20px" />
      <div className="text-right">
        {list.length > 0 && (
          <CSVLink filename="ScoreList.csv" data={list} headers={headers}>
            Export
          </CSVLink>
        )}
      </div>
    </Layout>
  );
}
