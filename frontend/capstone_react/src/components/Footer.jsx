import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-black-300 px-8 py-12 mt-auto">
      {/* 위쪽 3개 블록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto mb-10">
        <div>
          <h3 className="text-lg font-semibold text-black mb-2">
            Discover Revory
          </h3>
          <p className="text-sm leading-relaxed">
            리뷰와 경험이 중요한 공간에 오신 것을 환영합니다. Revory에서는 생생한 리뷰와 진솔한 후기가 중심이 되며,
             광고에 방해받지 않고 진짜 목소리를 만나보실 수 있습니다.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-black mb-2">
            Make Medium yours
          </h3>
          <p className="text-sm leading-relaxed">
            관심 있는 제품과 서비스를 팔로우하면, 가장 알찬 리뷰와 정보를 홈 화면과 알림으로 바로 받아보실 수 있습니다.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-black mb-2">
            ⓒ주식진행시켜 REVORY (REVIEW NOTE)
          </h3>
          <p className="text-sm leading-relaxed">
            대표: 최진형<br/>
            address<br/>
            email<br/>
            사업자 등록번호<br/>
            고객센터 012020

            {/* <a href="#" className="underline hover:text-black">
              Browse
            </a> */}
          </p>
        </div>
      </div>

      <hr className="border-neutral-700 mb-6" />

      {/* 하단 로고 & 네비게이션 */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="text-black text-2xl font-bold mb-4 md:mb-0">Medium</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">
            소개
          </a>
          <a href="#" className="hover:text-white">
            고객센터
          </a>
          <a href="#" className="hover:text-white">
            이용약관
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
