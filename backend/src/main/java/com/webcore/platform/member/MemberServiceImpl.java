package com.webcore.platform.member;

import com.webcore.platform.constants.AuthRole;
import com.webcore.platform.member.dao.MemberDAO;
import com.webcore.platform.member.dto.MemberAuthDTO;
import com.webcore.platform.owner.OwnerService;
import com.webcore.platform.reviewer.ReviewerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
    private final MemberDAO memberDAO;
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

    @Override
    public boolean checkDuplicateId(String memberId) {
        return memberDAO.countByMemberId(memberId) > 0;
    }

    @Override
    public boolean isEmailExists(String memberEmail) {
        return memberDAO.countByMemberEmail(memberEmail) > 0;
    }

}
