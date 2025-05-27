package com.webcore.platform.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("")
    public ResponseEntity<?> test(){
        log.info("React 통신 성공 여부");
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}
