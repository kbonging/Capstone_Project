package com.webcore.platform.domain;

import lombok.Getter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@ToString
public class CustomUser implements UserDetails {
    private MemberDTO memberDTO;

    public CustomUser(MemberDTO memberDTO) {
        this.memberDTO = memberDTO;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<MemberAuthDTO> authDTOList = memberDTO.getAuthDTOList(); // MemberAuthDTO(authIdx, memberIdx, auth)


        Collection<SimpleGrantedAuthority> roleList = authDTOList.stream()
                                            .map((auth) -> new SimpleGrantedAuthority(auth.getAuth()))
                                            .collect(Collectors.toList());
        return roleList;
    }

    @Override
    public String getPassword() {
        return memberDTO.getMemberPwd();
    }

    @Override
    public String getUsername() {
        return memberDTO.getMemberId();
    }
}
