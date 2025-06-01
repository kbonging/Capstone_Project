package com.webcore.platform.service;

import com.webcore.platform.dao.CommonDAO;
import com.webcore.platform.domain.CmmCodeDTO;
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

}
