package com.webcore.platform.common.dao;

import com.webcore.platform.common.dto.CmmCodeDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommonDAO {
    /** 그룹 코드로 공통코드 목록 조회*/
    List<CmmCodeDTO> selectCmmCodeByGroupCode(String groupCode);

    /**
     * 특정 그룹 코드에서 기본값(Code ID)을 조회
     * <p>
     * 기본값 기준: SORT 컬럼 오름차순의 첫 번째 항목
     * 삭제 여부(del_yn)가 'N'인 항목만 조회
     *
     * @param groupCode 조회할 공통코드 그룹 코드 (예: "CAM_STA", "REC_STA")
     * @return 해당 그룹의 기본 코드 ID (예: "PENDING", "OPEN")
     */
    String selectDefaultCodeByGroup(String groupCode);
}
