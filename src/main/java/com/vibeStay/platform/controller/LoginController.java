package com.vibeStay.platform.controller;

import com.vibeStay.platform.constants.SecurityConstants;
import com.vibeStay.platform.domain.AuthenticationRequest;
import com.vibeStay.platform.domain.MemberDTO;
import com.vibeStay.platform.prop.JwtProp;
import com.vibeStay.platform.service.MemberService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class LoginController { // 이거 현재 안씀 !!!!!
    private final JwtProp jwtProp;
    private final MemberService memberService;

    // /login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request){
//        log.info(" request 가져오기 {}", request);
        MemberDTO memberDTO = memberService.selectMemberById(request.getUserId());
        log.info("입력받은 아이디로 회원 정보 조회 - memberDTO : {}", memberDTO);
        String userId = request.getUserId();
        String password = request.getPassword();

        log.info("/login - userId : {}",userId);
        log.info("password : {}", password);

        // 사용자 권한
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_USER");
        roles.add("ROLE_ADMIN");

        // 시크릿 키 -> 바이트
        byte[] signingKey = jwtProp.getSecretKey().getBytes();

        String jwt = Jwts.builder()
//                .signWith( 시크릿 키, 알고리즘)
                .signWith(Keys.hmacShaKeyFor(signingKey), Jwts.SIG.HS512)   // 시그니처 사용할 비밀키, 알고리즘 설정
                .header()                                                   // 헤더 설정
                .add("typ", SecurityConstants.TOKEN_TYPE)               // typ : JWT
                .and()
                .expiration(new Date(System.currentTimeMillis() + 1000*60*60*60*24*5)) // 토큰 만료 시간 설정(5일)
                .claim("uid", userId)             // PAYLOAD - uid : user (사용자 아이디)
                .claim("rol", roles)                // PAYLOAD - rol : [ROLE_USER, ROLE_ADMIN] (권한 정보)
                .compact();                             // 최종적으로 토큰 생성
        log.info("jwt : {}", jwt);

        return new ResponseEntity<String>(jwt, HttpStatus.OK);
    }

    // 토큰 해석
    @GetMapping("/user/info")
    public ResponseEntity<?> userInfo(@RequestHeader(name="Authorization") String header){
        log.info("===header ====");
        log.info("Authorization : {}" , header);

        // Authorization : Bearer ${jwt}
        String jwt = header.replace(SecurityConstants.TOKEN_PREFIX, "");

        byte[] signingKey = jwtProp.getSecretKey().getBytes();

        // 토큰 해석
        Jws<Claims> parsedToken = Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(signingKey))
                .build()
                .parseSignedClaims(jwt);

        log.info("parsedToken : {}", parsedToken);

        // uid : user
        String userId = parsedToken.getPayload().get("uid").toString();
        log.info("/user/info - userId : {}", userId);

        // rol : [ROLE_USER, ROLE_ADMIN]
        Claims claims = parsedToken.getPayload();
        Object roles = claims.get("rol");
        log.info("roles : {}", roles);

        return new ResponseEntity<String>(parsedToken.toString(), HttpStatus.OK);
    }

    @PostMapping("/test")
    public ResponseEntity<?>  test(@RequestBody MemberDTO memberDTO, HttpServletRequest request){
        log.info("test memberDTO {}", memberDTO);
        memberService.login(memberDTO, request);

        return new ResponseEntity<String>("성공", HttpStatus.OK);
    }
}
