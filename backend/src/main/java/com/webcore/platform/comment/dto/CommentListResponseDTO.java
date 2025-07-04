package com.webcore.platform.comment.dto;

import com.webcore.platform.common.dto.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class CommentListResponseDTO extends DefaultDTO {
    /** 댓글 고유번호 */
    private int commentIdx;
    /** 게시글 고유번호 */
    private int communityIdx;
    /** 회원 고유 번호 (FK)*/
    private int memberIdx;
    /** 댓글 내용 */
    private String content;
    /** 댓글 타입 */
    private String commentType;
    /** 작성자 닉네임, 상호명 */
    private String writerName;
    /** 부모 댓글 고유번호 */
    private Integer parentId;
    /** 계층(0:댓글, 1:대댓글, 2:대대댓글) */
    private int depth;
}
