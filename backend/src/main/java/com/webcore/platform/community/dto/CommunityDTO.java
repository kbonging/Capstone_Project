package com.webcore.platform.community.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class CommunityDTO extends DefaultDTO {
    /** 커뮤니티 고유번호 (PK) */
    private int communityIdx;
    /** 회원 고유번호 (FK) */
    private int memberIdx;
    /** 공통코드 COMMU_CATE */
    private String categoryId;
    /** 제목 */
    private String title;
    /** 내용 */
    private String content;
    /** 조회수 */
    private int viewCount;

    /** 내 글만 보기 여부 (true or "")*/
    private String showMycommunitiesParam;
}
