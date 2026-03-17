import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Tag, List, message } from 'antd';

const { Title, Text } = Typography;

type Choice = 'kéo' | 'búa' | 'bao';
type Result = 'thắng' | 'thua' | 'hòa';

interface HistoryItem {
  id: number;
  playerChoice: Choice;
  computerChoice: Choice;
  result: Result;
  timestamp: string;
}

const RockPaperScissors: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('rps_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rps_history', JSON.stringify(history));
  }, [history]);

  const computerChoice = (): Choice => {
    const choices: Choice[] = ['kéo', 'búa', 'bao'];
    const random = Math.floor(Math.random() * 3);
    return choices[random];
  };

  const determineResult = (player: Choice, computer: Choice): Result => {
    if (player === computer) return 'hòa';
    if (
      (player === 'kéo' && computer === 'bao') ||
      (player === 'búa' && computer === 'kéo') ||
      (player === 'bao' && computer === 'búa')
    ) {
      return 'thắng';
    }
    return 'thua';
  };

  const play = (playerChoice: Choice) => {
    const computer = computerChoice();
    const result = determineResult(playerChoice, computer);

    const newItem: HistoryItem = {
      id: Date.now(),
      playerChoice,
      computerChoice: computer,
      result,
      timestamp: new Date().toLocaleString('vi-VN'),
    };
    setHistory([newItem, ...history]);
    setCurrentResult(`Bạn chọn ${playerChoice}, máy chọn ${computer}. Bạn ${result}!`);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('rps_history');
    message.success('Đã xóa lịch sử');
  };

  const getResultColor = (result: Result) => {
    switch (result) {
      case 'thắng': return 'green';
      case 'thua': return 'red';
      case 'hòa': return 'orange';
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>
          Trò chơi Oẳn Tù Tì
        </Title>

        <Space size="large" style={{ justifyContent: 'center', display: 'flex', margin: '24px 0' }}>
          <Button 
            size="large" 
            style ={{ backgroundColor: '#fff', color: '#FF4400' }}
            onClick={() => play('kéo')}
            icon={<span>✌️</span>}
          >
            Kéo
          </Button>
          <Button 
            size="large"
            style ={{ backgroundColor: '#fff', color: '#FF4400' }} 
            onClick={() => play('búa')}
            icon={<span>✊</span>}
          >
            Búa
          </Button>
          <Button 
            size="large" 
            style ={{ backgroundColor: '#fff', color: '#FF4400' }}
            onClick={() => play('bao')}
            icon={<span>🖐️</span>}
          >
            Bao
          </Button>
        </Space>

        {currentResult && (
          <Card type="inner" style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 16 }}>{currentResult}</Text>
          </Card>
        )}


        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4}>Lịch sử đấu</Title>
          {history.length > 0 && (
            <Button onClick={clearHistory} danger>Xóa lịch sử</Button>
          )}
        </div>

        <List
          bordered
          dataSource={history}
          renderItem={(item) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Tag color="blue">Bạn: {item.playerChoice}</Tag>
                  <Tag color="purple">Máy: {item.computerChoice}</Tag>
                  <Tag color={getResultColor(item.result)}>
                    {item.result === 'thắng' ? '🎉 Thắng' : item.result === 'thua' ? '😞 Thua' : '🤝 Hòa'}
                  </Tag>
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>{item.timestamp}</Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default RockPaperScissors;