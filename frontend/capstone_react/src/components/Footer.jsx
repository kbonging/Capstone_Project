import React from "react";
import LogoImage from "../images/main_logo.png";
import { FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-zinc-900 px-8 py-8 mt-auto text-gray-700 dark:text-zinc-400">
      {/* 위쪽 3개 블록 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto mb-10">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-3">
            Discover Revory
          </h3>
          <p className="text-sm leading-relaxed">
            리뷰와 경험이 중요한 공간에 오신 것을 환영합니다.<br />
            Revory에서는 생생한 리뷰와 진솔한 후기가 중심이 되며,<br />
            광고에 방해받지 않고 진짜 목소리를 <br />
            만나보실 수 있습니다.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-3">
            Make Medium yours
          </h3>
          <p className="text-sm leading-relaxed">
            관심 있는 제품과 서비스를 팔로우하면, <br />
            가장 알찬 리뷰와 정보를 홈 화면과 <br />
            알림으로 바로 받아보실 수 있습니다.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-3">
            ⓒ주식진행시켜 REVORY (REVIEW NOTE)
          </h3>
          <p className="text-sm leading-relaxed">
            대표: 최진형<br />
            인천광역시 부평구 무네미로 448번길 56<br />
            Progress96@gmail.com<br />
            사업자 등록번호: 010-67-12345<br />
            <br />
            고객센터 032) 519-2114
          </p>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-zinc-700 mb-6" />

      {/* 하단 로고 & 네비게이션 */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        {/* 로고 */}
        <div className="mb-4 md:mb-0">
          <img
            src={LogoImage}
            alt="Revory Logo"
            className="h-[37px] w-auto dark:brightness-200"
          />
        </div>

        {/* 네비게이션 + 소셜 */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-zinc-100 transition"
            >
              소개
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-zinc-100 transition"
            >
              고객센터
            </a>
            <a
              href="#"
              className="hover:text-gray-900 dark:hover:text-zinc-100 transition"
            >
              이용약관
            </a>
          </div>

          {/* 소셜 아이콘 */}
          <div className="flex gap-4 text-lg mt-3 md:mt-0">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-500 transition"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-zinc-100 transition"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
