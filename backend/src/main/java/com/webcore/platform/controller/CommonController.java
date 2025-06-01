package com.webcore.platform.controller;

import com.webcore.platform.domain.CmmCodeDTO;
import com.webcore.platform.service.CommonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/common")
public class CommonController {
    private final CommonService commonService;

    /** 그룹코드로 공통코드 목록 조회*/
    @GetMapping("/{groupCode}")
    public ResponseEntity<?> getCommonCodeList(@PathVariable String groupCode){
        log.info("/api/common/{}", groupCode);
        List<CmmCodeDTO> cmmCodeDTOList = commonService.selectCmmCodeByGroupCode(groupCode);
        log.info("cmmCodeDTOList : {}", cmmCodeDTOList);

        return new ResponseEntity<>(cmmCodeDTOList, HttpStatus.OK);
    }
}
