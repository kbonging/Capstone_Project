package com.webcore.platform.common;

import com.webcore.platform.common.dao.CommonDAO;
import com.webcore.platform.common.dto.CmmCodeDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommonServiceImpl implements CommonService {
    private final CommonDAO commonDAO;

    @Override
    public List<CmmCodeDTO> selectCmmCodeByGroupCode(String groupCode) {
        return commonDAO.selectCmmCodeByGroupCode(groupCode);
    }

    @Override
    public String getDefaultCode(String groupCode) {
        return commonDAO.selectDefaultCodeByGroup(groupCode);
    }

}
