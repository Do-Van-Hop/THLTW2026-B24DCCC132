import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Timeline, Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import { getData, STORAGE_KEYS } from '../utils/storage';

const Dashboard: React.FC = () => {
  const workouts = getData(STORAGE_KEYS.WORKOUTS);
  const health = getData(STORAGE_KEYS.HEALTH);
  const goals = getData(STORAGE_KEYS.GOALS);

  const stats = useMemo(() => {
    const now = moment();
    const monthlyWorkouts = workouts.filter((w: any) =>
      moment(w.date).isSame(now, 'month')
    );
    const totalCalories = monthlyWorkouts.reduce(
      (sum: number, w: any) => sum + (w.calories || 0), 0
    );

    let streak = 0;
    const current = moment().startOf('day');
    while (workouts.find((w: any) => moment(w.date).isSame(current, 'day'))) {
      streak++;
      current.subtract(1, 'day');
    }

    const activeGoal = goals.find((g: any) => g.status === 'active');
    let progress = 0;
    if (activeGoal) progress = (activeGoal.current / activeGoal.target) * 100;
    else if (goals.length) progress = (goals[0].current / goals[0].target) * 100;

    return {
      totalWorkouts: monthlyWorkouts.length,
      totalCalories,
      streak,
      progress: Math.min(progress, 100).toFixed(0),
    };
  }, [workouts, goals]);

  const weeklyChartOptions = useMemo(() => {
    const now = moment();
    const startMonth = now.clone().startOf('month');
    const endMonth = now.clone().endOf('month');
    const weeksMap = new Map();

    const week = startMonth.clone().startOf('week');
    while (week.isBefore(endMonth)) {
      const key = week.format('[Tuần] W');
      weeksMap.set(key, 0);
      week.add(1, 'week');
    }

    workouts.forEach((w: any) => {
      const date = moment(w.date);
      if (date.isBetween(startMonth, endMonth, null, '[]')) {
        const key = date.format('[Tuần] W');
        if (weeksMap.has(key)) weeksMap.set(key, weeksMap.get(key) + 1);
      }
    });

    const categories = Array.from(weeksMap.keys());
    const values = Array.from(weeksMap.values());

    return {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: categories, name: 'Tuần' },
      yAxis: { type: 'value', name: 'Số buổi tập' },
      series: [{ type: 'bar', data: values, itemStyle: { color: '#8884d8' } }],
    };
  }, [workouts]);

  const weightChartOptions = useMemo(() => {
    const sorted = [...health].sort((a, b) => moment(a.date).diff(moment(b.date)));
    const dates = sorted.map((h: any) => moment(h.date).format('DD/MM'));
    const weights = sorted.map((h: any) => h.weight);
    return {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: dates, name: 'Ngày' },
      yAxis: { type: 'value', name: 'Cân nặng (kg)' },
      series: [{ type: 'line', data: weights, smooth: true, lineStyle: { color: '#82ca9d' } }],
    };
  }, [health]);

  const recentWorkouts = [...workouts]
    .sort((a, b) => moment(b.date).diff(moment(a.date)))
    .slice(0, 5);

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Buổi tập tháng" value={stats.totalWorkouts} /></Card></Col>
        <Col span={6}><Card><Statistic title="Calo đốt" value={stats.totalCalories} /></Card></Col>
        <Col span={6}><Card><Statistic title="Streak (ngày)" value={stats.streak} /></Card></Col>
        <Col span={6}><Card><Statistic title="Hoàn thành (%)" value={stats.progress} suffix="%" /></Card></Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Số buổi tập theo tuần">
            <ReactECharts option={weeklyChartOptions} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Cân nặng theo thời gian">
            <ReactECharts option={weightChartOptions} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
      <Card title="5 buổi tập gần nhất" style={{ marginTop: 20 }}>
        {recentWorkouts.length ? (
          <Timeline>
            {recentWorkouts.map((w: any, i: number) => (
              <Timeline.Item key={i}>
                {moment(w.date).format('DD/MM')} - {w.exerciseName} ({w.type}) - {w.duration} phút
              </Timeline.Item>
            ))}
          </Timeline>
        ) : <Empty />}
      </Card>
    </div>
  );
};

export default Dashboard;