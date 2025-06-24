package com.webcore.platform.common.dao;

import com.webcore.platform.common.dto.CmmCodeDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommonDAO {
    /** 그룹 코드로 공통코드 목록 조회*/
    List<CmmCodeDTO> selectCmmCodeByGroupCode(String groupCode);
}
