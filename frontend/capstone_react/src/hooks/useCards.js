import { useState, useEffect } from 'react';
import { fetchCards } from '../api/cardApi';
import { testApiRequest } from '../api/Test';

export function useCards(category) {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  //컴포넌트가 처음 렌더링되거나 category가 바뀌면 useEffect가 실행
  useEffect(() => {
    // testApiRequest()
    //   .then(r => r.json())
    //   .then(console.log)
    //   .catch(console.error);
    
    let cancelled = false;
    setLoading(true);
    fetchCards(category)
      .then(json => { if (!cancelled) setData(json); }) //응답(JSON)이 돌아오면
      .catch(err => { if (!cancelled) setError(err); }) //에러 나면 렌더링
      .finally(() => { if (!cancelled) setLoading(false); }); //끝나면

    return () => { cancelled = true; };
  }, [category]);

  return { data, loading, error };
}
