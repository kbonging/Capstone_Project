// 상단 import에 추가
import { FiTag, FiImage, FiLink, FiVideo, FiMapPin, FiAlertCircle, FiAtSign, FiVolume2 } from "react-icons/fi";
import { TbArticle } from "react-icons/tb";

// code 또는 한글명 모두 허용하는 키 해석기
export const norm = (v = "") => {
  const s = String(v).trim();
  if (/^CAMC00[1-8]$/.test(s)) return s;
  const m = {
    "블로그": "CAMC001",
    "인스타그램": "CAMC002",
    "블로그+클립": "CAMC003",
    "클립": "CAMC004",
    "릴스": "CAMC005",
    "유튜브": "CAMC006",
    "쇼츠": "CAMC007",
    "틱톡": "CAMC008",
  };
  return m[s] ?? "CAMC001";
};

// 채널별 미션 사양(아이콘 + 라벨)
// tabs 배열 길이가 2면 블로그+클립처럼 두 섹션으로 그림
export const CHANNEL_SPECS = {
  CAMC001: { // 블로그
    tabs: [{
      label: "블로그",
      items: [
        { icon: FiTag,         text: "키워드" },
        { icon: FiImage,       text: "15장 이상" },
        { icon: TbArticle,     text: "1,000자" },
        { icon: FiMapPin,      text: "지도 첨부" },
        { icon: FiVideo,       text: "동영상 or GIF" },
        { icon: FiAlertCircle, text: "공정위 표기" },
      ],
    }],
  },
  CAMC002: { // 인스타그램
    tabs: [{
      label: "인스타그램",
      items: [
        { icon: FiTag,         text: "해시태그" },
        { icon: FiImage,       text: "3장 이상" },
        { icon: TbArticle,     text: "100자" },
        { icon: FiAtSign,      text: "계정 태그" },
        { icon: FiAlertCircle, text: "#협찬 #리뷰노트" },
      ],
    }],
  },
  CAMC003: { // 블로그+클립
    tabs: [
      { label: "블로그", items: [
        { icon: FiTag,         text: "키워드" },
        { icon: FiImage,       text: "15장 이상" },
        { icon: TbArticle,     text: "1,000자" },
        { icon: FiMapPin,      text: "지도 첨부" },
        { icon: FiVideo,       text: "동영상 or GIF" },
        { icon: FiAlertCircle, text: "공정위 표기" },
      ]},
      { label: "클립", items: [
        { icon: FiTag,         text: "해시태그" },
        { icon: FiMapPin,      text: "지도 첨부" },
        { icon: FiVideo,       text: "15초 이상" },
        { icon: FiAlertCircle, text: "#협찬 #리뷰노트" },
      ]},
    ],
  },
  CAMC004: { // 클립
    tabs: [{
      label: "클립",
      items: [
        { icon: FiTag,         text: "해시태그" },
        { icon: FiMapPin,      text: "지도 첨부" },
        { icon: FiVideo,       text: "30초 이상" },
        { icon: FiAlertCircle, text: "#협찬 #리뷰노트" },
        { icon: FiVolume2,     text: "목소리 필수" },
      ],
    }],
  },
  CAMC005: { // 릴스
    tabs: [{
      label: "릴스",
      items: [
        { icon: FiTag,         text: "해시태그" },
        { icon: FiMapPin,      text: "지도 첨부" },
        { icon: FiVideo,       text: "30초 이상" },
        { icon: FiAlertCircle, text: "#협찬 #리뷰노트" },
        { icon: FiVolume2,     text: "목소리 필수" },
      ],
    }],
  },
  CAMC006: { // 유튜브
    tabs: [{
      label: "유튜브",
      items: [
        { icon: FiTag,         text: "키워드" },
        { icon: FiTag,         text: "태그" },
        { icon: FiLink,        text: "링크 첨부" },
        { icon: FiVideo,       text: "3분 이상" },
        { icon: FiAlertCircle, text: "유료광고 표시" },
        { icon: FiVolume2,     text: "목소리 필수" },
      ],
    }],
  },
  CAMC007: { // 쇼츠
    tabs: [{
      label: "쇼츠",
      items: [
        { icon: FiTag,         text: "키워드" },
        { icon: FiMapPin,      text: "지도 첨부" },
        { icon: FiVideo,       text: "30초 이상" },
        { icon: FiAlertCircle, text: "유료광고 표시" },
        { icon: FiVolume2,     text: "목소리 필수" },
      ],
    }],
  },
  CAMC008: { // 틱톡
    tabs: [{
      label: "틱톡",
      items: [
        { icon: FiTag,         text: "키워드" },
        { icon: FiLink,        text: "링크 첨부" },
        { icon: FiVideo,       text: "30초 이상" },
        { icon: FiAlertCircle, text: "유료광고 표시" },
        { icon: FiVolume2,     text: "목소리 필수" },
      ],
    }],
  },
};
