package com.webcore.platform.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class CommentDTO extends DefaultDTO {
    /** 댓글 고유 IDX*/
    private int commentIdx;
    /** 커뮤니티 고유번호(FK)*/
    private int communityIdx;
    /** 회원 고유 번호 (FK)*/
    private int memberIdx;
    /** 댓글 내용 */
    private String content;
    /** 댓글 부모 id */
    private Integer parentId;
    /** 댓글 그룹 id */
    private int groupId;
    /** 계층 */
    private int depth;
    /** 정렬 순서 */
    private int sortOrder;
    /** 댓글 타입 */
    private String commentType;
}
