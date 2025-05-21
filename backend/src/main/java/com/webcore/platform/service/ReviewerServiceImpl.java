package com.webcore.platform.service;

import com.webcore.platform.dao.MemberDAO;
import com.webcore.platform.dao.ReviewerDAO;
import com.webcore.platform.domain.MemberAuthDTO;
import com.webcore.platform.domain.ReviewerChannelDTO;
import com.webcore.platform.domain.ReviewerDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewerServiceImpl implements ReviewerService{
    private final MemberDAO memberDAO;
    private final ReviewerDAO reviewerDAO;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public void signupReviewer(ReviewerDTO reviewerDTO) {
        // 비밀번호 암호화
        reviewerDTO.setMemberPwd(passwordEncoder.encode(reviewerDTO.getMemberPwd()));

        // 1. 공통 회원 정보 등록
        memberDAO.insertMember(reviewerDTO);

        // 2. 권한 등록
        MemberAuthDTO memberAuthDTO = new MemberAuthDTO();
        memberAuthDTO.setMemberIdx(reviewerDTO.getMemberIdx());
        memberAuthDTO.setAuth("ROLE_USER");
        memberDAO.insertMemberAuth(memberAuthDTO);

        // 3. 리뷰어 프로필 등록
        reviewerDAO.insertReviewerProfile(reviewerDTO);

        // 💥 예외 강제로 발생시켜 트랜잭션 테스트
//        if (true) {
//            throw new RuntimeException("강제 예외 발생 → 롤백 테스트");
//        }

        // 4. 리뷰어 채널 등록
        if(reviewerDTO.getReviewerChannelList() != null){
            for(ReviewerChannelDTO channel : reviewerDTO.getReviewerChannelList()){
                channel.setMemberIdx(reviewerDTO.getMemberIdx());
                reviewerDAO.insertReviewerChannel(channel);
            }
        }
    }
}
