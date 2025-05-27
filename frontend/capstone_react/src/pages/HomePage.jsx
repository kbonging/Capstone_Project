// src/pages/HomePage.jsx
import React from 'react';
import { useCards } from '../hooks/useCards';
import CardSection from '../section/CardSection';


export default function HomePage() {
    // ① useCards 훅 호출 → { data, loading, error } 객체 리턴
    // ② 그 객체를 구조분해 할당(destructuring)하면서
    //     - data           → premium
    //     - loading        → lp
    //     - error          → ep
  // ① 훅을 호출해서 각 카테고리별 data, loading, error를 받아서 처리.
  const { data: premium,  loading: lp, error: ep } = useCards('premium');
  const { data: popular,  loading: lpo, error: epo } = useCards('popular');
  const { data: hot,      loading: lh,  error: eh  } = useCards('hot');
  const { data: fresh,    loading: lf,  error: ef  } = useCards('fresh');
  // … 나머지도 동일하게 해주심 됩니다

  {/* ③ CardSection에
             • title: "프리미엄 체험단"
             • data: premium  (fetch 결과 배열)
             • loading: lp    (불러오는 중인지 boolean)
             • error: ep      (에러 객체 or null)
         을 props로 넘김 */}

  return (
    <>
      {/* ② 그 data 배열을 각각 CardSection의 data prop으로 넘깁니다. */}
      <CardSection title="프리미엄 체험단"   data={premium}  loading={lp}  error={ep} />
      <CardSection title="인기 체험단"       data={popular}  loading={lpo} error={epo} />
      <CardSection title="마감임박 체험단"   data={hot}      loading={lh}  error={eh}  />
      <CardSection title="신규 체험단"       data={fresh}    loading={lf}  error={ef}  />
    </>
  );
}
