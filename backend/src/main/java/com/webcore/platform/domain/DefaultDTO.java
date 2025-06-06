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

    /** 현재 페이지 번호 (기본 1)*/
    private int page = 1;
    /** 조회 시작 인덱스 */
    private int firstIndex;
    /** 한 페이지당 조회 레코드 수 */
    private int recordCount;
}
