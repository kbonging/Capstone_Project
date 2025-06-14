package com.webcore.platform.owner;

import com.webcore.platform.member.MemberDAO;
import com.webcore.platform.member.dto.MemberAuthDTO;
import com.webcore.platform.owner.dto.OwnerDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class OwnerServiceImpl implements OwnerService {
    private final PasswordEncoder passwordEncoder;
    private final MemberDAO memberDAO;
    private final OwnerDAO ownerDAO;

    @Transactional
    @Override
    public void signupOwner(OwnerDTO ownerDTO) {
        // 비밀번호 암호화
        ownerDTO.setMemberPwd(passwordEncoder.encode(ownerDTO.getMemberPwd()));

        // 1. 공통 회원 정보 등록
        memberDAO.insertMember(ownerDTO);

        // 2. 권한 등록
        MemberAuthDTO memberAuthDTO = new MemberAuthDTO();
        memberAuthDTO.setMemberIdx(ownerDTO.getMemberIdx());
        memberAuthDTO.setAuth("ROLE_OWNER");
        memberDAO.insertMemberAuth(memberAuthDTO);

        // 3. 소상공인 프로필 등록
        ownerDAO.insertOwnerProfile(ownerDTO);
    }

    @Override
    public OwnerDTO selectOwnerByIdx(int memberIdx) {
        return ownerDAO.selectOwnerByIdx(memberIdx);
    }
}
