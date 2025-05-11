package com.webcore.platform.config;

import com.webcore.platform.security.custom.CustomUserDetailService;
import com.webcore.platform.security.jwt.filter.JwtAuthenticationFilter;
import com.webcore.platform.security.jwt.filter.JwtRequestFilter;
import com.webcore.platform.security.jwt.provider.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Slf4j
@Configuration
@EnableWebSecurity
// @PreAuthorize, @postAuthorize, @Secured 활성화
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailService customUserDetailService;

    // PasswordEncoder 빈 등록
    // 암호화 알고리즘 방식 : Bcrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager 빈 등록
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        log.info("securityFilterChain...");

        // 폼 기반 로그인 비활성화
        http.formLogin( (login) -> login.disable());

        // HTTP 기본 인증 비활성화
        http.httpBasic((basic) -> basic.disable());

        // CSRF 공격 방어 기능 비활성화
        http.csrf((csrf) -> csrf.disable());

        // 필터 설정
        http.addFilterAt(new JwtAuthenticationFilter(authenticationManager, jwtTokenProvider)
                        , UsernamePasswordAuthenticationFilter.class)

                .addFilterBefore(new JwtRequestFilter(jwtTokenProvider)
                        , UsernamePasswordAuthenticationFilter.class)
        ;

        // 인가 설정
        http.authorizeHttpRequests(authorizeRequests ->
                                    authorizeRequests
                                            .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll() // 정적 자원 허용 (필요 시)
                                            .requestMatchers("/").permitAll()
                                            .requestMatchers("/login").permitAll()

                                            //.requestMatchers("/members/**").permitAll()
                                            .requestMatchers(HttpMethod.POST, "/api/reviewer").permitAll() // 회원가입은 누구나 가능 (POST)
                                            .requestMatchers("/members/**").hasRole("USER") // 회원 가입 제외 모든 경로는 권한 필요

                                            .requestMatchers("/admin/**").hasRole("ADMIN")
                                            .anyRequest().authenticated()
                                    );

        // 인증 방식 설정 (커스텀)
        http.userDetailsService(customUserDetailService);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        this.authenticationManager = authenticationConfiguration.getAuthenticationManager();
        return authenticationManager;
    }


}
