import React from 'react';
import TestButton from '../components/testButton';

const TestCards: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Selección de Test de Cartas</h1>
      <div className="grid grid-cols-2 gap-4">
        <TestButton text="El test del top 1% de preguntas más fáciles" onClick={() => console.log('1% test clicked')} />
        <TestButton text="El test del top 5% de preguntas más fáciles" onClick={() => console.log('5% test clicked')} />
        <TestButton text="El test top 10% de preguntas más fáciles" onClick={() => console.log('10% test clicked')} />
        <TestButton text="El test top 25% de preguntas más fáciles" onClick={() => console.log('25% test clicked')} />
        <TestButton text="El test top 50% de preguntas más fáciles" onClick={() => console.log('50% test clicked')} />
        <TestButton text="Test 100%" onClick={() => console.log('100% test clicked')} />
      </div>
    </div>
  );
};

export default TestCards;