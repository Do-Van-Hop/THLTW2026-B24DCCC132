import React, { useState, useEffect } from 'react';
import { Card, Button, InputNumber, Alert, Typography } from 'antd';

const { Title, Text } = Typography;

const DoanSo: React.FC = () => {
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState<number | undefined>(undefined);
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [message, setMessage] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [history, setHistory] = useState<string[]>([]);

  const initGame = () => {
    const newSecret = Math.floor(Math.random() * 100) + 1;
    setSecretNumber(newSecret);
    setGuess(undefined);
    setAttemptsLeft(10);
    setMessage('');
    setGameStatus('playing');
    setHistory([]);
    console.log('Secret:', newSecret); 
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = () => {
    if (guess === undefined) {
      setMessage('Vui lòng nhập số!');
      return;
    }
    if (guess < 1 || guess > 100) {
      setMessage('Số phải từ 1 đến 100!');
      return;
    }

    let feedback = '';
    if (guess === secretNumber) {
      feedback = 'Chúc mừng! Bạn đã đoán đúng!';
      setGameStatus('won');
    } else if (guess < secretNumber) {
      feedback = 'Bạn đoán quá thấp!';
    } else {
      feedback = 'Bạn đoán quá cao!';
    }

    setHistory([...history, `Lần ${history.length + 1}: ${guess} - ${feedback}`]);
    setMessage(feedback);

    if (guess !== secretNumber) {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      if (newAttempts === 0) {
        setGameStatus('lost');
        setMessage(`Bạn đã hết lượt! Số đúng là ${secretNumber}.`);
      }
    }

    setGuess(undefined);
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center' }}>Đoán số (1-100)</Title>
        <Text>Lượt còn lại: {attemptsLeft}/10</Text>
        <br />
        <Text strong>Trạng thái: {
          gameStatus === 'playing' ? 'Đang chơi' :
          gameStatus === 'won' ? 'Thắng' :  'Thua'
        }</Text>

        <div style={{ marginTop: 16 }}>
          <InputNumber
            min={1}
            max={100}
            value={guess}
            onChange={(value) => setGuess(value as number)}
            disabled={gameStatus !== 'playing'}
            style={{ width: '100%' }}
            placeholder="Nhập số đi bạn ê"
          />
          <Button
            type="primary"
            onClick={handleGuess}
            disabled={gameStatus !== 'playing'}
            style={{ marginTop: 8 }}
            block
          >
            Đoán
          </Button>
        </div>

        {message && (
          <Alert
            message={message}
            type={
              message.includes('Chúc mừng') ? 'success' :
              message.includes('hết lượt') ? 'error' : 'info'
            }
            showIcon
            style={{ marginTop: 16 }}
          />
        )}

        <Button onClick={initGame} style={{ marginTop: 16 }} block>
          Chơi lại
        </Button>

        {history.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Title level={4}>Lịch sử</Title>
            <ul>
              {history.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DoanSo;