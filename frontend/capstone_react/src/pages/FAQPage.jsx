import { useState, useRef } from "react";

const topQuestions = [
  {
    q: "체험단 연장은 어떻게 하나요?",
    a: "리뷰 마감일 전 광고주의 연장 버튼 클릭 시 자동 연장됩니다. 관련 공지사항 참고 부탁드립니다."
  },
  {
    q: "체험단 참여 취소는 어떻게 하나요?",
    a: "마이페이지에서 취소 사유를 작성하시면 됩니다. 협의되지 않은 취소 시 불이익이 있을 수 있으니 반드시 확인 후 신청 바랍니다."
  },
  {
    q: "중복 당첨되었는데 체험 가능할까요?",
    a: "중복 당첨의 경우 해당 체험단 운영 방침에 따라 달라질 수 있으며, 협의 후 결정됩니다."
  },
  {
    q: "사장님이 연락이 안돼요.",
    a: "2일 이상 연락이 없을 경우, 해당 내용 작성 후 마감일 이전 홈페이지로 문의 바랍니다."
  },
  {
    q: "이메일 변경하고 싶어요.",
    a: "가입하셨던 네이버 메일 변경 시 카카오톡 알림으로 전송되며, 사이트 이용에는 문제가 없습니다."
  },
];

const faqList = [
  { 
    q: "연장 합의 없었는데 자동 연장 되어 체험단 취소가 불가한가요?",
    a: `현재 체험단 연장은 리뷰어 개별이 아닌, 체험단 단위로 일괄 연장 처리되고 있습니다.
        타 리뷰어와 연장 협의로 인해 체험단이 전체 연장되었더라도, 리뷰어님께서 개별적으로 광고주와 직접 연장 협의를 해주셔야 하며,
        연장 협의를 하지 않으신 경우에는 초기 안내받으신 기존 리뷰 마감일까지 리뷰를 등록하거나,
        그 이전에 취소 신청을 완료해 주셔야 합니다.
        기존 리뷰 마감일 이전에 연장 처리가 된 경우에는 마감일 이전이므로 직접 취소 신청이 가능하며,
        기존 리뷰 마감일이 지난 이후에는 체험단이 전체 연장 중이라 하더라도 취소 신청은 불가 한 점 안내 드립니다`
  },
  { 
    q: "고객센터, 카카오톡, 전화 상담 등 1:1 소통 가능한가요?",
    a: `리뷰노트는 현재 무료로 운영되는 플랫폼으로, 전화 상담이나 실시간 1:1 응대는 제공되지 않는 점 너그럽게 양해 부탁드립니다.
        계정 관련 문의는 메일로 접수해 주시면, 해당 부서에서 순차적으로 확인 후 답변드리고 있습니다.

        1:1 문의는 영업일 기준 평균 1~3일 내 답변을 드리고 있으나, 문의량에 따라 최대 7~10일 이상 소요될 수 있는 점 참고 부탁드립니다.
        또한, 빠른 확인을 원하실 경우 [고객센터 > 자주 묻는 질문] 메뉴에서 관련 내용을 검색해 확인해보실 수 있습니다.

        감사합니다.`
  },
  { 
    q: "광고주가 체험단 연장을 해주지 않으면 어떻게 하나요?",
    a: "리뷰 마감일 이전에 연장이 어렵다면 광고주와 체험단 취소 협의 후 기존 마감일 전에 리뷰어가 직접 취소 신청해야합니다."
  },
  { 
    q: "지급명령 공고 알림톡을 받았어요.",
    a: `리뷰노트가 대행하는 체험단의 경우, 리뷰 마감일까지 리뷰 등록 되지 않는 분들께 경고 조치 드리고 있습니다.
        업체측과 기존 마감일 이전에 연장 협의하신 경우 해당 내역을 1:1문의로 첨부 부탁드립니다.
        체험을 진행하지 않으신 경우에도 1:1문의로 남겨주시면 추가 경고가 발송되지 않으니 참고 부탁드립니다.`
  },
  { 
    q: "체험단 신청 시 주소 입력은 왜 하나요?",
    a: `현재 프로필 관리에 주소가 등록 되어 있지 않은 사용자의 경우, 유형(방문형/당일지급 등)관계 없이 첫 체험단 신청 시 주소 입력란이 나타나도록 설정 되어 있습니다.
         해당 부분은 활동 지역 확인을 위한 부분임을 참고 부탁드립니다.`
  },
  { 
    q: "리뷰노트를 사용한 연락을 받았을 때 어떻게 해야 하나요?",
    a: "리뷰노트 공식 알림 외의 개별 연락은 주의해 주세요. 필요 시 고객센터로 신고 바랍니다."
  },
  {
    q:  "당일 노쇼로 페널티를 받았는데, 당일 몇 시간 전에 체험단 취소 해도 페널티가 부과되나요?",
    a:  `광고주 노쇼 / 인플루언서 노쇼는 페널티 사유에 해당합니다.
        예약 당일 취소는 당일 노쇼로 간주되므로 페널티가 부과됩니다.
        최소 하루 전까지 광고주님과 협의해 주시기 바랍니다.`
  },
  {
    q:  "체험단 마감일이 지났지만 광고주와 마감일 전에 취소 협의 했는데 취소가 안되어있어요 취소 해주세요",
    a:  `체험단 취소는 업체와의 협의만으로 완료되지 않으며, 반드시 마감일 이전에 
        홈페이지(전산상)에서 취소 신청이 완료되어야 합니다.
        체험단 운영 정책상, 취소 협의를 진행하셨더라도 리뷰노트 홈페이지에서 공식적으로
        취소 등록이 완료되지 않으면 자동으로 취소 횟수가 부과됩니다.`
  },
  {
    q:  "블로그로 당첨되었는데 광고주가 인스타 리뷰를 요구합니다.",
    a:  `시스템상 채널(블로그, 인스타, 유튜브 등)에 맞는 링크만 등록 가능하므로,
        블로그 체험단에 인스타 리뷰는 등록할 수 없습니다. (반대의 경우도 동일합니다.)
        이런 요청을 받으셨을 경우, 진행하지 마시고 리뷰노트 측으로 문의해 주시기 바랍니다. 
        링크 등록이 되지 않아 발생하는 불이익에 대해서는 리뷰노트에서 책임지지 않습니다.`
  },
  {
    q:  "체험단 못할 것 같아서 체험단 취소 했는데 다시 신청할 수 없나요?",
    a:  `이미 취소한 체험단은 재신청 할 수 없습니다 신중한 취소 부탁드립니다.
        *신청메세지 확인불가`
  },
  {
    q:  "중복으로 당첨 되었어요",
    a:  `중복당첨의 경우, 담당자와 협의 후 진행이 가능하다면 그대로 진행하셔도 됩니다.
        진행이 어려운 경우에는 협의 내용을 캡처하여 기존 리뷰 마감일 이전까지 홈페이지를 통해 체험단 취소 신청 부탁드립니다.`
  },
  {
    q:  "김남국",
    a:  `코인 중독자, 헬스는 거의 마약중독자임.`
  },
   {
    q:  "김봉중",
    a:  `얜 그냥 던파임, 학교와서 하루쟁일 던파만 함.. 안질리나`
  },
  {
    q:  "최진형",
    a:  `김남국 따라서 운동하더니 헬창인이 다 됨.`
  },
  {
    q:  "마감일이 지난 후 리뷰작성을 하여 포인트를 받지 못했어요",
    a:  `제시된 기간 내 체험 후 리뷰를 작성하면 리뷰어가 포인트를 받는 시스템입니다.
        정상적으로 진행되지 않은 경우, 광고주와 소통하여 해결해주시기 바랍니다.

        마감일을 준수하지 않아 발생한 문제에 대해서는 리뷰노트에서 책임지지 않습니다.`
  },
  {
    q:  "선정 알림을 받지 않았는데 마이페이지에서 체험단이 확인돼요.",
    a:  `당첨 알림톡이 발송되지 않거나, 추가 선정된 이후 선정된 알림이 발송되지 않는 오류가 간혹 발생하기 때문에 사이트 내 
        [진행중 체험단]에서 확인하시는 것이 가장 정확합니다.
        [진행중 체험단]에서 확인이 되신다면 선정된 것이므로, 체험단을 진행해 주시면 됩니다..`
  },
  {
    q:  "체험단 담당자 연락처 알려주세요.",
    a:  `담당자 연락처는 로그인 후 키워드 정보 아래에서 확인 가능합니다.
        로그인 후 확인 부탁드립니다.`
  },
  {
    q:  "추가 당첨되었는데, 체험 진행이 불가해서 체험단 취소 하고 싶어요.",
    a:  `추가 선정의 경우 '추가선정 알림톡' 캡쳐 후 사이트 내 협의 취소 신청해주시면 페널티없이 처리 도와드리겠습니다. `
  },
  {
    q:  "방문자 프로그램 이용자 신고할게요.",
    a:  `방문자 프로그램을 사용하는 증거자료를 수집하여 1:1 문의를 통해 신고 부탁드립니다.`
  },
  {
    q:  "과도한 추가 가이드라인을 요구해요",
    a:  `예약금/영수증리뷰 등 체험단 미션란에 기재되어 있지않은 추가 가이드라인을 요구하는 경우,
         증빙자료와 함께 1:1 문의로 신고 부탁드립니다.  
        #000000 체험단 번호 / 성함 / 연락처 / 문자내역과 함께 문의부탁드립니다. `
  },
  {
    q:  "콘텐츠 유지기한은 얼마나 되나요?",
    a:  `리보리를 통해 발행된 콘텐츠는 6개월간 의무적으로 '공개' 처리 해주셔야 하며,
         지켜지지 않을 경우 클린체험단(리뷰 미제출) 대상에 포함되어 클린체험단이 진행될 수 있으니 유의 부탁드립니다.`
  },
  {
    q:  "리뷰 등록 채널을 변경하고 싶어요.",
    a:  `인스타그램 체험단에 블로그 리뷰 링크 등록은 불가합니다.
        채널 확인 후 채널에 맞는 리뷰 작성 후 링크 등록 부탁드립니다.`
  },
  {
    q:  "체험 과정에서 문제가 생겼어요.",
    a:  `체험단 번호 / 성함 / 연락처 / 상세 내용 (대화 내역) 전달해 주시면 확인 후 안내 도와드리겠습니다.`
  },
  {
    q:  "가입이 되지 않아요.(계정 관련 문의)",
    a:  `성함 / 연락처 / 회원가입 시 자동으로 기입되는 이메일 주소 전달해 주시면 확인 후 안내드리겠습니다.`
  },
  {
    q:  "업체 또는 체험단 노쇼",
    a:  `광고주 노쇼 / 인플루언서 노쇼는 페널티 사유에 해당합니다.
        체험단 번호 / 성함 / 연락처 / 예약 내역 전달해 주시면 확인 후 조치 도와드리겠습니다.`
  },
  {
    q:  "체험단 취소 신청 철회하고 싶어요.",
    a:  `처리가 완료된 취소 건에 대해서는 철회가 불가합니다.`
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const faqSectionRef = useRef(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const handleSearchClick = () => {
    faqSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 버튼 클릭·엔터키 공통 처리
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 페이지 새로고침 방지
    handleSearchClick();
  };

  const filteredFaqs = faqList.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-center mb-6">무엇을 도와드릴까요?</h1>
      <form onSubmit={handleSearchSubmit} className="flex justify-center mb-12">
        <input
          type="text"
          placeholder="문의 내용과 관련된 키워드로 검색해 주세요. 예) “취소”, “연장”, “포인트”"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-l-md px-4 py-2
                     focus:outline-none focus:ring-1 focus:ring-blue-400
                     placeholder:text-xs"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
        >
          검색
        </button>
      </form>

      {/* 상단 카드 5개 */}
      <div className="grid md:grid-cols-5 gap-4 mb-16">
        {topQuestions.map((item, idx) => (
          <div key={idx} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <h2 className="text-blue-600 font-bold mb-2">Q{idx + 1}.</h2>
            <p className="font-semibold mb-2">{item.q}</p>
            <p className="text-sm text-gray-500">{item.a}</p>
          </div>
        ))}
      </div>

      {/* FAQ 아코디언 */}
      <h2 ref={faqSectionRef} className="text-xl font-semibold mb-6">자주 묻는 질문</h2>
      <div className="divide-y divide-gray-200">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full text-left py-4 flex justify-between items-center font-medium focus:outline-none"
                onClick={() => toggle(i)}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-blue-600 font-bold">Q{i + 1}.</span>
                  <span className="text-gray-900 font-normal">{faq.q}</span>
                </div>
                <span className="text-gray-400">{openIndex === i ? "−" : "+"}</span>
              </button>

              {openIndex === i && (
                <div className="pb-4">
                  <div className="whitespace-pre-line bg-gray-50 text-gray-700 text-sm p-4 rounded-md">
                    {faq.a}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
