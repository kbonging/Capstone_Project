package com.webcore.platform.common.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PagingDTO {
    /** 현재 페이지 (1부터 시작) */
    private int page = 1;
    /** 페이지당 데이터 수 */
    private int size = 10;
    public int getOffset() {
        return (page - 1) * size;
    }
}
