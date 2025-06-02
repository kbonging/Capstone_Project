import { useState, useEffect } from "react";
import { fetchCommonCode } from "../api/commonApi";

export default function CommuCateBtns({ selectedCategory, onCategoryChange}) {
  const [categories, setCategories] = useState([]);
  
  useEffect(()=>{
    fetchCommonCode('COMMU_CATE')
    .then((data)=>{
      const allItem = {codeId:'', codeNm:'전체'}
      setCategories([allItem, ...data]);
    })
    .catch()
    .finally();
  }, []);

  return ( 
    <div className="flex items-center gap-2">
      {categories.map((cat) => (
        <button
          key={cat.codeId}
          onClick={() => onCategoryChange(cat.codeId)}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition
            ${
              selectedCategory === cat.codeId
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:text-black'
            }`}
        >
          {cat.codeNm}
        </button>
      ))}
    </div>    
  );
}
