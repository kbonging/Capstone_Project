package com.webcore.platform.service;

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

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{
    private final MemberDAO memberDAO;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public int insertMember(MemberDTO memberDTO) {
        // 비밀번호 암호화
        String memberPwd = memberDTO.getMemberPwd();
        String encodedPwd = passwordEncoder.encode(memberPwd);
        memberDTO.setMemberPwd(encodedPwd);

        // 회원 등록
        int result = memberDAO.insertMember(memberDTO);

        if(result > 0){
            MemberAuthDTO memberAuthDTO = new MemberAuthDTO();
            log.info("회원 등록 처리 성공!! 등록된 회원 고유번호 : {}", memberDTO.getMemberIdx());
            memberAuthDTO.setMemberIdx(memberDTO.getMemberIdx());
            memberAuthDTO.setAuth("ROLE_USER");

            // 권한 등록
            result = memberDAO.insertMemberAuth(memberAuthDTO);
            log.info("회원 권한 등록 성공 등록된 권한 고유번호 : {}", memberAuthDTO.getAuthIdx());
        }

        return result;
    }

    // 이거 현재 안씀
    @Override
    public void login(MemberDTO memberDTO, HttpServletRequest request) {
        String username = memberDTO.getMemberId();
        String password = memberDTO.getMemberPwd();
        log.info("로그인 요청 시 - username : {}", username);
        log.info("로그인 요청 시 - password : {}", password);

        // AuthenticationManager
        // 아이디, 패스워드 인증 토큰 생성
        UsernamePasswordAuthenticationToken token
                = new UsernamePasswordAuthenticationToken(username, password);
        
        // 토큰에 요청 정보 등록
        token.setDetails(new WebAuthenticationDetails(request));

        // 토큰을 이용하여 인증 요청 - 로그인
        Authentication authentication = authenticationManager.authenticate(token);

        log.info("인증 여부 : {}", authentication.isAuthenticated());

        User authUser = (User) authentication.getPrincipal();
        log.info("인증된 사용자 아이디 : {}", authUser.getUsername());

        // 시큐리티 컨텍스트에 인증된 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Override
    public MemberDTO selectMemberById(String memberId) {
        return memberDAO.selectMemberById(memberId);
    }
}
