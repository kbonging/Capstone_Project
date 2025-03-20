package com.vibeStay.platform.controller;

import com.vibeStay.platform.constants.SecurityConstants;
import com.vibeStay.platform.domain.AuthenticationRequest;
import com.vibeStay.platform.prop.JwtProp;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class LoginController {
    private final JwtProp jwtProp;
    // /login

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request){
        String userName = request.getUserName();
        String password = request.getPassword();

        log.info("userName : {}",userName);
        log.info("password : {}", password);

        // 사용자 권한
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_USER");
        roles.add("ROLE_ADMIN");

        // 시크릿 키 -> 바이트
        byte[] signingKey = jwtProp.getSecretKey().getBytes();

        String jwt = Jwts.builder()
//                .signWith( 시크릿 키, 알고리즘)
                .signWith(Keys.hmacShaKeyFor(signingKey), Jwts.SIG.HS512)
                .header()
                .add("typ", SecurityConstants.TOKEN_TYPE)
                .and()
                .expiration(new Date(System.currentTimeMillis() + 1000*60*60*60*24*5))
                .claim("uid", userName)
                .claim("rol", roles)
                .compact();
        log.info("jwt : {}", jwt);

        return new ResponseEntity<String>(jwt, HttpStatus.OK);
    }
}
