package com.webcore.platform.service;

import com.webcore.platform.constants.AuthRole;
import com.webcore.platform.dao.MemberDAO;
import com.webcore.platform.domain.MemberAuthDTO;
import com.webcore.platform.domain.MemberDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{
    private final MemberDAO memberDAO;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final ReviewerService reviewerService;
    private final OwnerService ownerService;

    @Override
    public Object loadUserInfoByMemberIdx(int memberIdx, List<MemberAuthDTO> authList) {
        if(authList.stream().anyMatch(auth -> AuthRole.ADMIN.equals(auth.getAuth()))){
            return memberDAO.selectMemberById(memberIdx);
        }
        if (authList.stream().anyMatch(auth -> AuthRole.REVIEWER.equals(auth.getAuth()))) {
            return reviewerService.selectReviewerByIdx(memberIdx);
        }
        if (authList.stream().anyMatch(auth -> AuthRole.OWNER.equals(auth.getAuth()))) {
            return ownerService.selectOwnerByIdx(memberIdx);
        }
        return null;
    }

}
