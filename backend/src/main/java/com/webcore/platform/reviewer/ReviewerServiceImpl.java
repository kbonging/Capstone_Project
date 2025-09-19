package com.webcore.platform.reviewer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcore.platform.file.FileStorageService;
import com.webcore.platform.member.dao.MemberDAO;
import com.webcore.platform.member.dto.MemberAuthDTO;
import com.webcore.platform.reviewer.dao.ReviewerDAO;
import com.webcore.platform.reviewer.dto.ReviewerCancelDTO;
import com.webcore.platform.reviewer.dto.ReviewerChannelDTO;
import com.webcore.platform.reviewer.dto.ReviewerDTO;
import com.webcore.platform.reviewer.dto.ReviewerRunningCampaignDTO;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewerServiceImpl implements ReviewerService {
    private final MemberDAO memberDAO;
    private final ReviewerDAO reviewerDAO;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;


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

    @Override
    public ReviewerDTO selectReviewerByIdx(int memberIdx) {
        return reviewerDAO.selectReviewerByIdx(memberIdx);
    }


    @Override
    @Transactional(readOnly = true)
    public List<ReviewerRunningCampaignDTO> findRunningCampaignsForReviewer(Integer memberIdx) {
        return reviewerDAO.selectRunningCampaignsForReviewer(memberIdx);
    }



    @Override
    @Transactional
    public void cancelMyApproved(Integer memberIdx, ReviewerCancelDTO dto) {
        // 1) 검증
        if (!"SIMPLE".equals(dto.getType()) && !"NEGOTIATED".equals(dto.getType())) {
            throw new IllegalArgumentException("잘못된 취소 유형입니다.");
        }
        if (dto.getCampaignId() == null) {
            throw new IllegalArgumentException("campaignId는 필수입니다.");
        }
        if ("NEGOTIATED".equals(dto.getType())) {
            if (dto.getReason() == null || dto.getReason().trim().isEmpty()) {
                throw new IllegalArgumentException("협의취소 사유는 필수입니다.");
            }
        }

        // 2) 내 당첨 신청 확인
        ReviewerCancelDTO app = reviewerDAO.findApprovedApplication(memberIdx, dto.getCampaignId());
        if (app == null) {
            throw new IllegalStateException("당첨 상태의 신청을 찾을 수 없습니다.");
        }

        // 3) 이미지 업로드
        List<String> urls = new ArrayList<>();
        if (dto.getImages() != null) {
            for (MultipartFile f : dto.getImages()) {
                if (f == null || f.isEmpty()) continue;
                String url = fileStorageService.storeFile(f, "cancels");
                urls.add(url);
            }
        }

        // 4) 상태 전환
        int updated = reviewerDAO.updateToCanceled(app.getApplicationIdx(), memberIdx);
        if (updated == 0) {
            throw new IllegalStateException("이미 취소되었거나 상태가 유효하지 않습니다.");
        }

        // 5) SIMPLE → penalty +1
        if ("SIMPLE".equals(dto.getType())) {
            reviewerDAO.increaseMemberPenalty(memberIdx);
        }

        // 6) DB 인서트용 값 채우기
        dto.setApplicationIdx(app.getApplicationIdx());
        dto.setMemberIdx(memberIdx);
        try {
            dto.setEvidenceJson(objectMapper.writeValueAsString(urls));
        } catch (Exception e) {
            dto.setEvidenceJson("[]");
        }

        reviewerDAO.insertCancelReviewer(dto);
    }
}
