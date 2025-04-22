import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// 파이 조각 색상 배열
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE"];
const RADIAN = Math.PI / 180;

// 커스텀 라벨 렌더링 함수: 퍼센트(%) 표시
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

const PredictionChart = ({ data, height = 250 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={40}
        outerRadius={height / 2 - 20}
        label={renderCustomizedLabel}
        labelLine={false}
      >
        {data.map((_, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(val) => `${val.toFixed(2)}%`} />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </ResponsiveContainer>
);

export default PredictionChart;

