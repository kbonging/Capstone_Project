import React from "react";

export default function TermsPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">이용약관</h1>

      {/* 제 1 조 목적 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제 1 조 목적</h2>
        <p className="llist-decimal list-inside space-y-1 leading-relaxed text-sm">
          이 약관은 Revory(이하 &quot;회사&quot;)가 제공하는 Revory
          (https://www.revory.co.kr) 서비스 및 관련 제반 서비스의 이용과
          관련하여 회사와 회원의 권리, 의무 및 책임사항, 기타 필요한 사항을
          규정함을 목적으로 합니다.
        </p>
      </article>

      <hr className="border-gray-300 dark:border-gray-700 my-8" />

      {/* 제 2 조 정의 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제 2 조 정의</h2>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
          <li>'사이트'란 Revory(https://www.revory.co.kr)를 말합니다.</li>
          <li>'서비스'란 회사가 제공하는 리뷰 및 다양한 서비스를 말합니다.</li>
          <li>'회원'이란 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
          <li>'계정'이란 서비스 이용을 위해 회원이 등록한 이메일 및 비밀번호를 의미합니다.</li>
          <li>'게시물'이란 회원이 서비스 내에 게시한 글, 사진, 동영상 등을 의미합니다.</li>
          <li>'광고주'란 서비스에 광고를 게재하고 광고비를 지불하는 자를 의미합니다.</li>
          <li>'체험단'이란 회사가 기획한 이벤트에 참여하여 후기 등을 작성하는 자를 의미합니다.</li>
          <li>'캠페인'이란 체험단을 모집하고 후기 작성 등을 요청하는 광고주 활동을 의미합니다.</li>
          <li>'포인트'란 서비스 내에서 적립, 사용이 가능한 가상의 데이터를 의미합니다.</li>
          <li>'콘텐츠'란 서비스 내에서 제공하는 모든 정보 및 자료를 의미합니다.</li>
          <li>'링크'란 서비스 내에서 제공하는 다른 사이트나 자료로 연결되는 URL을 의미합니다.</li>
          <li>'이벤트'란 회원이 참여할 수 있도록 회사가 기획한 활동을 의미합니다.</li>
          <li>'스팸'이란 서비스와 무관하거나 불필요한 HTML 코드 또는 이미지를 말합니다.</li>
          <li>'광고성 정보'란 회사가 회원에게 전송하는 광고성 메시지를 말합니다.</li>
          <li>'유료 서비스'란 회사가 회원에게 요금을 받고 제공하는 서비스를 말합니다.</li>
          <li>'개인정보'란 회원의 식별이 가능한 정보를 말합니다.</li>
        </ol>
      </article>

      <hr className="border-gray-300 dark:border-gray-700 my-8" />

      {/* 제 3 조 이용약관 효력 및 적용과 변경 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제 3 조 이용약관 효력 및 적용과 변경</h2>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
          <li>회사는 약관을 회원이 쉽게 알 수 있도록 홈페이지에 게시합니다.</li>
          <li>관련 법령을 위반하지 않는 범위 내에서 이 약관을 변경할 수 있습니다.</li>
          <li>변경 시 적용일자와 사유를 명시하여 30일 전 공지합니다.</li>
          <li>회원이 변경된 약관에 동의하지 않는 경우 이용계약을 해지할 수 있습니다.</li>
        </ol>
      </article>

      <hr className="border-gray-300 dark:border-gray-700 my-8" />

      {/* 제 4 조 이용계약 체결 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제 4 조 이용계약 체결</h2>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
          <li>회원이 되고자 하는 자는 회사가 제공하는 절차를 거쳐 가입합니다.</li>
          <li>14세 미만의 경우 법정대리인 동의가 필요합니다.</li>
          <li>회사는 부적절한 신청에 대해 승낙을 거절할 수 있습니다.</li>
          <li>이용계약은 회사의 승낙이 회원에게 도달한 시점에 성립합니다.</li>
        </ol>
      </article>

       <hr className="border-gray-300 dark:border-gray-700 my-8" />

      {/* 제 5 조 회원정보의 변경 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제 5 조 회원정보의 변경</h2>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
          <li>회원은 개인정보관리화면을 통하여 본인의 개인정보를 열람하고 수정할 수 있습니다. 단, 서비스 관리를 위해 이름, 
            이메일주소 등은 직접 수정이 불가능하며, 수정이 필요한 경우 회사에 소정의 절차를 거쳐 요청하는 것으로 합니다.</li>
          <li>회원은 회원정보로 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편, 기타 방법으로 회사에 그 변경사항을 알려야 합니다.</li>
          <li>제2항의 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여 회사는 책임지지 않습니다.</li>
        </ol>
      </article>

       <hr className="border-gray-300 dark:border-gray-700 my-8" />

      {/* 제 6 조 회원의 계정 및 닉네임의 관리에 대한 의무 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제 6 조 회원의 계정 및 닉네임의 관리에 대한 의무</h2>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
          <li>회원의 계정(네이버, Apple 등 외부 서비스의 인증 계정) 관리 책임은 회원에게 있으며, 제3자가 계정을 부정하게 이용하도록 하여서는 안 됩니다.</li>
          <li>회원은 계정이 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 이를 즉시 회사에 통지하고 회사의 안내에 따라야 합니다. 그 사실을 회사에 통지하지 않거나, 
            통지한 경우에도 회사의 안내에 따르지 않아 발생한 불이익에 대하여 회사는 책임지지 않습니다.</li>
          <li>회사는 회원의 계정이나 닉네임이 아래 각 호에 해당하는 경우 계정 또는 닉네임 사용을 제한하거나 변경을 요청할 수 있습니다.</li>
        </ol>
      </article>

       <hr className="border-gray-300 dark:border-gray-700 my-8" />

      {/*제 7 조 회원에 대한 통지 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제 7 조 회원에 대한 통지</h2>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
          <li>회사는 회원이 사이트에 등록한 이메일, 전화번호 등의 연락처 또는 커뮤니케이션이 가능한 서비스를 통해 회원에게 통지할 수 있습니다.</li>
          <li>불특정 다수 회원에 대한 통지를 해야 할 경우에는 통지 사항을 사이트 게시판 등에 게시함으로써 제 1항의 통지에 갈음할 수 있습니다.</li>
          <li>회원이 개인정보를 허위로 기재하거나 기재사항의 변경 관리를 소홀히 하면 회사의 중요한 통지를 받지 못할 수 있습니다. 
            이로 인해 발생한 불이익에 대하여 회사는 책임지지 않습니다.</li>
        </ol>
      </article>

        <hr className="border-gray-300 dark:border-gray-700 my-8" />

      {/*제 8 조 회사의 의무 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제 8 조 회사의 의무</h2>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
          <li>회사는 법령과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 
            안정적으로 서비스를 제공하기 위해 최선을 다합니다.</li>
          <li>회사는 안정적인 서비스의 제공을 위하여, 설비에 장애가 생기거나 손상된 때에는 부득이한 사유가 없는 한 지체 없이 이를 수리 또는 복구합니다.</li>
          <li>회사는 정보통신망법 등 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 
            개인정보의 보호 및 사용에 대해서는 관련 법 및 회사의 개인정보처리방침이 적용됩니다.</li>
          <li>회사는 서비스 이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는 이를 처리하여야 합니다. 
            회원이 제기한 의견이나 불만 사항에 대해서는 게시판을 활용하거나 이메일 등을 통하여 회원에게 처리 과정 및 결과를 전달합니다.</li>
        </ol>
      </article>

        <hr className="border-gray-300 dark:border-gray-700 my-8" />

      {/* 제 9 조 회원의 의무 */}
      <article className="mb-10">
         <h2 className="text-2xl font-bold mb-6">제 9 조 회원의 의무</h2>

      <p className="mb-4">
        1. 회원은 아래 각 호에 해당하는 행위를 하여서는 안 됩니다.
      </p>

      {/* 1) 계정 및 개인정보 관련 */}
      <h3>1) 계정 및 개인정보 관련</h3>
      <ol type="a" className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
        <li>회원정보에 허위 내용을 등록하는 행위</li>
        <li>다수의 리뷰노트 계정으로 동일한 체험단에 참여하여 부정한 방법으로 혜택을 수령하는 행위</li>
        <li>타인의 개인정보를 도용하거나 사칭하는 행위</li>
        <li>회사의 동의 없이 회원의 이용 권한을 타인에게 양도, 증여하거나 이를 담보로 제공하는 행위</li>
        <li>회사의 정보를 무단으로 사용하거나 사칭하는 행위</li>
        <br/>
      </ol>

      {/* 2) 서비스 운영 방해 관련 */}
      <h3>2) 서비스 운영 방해 관련</h3>
      <ol type="a" className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
        <li>회사가 게시한 정보를 무단으로 변경하는 행위</li>
        <li>회사의 서비스를 부정한 방법으로 이용하는 행위</li>
        <li>불법적인 방법으로 서비스 이용을 방해하거나 회사의 서버에 과도한 부하를 유발하는 행위</li>
        <li>타당한 상업상의 목적을 벗어난 인멸을 하는 행위 등</li>
        <br/>
      </ol>

      {/* 3) 체험단 참여 관련 */}
      <h3>3) 체험단 참여 관련</h3>
      <ol type="a" className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
        <li>허위정보로 체험단을 신청·취소하는 행위</li>
        <li>회사 허락 없이 체험 후기 콘텐츠를 무단 배포하는 행위</li>
        <li>타인의 미디어/콘텐츠/저작물을 무단 복제/등록/배포하는 행위</li>
        <li>콘텐츠 작성 및 유지 기한을 준수하지 않는 행위</li>
        <li>미완성 콘텐츠를 임시로 제출하는 행위</li>
        <li>제공내역 수령 후 콘텐츠를 작성하지 않는 행위</li>
        <li>제공받은 제품이나 서비스에 대해 환불을 요청하는 행위</li>
        <li>체험단에서 요구하는 특정 기간 방문 또는 콘텐츠 발행 등의 조건을 정당한 사유 없이 준수하지 않는 행위</li>
        <li> 부정한 방법으로 콘텐츠를 게재ㆍ홍보하여 광고주에게 손해를 끼치거나 제3자에게 이익을 취하는 행위</li>
        <li>광고주 또는 인플루언서에게 부당한 요구를 하거나 위협, 폭언 등 사회통념을 벗어난 언행을 하는 행위</li>
        <li>부정 콘텐츠로 판정된 게시글의 미디어를 등록하거나 악의적 목적으로 부정 콘텐츠를 등록하는 행위</li>
        <br/>
      </ol>

      {/* 4) 지적재산권 및 명예훼손 관련 */}
      <h3>4) 지적재산권 및 명예훼손 관련</h3>
      <ol type="a" className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
        <li>타인의 저작권, 상표권 등을 침해하는 행위</li>
        <li>허위 사실을 유포하여 회사나 제3자의 명예를 훼손하는 행위</li>
        <li>공공질서 또는 미풍양속에 위배되는 정보를 유포하는 행위</li>
        <li>회사의 운영자, 직원, 관계자, 기타 제3자의 정보를 도용하거나 사칭하는 행위</li>
        <li>회사의 동의 없이 서비스 정보를 변경하거나, 영리 또는 비영리 목적으로 정보를 복제, 출판, 방송 등에 사용하거나 제3자에게 제공하는 행위</li>
        <li>기타 사회 통념상 정상적이지 않은 방법으로 포인트를 적립하는 행위</li>
        <li>타 불법적이거나 부당한 행위</li>
      </ol>

      <p className="mt-8">
        2. 회원은 관계법, 약관과 규정, 운영 정책, 회사의 관련된 공지사항 등을 준수하여야 하며,
        기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
      </p>
      <p className="mt-8">
        3. 회원이 전항의 의무를 위반하여 발생한 손해에 대해 회사는 해당 회원에게 손해배상을 청구할 수 있습니다.
      </p>
      </article>

      <hr className="border-gray-300 dark:border-gray-700 my-8" />

      {/* 제 10 조규정의 준용 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제 10 조규정의 준용</h2>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
          <p>이 약관에 명시되지 않은 사항에 대해서는 관계법령에 의하고, 법에 명시되지 않은 부분에 대하여는 상관례에 의합니다.</p>
        </ol>
      </article>

      {/* 제11 조 개정이력 */}
      <article className="mb-10">
        <h2 className="text-xl font-semibold mb-2">제11 조 개정이력</h2>
        <ol className="list-decimal list-inside space-y-1 leading-relaxed text-sm">
          <p>서비스 이용약관 변경공고일: 2025년 08월 01일</p>
          <p>서비스 이용약관 시행일: 2025년 08월 11일</p>
        </ol>
      </article>
    </section>
  );
}
