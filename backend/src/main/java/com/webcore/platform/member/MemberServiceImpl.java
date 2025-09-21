package com.webcore.platform.member;

import com.webcore.platform.constants.AuthRole;
import com.webcore.platform.member.dao.MemberDAO;
import com.webcore.platform.member.dto.MemberAuthDTO;
import com.webcore.platform.member.dto.MemberUpdateDTO;
import com.webcore.platform.owner.OwnerService;
import com.webcore.platform.owner.dao.OwnerDAO;
import com.webcore.platform.reviewer.ReviewerService;
import com.webcore.platform.reviewer.dao.ReviewerDAO;
import com.webcore.platform.reviewer.dto.ReviewerChannelDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberDAO memberDAO;
    private final ReviewerDAO reviewerDAO;
    private final OwnerDAO ownerDAO;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final ReviewerService reviewerService;
    private final OwnerService ownerService;

    @Override
    public Object loadUserInfoByMemberIdx(int memberIdx, List<MemberAuthDTO> authList) {
        if(authList.stream().anyMatch(auth -> AuthRole.ADMIN.equals(auth.getAuth()))){
            return memberDAO.selectMemberByIdx(memberIdx);
        }
        if (authList.stream().anyMatch(auth -> AuthRole.REVIEWER.equals(auth.getAuth()))) {
            return reviewerService.selectReviewerByIdx(memberIdx);
        }
        if (authList.stream().anyMatch(auth -> AuthRole.OWNER.equals(auth.getAuth()))) {
            return ownerService.selectOwnerByIdx(memberIdx);
        }
        return null;
    }

    /** memberIdx로 권한 확인 */
    @Override
    public List<MemberAuthDTO> getAuthListByMemberIdx(int memberIdx) {
        return memberDAO.selectAuthListByMemberIdx(memberIdx);
    }

    @Override
    public boolean checkDuplicateId(String memberId) {
        return memberDAO.countByMemberId(memberId) > 0;
    }

    @Override
    public boolean isEmailExists(String memberEmail) {
        return memberDAO.countByMemberEmail(memberEmail) > 0;
    }

    /** 회원 정보 수정 */
    @Transactional
    @Override
    public void updateMember(MemberUpdateDTO memberUpdateDTO, String role) {
        // 회원 기본 정보
        memberDAO.updateMember(memberUpdateDTO);

        if ("ROLE_USER".equals(role)) {
            // 리뷰어 프로필
            reviewerDAO.updateReviewerProfile(memberUpdateDTO);

            // 리뷰어 채널
            List<ReviewerChannelDTO> channelList = memberUpdateDTO.getReviewerChannelList();
            log.info("리뷰어 채널 리스트 크기: {}", channelList != null ? channelList.size() : 0);

            if (channelList != null) {
                for (ReviewerChannelDTO ch : channelList) {
                    log.info("채널 DTO: memberIdx={}, infTypeCodeId={}, channelUrl={}",
                            ch.getMemberIdx(), ch.getInfTypeCodeId(), ch.getChannelUrl());
                    ch.setMemberIdx(memberUpdateDTO.getMemberIdx());
                    reviewerDAO.upsertReviewerChannel(ch);
                }
            }
        } else if ("ROLE_OWNER".equals(role)) {
            // 소상공인 프로필
            ownerDAO.updateOwnerProfile(memberUpdateDTO);
        }
    }

}
