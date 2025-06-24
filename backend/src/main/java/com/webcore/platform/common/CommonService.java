package com.webcore.platform.common;

import com.webcore.platform.common.dto.CmmCodeDTO;

import java.util.List;

public interface CommonService {
    /** 그룹 코드로 공통코드 목록 조회*/
    List<CmmCodeDTO> selectCmmCodeByGroupCode(String groupCode);
}
