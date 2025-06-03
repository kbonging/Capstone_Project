package com.webcore.platform.response;

import com.webcore.platform.domain.DefaultDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class CommentListResponseDTO extends DefaultDTO {
    private int commentIdx;
    private int communityIdx;
    private String content;
    private String commentType;
    private String writerName;
    private String auth;
    private Integer parentId;
    private int depth;
}
