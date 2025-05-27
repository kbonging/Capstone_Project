// src/components/section/CardSection.jsx
import React from 'react';
import Card from '../components/Card';

//data를 **배열(array)**로 받는 이유는, 서버(API)가 여러 개의 카드 항목을 한 번에 받기 위해서쓴거임
export default function CardSection({ title, data = [], loading, error }) {
  if (loading) return <p className="text-center py-8">로딩 중…</p>;
  if (error)   return <p className="text-center py-8 text-red-500">에러: {error.message}</p>;

  return (
    <section className="my-12 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <a href="#" className="font-bold text-sm text-gray-800 hover:underline">더보기</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 justify-items-center">
          {data.map(card => (
            //여기서 프롭스로 넘겨주는 데이터는 서버로 부터 응답받은 json데이터니 백엔드 팀과 상의 해서 작성하시면 됩니다
             <Card key={card.id} {...card} /> //스프레드 연산자로 나머지 데이터 전달
          ))}
        </div>
      </div>
    </section>
  );
}
