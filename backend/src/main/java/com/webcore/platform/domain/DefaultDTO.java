package com.webcore.platform.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class DefaultDTO {
    /** 검색조건 */
    private String searchCondition;
    /** 검색Keyword */
    private String searchKeyword;
    /** 등록일 */
    private String regDate;
    /** 수정일 */
    private String modDate;
    /** 삭제여부 */
    private String delYn;

    /** 페이징: 시작 인덱스 */
    private int start;
    /** 페이징: 조회 개수 */
    private int end;
}
