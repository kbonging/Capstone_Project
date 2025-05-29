package com.webcore.platform.response;

import com.webcore.platform.domain.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class CommunityListResponseDTO extends DefaultDTO {
    /** 커뮤니티 고유번호 (PK) */
    private int communityIdx;
    /** 회원 고유번호 (FK) */
    private int memberIdx;
    /** 공통코드 COMMU_CATE */
    private String categoryId;
    /** 카테고리 이름*/
    private String codeNm;
    /** 제목 */
    private String title;
    /** 내용 */
    private String content;
    /** 조회수 */
    private int viewCount;
    /** 권한 정보 */
    private String auth;
    /** 작성자 (닉네임 or 상호명) */
    private String writerName;
}
