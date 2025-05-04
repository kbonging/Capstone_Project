package com.webcore.platform.security.custom;

import com.webcore.platform.dao.MemberDAO;
import com.webcore.platform.domain.CustomUser;
import com.webcore.platform.domain.MemberDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final MemberDAO memberDAO;

    @Override
    public UserDetails loadUserByUsername(String username) {
        log.info("login - loadUserByUsername : {}", username);

        MemberDTO memberDTO = memberDAO.selectMemberById(username);

        if(memberDTO == null){
            log.info("사용자 없음... (일치하는 아이디가 없음)");
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다. : " + username);
        }

        log.info("user : ");
        log.info(memberDTO.toString());

        // MemberDTO -> CustomUser
        CustomUser customUser = new CustomUser(memberDTO);

        log.info("customUser : ");
        log.info(customUser.toString());

        return customUser;
    }
}
