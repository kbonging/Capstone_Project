package com.webcore.platform.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class CmmCodeDTO extends DefaultDTO{
    /** 코드번호 */
    private String codeId;
    /** 그룹코드 */
    private String groupCode;
    /** 코드이름 */
    private String codeNm;
    /** 이미지경로 */
    private String imageUrl;
    /** 그룹 정렬 순서 */
    private int groupSort;
    /** 정렬 순서 */
    private int sort;
    /** 코드 설명 */
    private String codeDc;

}
