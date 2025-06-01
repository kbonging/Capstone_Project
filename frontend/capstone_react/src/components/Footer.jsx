import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-y-10">
        {/* 로고 & 간단 설명 */}
        <div className="w-full sm:w-1/3">
          <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Revory</h2>
          <p className="text-gray-400 max-w-xs">
            체험단, 커뮤니티, 그리고 다양한 서비스를 한 곳에서 경험하세요.
          </p>
          <p className="mt-6 text-sm text-gray-500">&copy; 2025 Revory. All rights reserved.</p>
        </div>

        {/* 메뉴 그룹 */}
        <div className="w-full sm:w-2/3 grid grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-5 uppercase tracking-wide">고객센터</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/help" className="hover:text-white transition-colors duration-300">
                  문의하기
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors duration-300">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 uppercase tracking-wide">정책</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/terms" className="hover:text-white transition-colors duration-300">
                  이용약관
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors duration-300">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="/policy" className="hover:text-white transition-colors duration-300">
                  운영정책
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 uppercase tracking-wide">서비스</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/trials" className="hover:text-white transition-colors duration-300">
                  체험단
                </a>
              </li>
              <li>
                <a href="/search" className="hover:text-white transition-colors duration-300">
                  검색
                </a>
              </li>
              <li>
                <a href="/community" className="hover:text-white transition-colors duration-300">
                  커뮤니티
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
