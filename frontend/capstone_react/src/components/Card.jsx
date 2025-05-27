// import React from 'react';
// import dsignImage from '../images/dsign.webp';
// import blog from '../images/blog.webp';

// const Card = () => {
//   return (
//     <div className="bg-white w-[300px] p-4 relative font-[Pretendard-Regular]">
//       {/* 포인트 뱃지 */}
//       <span className="absolute top-2 right-8 text-xl cursor-pointer text-purple-600 border px-2 rounded-xl bg-purple-300">
//         HOT
//       </span>

//       {/* 제품 이미지 */}
//       <div className="mb-3">
//         <img
//           className="w-[300px] mx-auto"
//           src={dsignImage}
//           alt="제품사진"
//         />
//       </div>

//       {/* 제품 정보 */}
//       <div className="my-1 ml-2" >
//         <h3 className="text-base font-semibold">[재택] 풀리오 풀리지 허벅지마사지기</h3>
//         <p className="text-sm text-gray-600">
//           풀리오 풀리지 허벅지마사지기
//         </p>
//       </div>

//       {/* 카테고리, 가격, 상태 */}
//       <div className="flex flex-col mt-2 mb-2 items-start text-sm text-gray-700 ml-2">
//         <div className="[&>*]:inline [&>*]:size-[20px] [&>*]:translate-y-[3px] [&>p:not(:last-child)]:after:content-['|']">
//           <p className="flex items-center">
//           <img src={blog} alt="블로그 아이콘" className="w-4 h-4 mr-1 align-middle inline-block"/>블로그</p>
//           <p>배송형(온라인) </p>
//           <p>뷰티</p>
//         </div>
//         <div className="text-left mt-1">129,000 원</div>
//         <div className="text-left mt-1">남은기간 [ ] 신청자 [<span className="text-blue-500 font-semibold">1000</span>/1]</div>
//       </div>
//     </div>

//   );
// };

// export default Card;

// src/components/ui/Card.jsx
// Card 컴포넌트는 오직 props 기반으로 렌더링
import React from "react";
import blogIcon from "../images/blog.webp"; // 카테고리 아이콘은 그대로 import
import img from "../images/dsign.webp";
// 필요하다면 카테고리별 아이콘 맵을 만들어도 좋아요.

export default function Card({
  badge, // ex: "HOT"
  imageUrl, // 서버에서 내려주는 이미지 URL
  title, // ex: "[재택] 풀리오…"
  subtitle, // ex: "풀리오 풀리지 허벅지마사지기"
  category, // ex: "블로그"
  deliveryType, // ex: "배송형(온라인)"
  field, // ex: "뷰티"
  price, // ex: 129000
  remainingDays, // ex: 3
  applicants, // ex: { current: 1000, total: 1 }
}) {
  return (
    <div className="bg-white w-[300px] p-4 relative font-[Pretendard-Regular]">
      {/* 뱃지 */}
      {badge && (
        <span className="absolute top-2 right-4 text-xl text-purple-600 border px-2 rounded-xl bg-purple-300">
          {badge}
        </span>
      )}

      {/* 제품 이미지 */}
      <div className="mb-3">
        <img className="w-[300px] mx-auto" src={img} alt={title} />
      </div>

      {/* 제품 정보 */}
      <div className="my-1 ml-2">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>

      {/* 카테고리 · 가격 · 상태 */}
      <div className="flex flex-col mt-2 mb-2 items-start text-sm text-gray-700 ml-2">
        <div className="[&>*]:inline [&>*]:mr-1 [&>p:not(:last-child)]:after:content-['|']">
          {category && (
            <p className="flex items-center">
              <img
                src={blogIcon}
                alt={category}
                className="w-4 h-4 mr-1 inline-block align-middle"
              />
              {category}
            </p>
          )}
          {deliveryType && <p>{deliveryType}</p>}
          {field && <p>{field}</p>}
        </div>
        <div className="text-left mt-1">{price?.toLocaleString()} 원</div>
        {remainingDays != null && applicants && (
          <div className="text-left mt-1">
            남은기간 {remainingDays}일 신청자 [{applicants.current}/
            {applicants.total}]
          </div>
        )}
      </div>
    </div>
  );
}
