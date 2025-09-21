package com.webcore.platform.member.dao;

import com.webcore.platform.member.dto.MemberAuthDTO;
import com.webcore.platform.member.dto.MemberDTO;
import com.webcore.platform.member.dto.MemberUpdateDTO;
import com.webcore.platform.reviewer.dto.ReviewerChannelDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MemberDAO {
    /** 로그인 시 정보 조회*/
    MemberDTO selectLoginMemberById(String memberId);
    /** 회원 등록 */
    int insertMember(MemberDTO memberDTO);
    /** 권한 등록 */
    int insertMemberAuth(MemberAuthDTO memberAuthDTO);
    /** 회원 고유번호로 정보 조회 */
    MemberDTO selectMemberByIdx(int memberIdx);
    /** 회원 고유번호로 권한 조회 */
    List<MemberAuthDTO> selectAuthListByMemberIdx(int memberIdx);
    /** 아이디 중복 체크 */
    int countByMemberId(String memberId);
    /** 이메일 중복 체크*/
    int countByMemberEmail(String memberEmail);

    /** 공통 회원 정보 수정 */
    void updateMember(MemberUpdateDTO dto);
}
