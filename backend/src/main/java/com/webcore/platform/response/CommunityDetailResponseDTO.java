package com.webcore.platform.response;

import com.webcore.platform.domain.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class CommunityDetailResponseDTO extends DefaultDTO {
    /** 커뮤니티 고유번호 */
    private int communityIdx;
    /** 작성자 고유번호 */
    private int memberIdx;
    /** 카테고리 고유코드 */
    private String categoryId;
    /** 카테고리 이름 */
    private String categoryName;
    /** 게시글 제목 */
    private String title;
    /** 게시글 내용 */
    private String content;
    /** 게시글 조회수 */
    private int viewCount;
    /** 게시글 좋아요 */
    private int likeCount;
    /** 사용자의 좋아요 유무*/
    private int likeByMe;
    /** 작성자 권한 */
    private String auth;
    /** 작성자 닉네임, 상호명 */
    private String writerName;
}
