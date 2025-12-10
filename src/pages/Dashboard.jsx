import React, { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PIE_COLORS = ['#EF4444', '#F97316', '#EAB308', '#4ADE80', '#22D3EE', '#EC4899', '#3B82F6', '#8B5CF6'];

// 원형 차트 아이템 (범례...)
const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <ul style={{ paddingTop: '10px', margin: 0, listStyle: 'none', color: '#ddd' }}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{ margin: '0 10px', cursor: 'default' }}>
          <span style={{ display: 'inline-block', width: 14, height: 14, backgroundColor: entry.color || PIE_COLORS[ index % PIE_COLORS.length], marginRight: 8 }} />
          <span style={{ verticalAlign: 'middle' }}>
          {entry.value} ({entry.payload ? entry.payload.count : 0})
          </span>
        </li>
      ))}
    </ul>
  );
};

// 일자 차트 아이템 (범례...)
const renderCustomLegend = (props) => {
  const { payload } = props;
  return (
    <ul style={{ paddingTop: '10px', listStyle: 'none', margin: 0, textAlign: 'center'}}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{ color: '#ddd', marginBottom: 4, cursor: 'pointer', fontWeight: 'bold' }}>
          <span style={{ display: 'inline-block', width: 14, height: 14, backgroundColor: entry.color, marginRight: 8 }}></span>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export default function Dashboard() {
  const [dailyErrorCounts, setDailyErrorCounts] = useState([]);
  const [errorLevelCounts, setErrorLevelCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date();
        const endDate = today.toISOString().slice(0,10);
        const startDateObj = new Date();
        startDateObj.setDate(today.getDate() - 7);
        const startDate = startDateObj.toISOString().slice(0,10);

        const dailyRes = await axios.get('/dashboard/daily-error-counts', {
          params: { startDate: `${startDate}T00:00:00`, endDate: `${endDate}T23:59:59` }
        });
        setDailyErrorCounts(dailyRes.data);

        const levelRes = await axios.get('/dashboard/error-level-counts', {
          params: { startDate: `${startDate}T00:00:00`, endDate: `${endDate}T23:59:59` }
        });
        setErrorLevelCounts(levelRes.data);

        setLoading(false);
      } catch (e) {
        console.error(e);
        setError('데이터 로드 중 에러가 발생했습니다.');
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-white p-6">로딩 중...</div>
  }

  if (error) {
    return <div className="text-red-500 p-6">{error}</div>
  }

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

      <div className="bg-[#1A1C21] rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">일별 에러 발생 추이 (최근 7일)</h2>
        {dailyErrorCounts.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={dailyErrorCounts}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" /> {/* 그리드 색상 변경 */}
              <XAxis dataKey="date" stroke="#999" /> {/* x축 텍스트 색상 변경 */}
              <YAxis allowDecimals={false} stroke="#999" /> {/* y축 텍스트 색상 변경 */}
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} itemStyle={{ color: '#fff' }} /> {/* 툴팁 배경, 글씨 색상 변경 */}
              <Legend content={renderCustomLegend } /> {/* 범례 글씨 색상 변경 */}
              <Bar dataKey="count" fill="#161494ff" name="에러 발생 건수" /> {/* 바 그래프: 에러 건수 */}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">최근 7일간 에러 데이터가 없습니다.</p>
        )}
      </div>

      <div className="bg-[#1A1C21] rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">에러 레벨별 통계 (최근 7일)</h2>
        {errorLevelCounts.length > 0 ? (
          <ResponsiveContainer width="100%" height={410}>
            <PieChart>
              <Pie
                data={errorLevelCounts}
                dataKey="count" // 값: DTO의 count 필드
                nameKey="level" // 각 조각의 이름: DTO의 level 필드
                cx="50%" // 차트의 중심 x 좌표
                cy="50%" // 차트의 중심 y 좌표
                outerRadius={100} // 파이 차트의 바깥쪽 반지름 (크기)
                fill="#8884d8" // 기본 채우기 색상 (아래 Cell에서 각 조각 색상으로 덮어씌워짐)
                label={({ name, count, percent }) => ` ${name}: ${count}건 (${(percent * 100).toFixed(0)}%)`} // 라벨 내용 (레벨과 퍼센트)
                // 라벨 텍스트 색상 및 위치 조정
                labelLine={false} // 라벨과 파이 조각을 연결하는 선을 그릴지 여부
                // label={({ percent }) => `${(percent * 100).toFixed(0)}%`} // 각 조각에 퍼센트 라벨 표시
              >
                {/* 각 레벨(WARN, ERROR 등)에 PIE_COLORS 배열에서 색상 적용 */}
                {errorLevelCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              {/* 툴팁: 마우스 올렸을 때 정보 표시 */}
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} itemStyle={{ color: '#FFD700' }} />
              {/* 범례: 각 색상이 어떤 레벨을 의미하는지 표시 */}
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">최근 7일간 에러 레벨별 데이터가 없습니다.</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-6 rounded-xl bg-[#1A1C21]">Card 1</div>
        <div className="p-6 rounded-xl bg-[#1A1C21]">Card 2</div>
        <div className="p-6 rounded-xl bg-[#1A1C21]">Card 3</div>
      </div>
    </div>
  );
}