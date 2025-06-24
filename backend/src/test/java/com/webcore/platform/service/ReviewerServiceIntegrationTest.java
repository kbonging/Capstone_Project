package com.webcore.platform.service;

import com.webcore.platform.reviewer.dto.ReviewerChannelDTO;
import com.webcore.platform.reviewer.dto.ReviewerDTO;
import com.webcore.platform.reviewer.ReviewerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional  // 이 어노테이션이 테스트 종료 시 자동 롤백을 수행함
class ReviewerServiceIntegrationTest {

    @Autowired
    private ReviewerService reviewerService;

    @Test
    void signupReviewer_정상등록_롤백확인() {
        // given: 테스트용 데이터 생성
        ReviewerDTO dto = new ReviewerDTO();
        String uniqueId = "test_" + System.currentTimeMillis();
        dto.setMemberId(uniqueId);
        dto.setMemberPwd("testPwd123!");
        dto.setMemberName("홍길동");
        dto.setMemberEmail("test03@example.com");
        dto.setMemberPhone("010-0000-0000");
        dto.setGender("M");
        dto.setBirthDate("1990-01-01");

        // 리뷰어 채널 리스트 추가
        ReviewerChannelDTO channel1 = new ReviewerChannelDTO();
        channel1.setInfTypeCodeId("INF001");
        channel1.setChannelUrl("https://blog.naver.com/test03");

        dto.setReviewerChannelList(List.of(channel1));

        // when: 서비스 호출
        reviewerService.signupReviewer(dto);

        // then: memberIdx가 세팅되었는지 (MyBatis insert 시 useGeneratedKeys="true" 사용 전제)
        assertThat(dto.getMemberIdx()).isGreaterThan(0);
    }

    @Test
    void signupReviewer_중복아이디_예외발생_트랜잭션롤백() {
        // given: 동일한 아이디로 두 번 등록
        ReviewerDTO dto1 = new ReviewerDTO();
        dto1.setMemberId("dup01");
        dto1.setMemberPwd("pass1234!");
        dto1.setMemberName("테스터");
        dto1.setMemberEmail("dup@example.com");
        dto1.setMemberPhone("010-1111-1111");

        reviewerService.signupReviewer(dto1); // 첫 등록은 성공

        ReviewerDTO dto2 = new ReviewerDTO();
        dto2.setMemberId("dup01");  // 같은 아이디
        dto2.setMemberPwd("pass9999!");
        dto2.setMemberName("중복유저");
        dto2.setMemberEmail("dup2@example.com");
        dto2.setMemberPhone("010-2222-2222");

        // when & then: 예외 발생 확인 (Unique 제약 조건)
        org.junit.jupiter.api.Assertions.assertThrows(Exception.class, () -> {
            reviewerService.signupReviewer(dto2);
        });

        // 이후에도 @Transactional 덕분에 실제 DB에는 저장되지 않음 (롤백)
    }
}
