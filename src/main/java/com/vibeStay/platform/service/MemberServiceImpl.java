package com.vibeStay.platform.service;

import com.vibeStay.platform.dao.MemberDAO;
import com.vibeStay.platform.domain.MemberAuthDTO;
import com.vibeStay.platform.domain.MemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{
    private final MemberDAO memberDAO;
    private final PasswordEncoder passwordEncoder;

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
            result = memberDAO.insertMemberAuth(memberAuthDTO);
            log.info("회원 권한 등록 성공 등록된 권한 고유번호 : {}", memberAuthDTO.getAuthIdx());
        }

        return result;
    }

    @Override
    public MemberDTO selectMemberById(String memberId) {
        return memberDAO.selectMemberById(memberId);
    }
}
