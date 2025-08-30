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
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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

        http.cors(Customizer.withDefaults());

        // 필터 설정
        http.addFilterAt(new JwtAuthenticationFilter(authenticationManager, jwtTokenProvider)
                        , UsernamePasswordAuthenticationFilter.class)

                .addFilterBefore(new JwtRequestFilter(jwtTokenProvider)
                        , UsernamePasswordAuthenticationFilter.class);


        // 인가 설정
        http.authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                        .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll() // 정적 자원 허용 (필요 시)
                        .requestMatchers("/").permitAll()
                        //.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // 이게 없으면 OPTIONS가 막힙니다 (필요없을 수도)
                        //.requestMatchers(HttpMethod.GET, "/login").permitAll()
                        //테스트 이미지 업로드 때문에 허용
                        .requestMatchers("/img/**", "/uploads/**").permitAll()
                        //인증된 사용자만 사진등록 가능 api풀어줘야함
                        .requestMatchers(HttpMethod.POST, "/api/members/*/profile-image").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/login").permitAll()
                        .requestMatchers("/index.html").permitAll()

                        // 테스트 설정
                        .requestMatchers("/api/test").permitAll()

                        // 공통(common)
                        .requestMatchers( "/api/common/**").permitAll()

                        // 회원(members)
                        .requestMatchers("/api/members/check-id/**").permitAll() // 아이디 중복 체크

                        // 이메일(emails)
                        .requestMatchers( "/api/emails/**").permitAll()

                        // 리뷰어
                        .requestMatchers(HttpMethod.POST, "/api/reviewer").permitAll() // 리뷰어 회원가입은 누구나 가능 (POST)
                        .requestMatchers("/api/reviewer", "/api/reviewer/**").hasRole("USER") // 회원 가입 제외 모든 경로는 권한 필요

                        // 소상공인
                        .requestMatchers(HttpMethod.POST, "/api/owner").permitAll() // 소상공인 회원가입은 누구나 가능 (POST)
                        .requestMatchers("/api/owner", "/api/owner/**").hasRole("OWNER") // 회원 가입 제외 모든 경로는 권한 필요

                        //켐페인 상세 페이지
                        .requestMatchers(HttpMethod.GET, "/api/campaigns/**").permitAll()

                        // 커뮤니티
                        .requestMatchers("/api/community", "/api/community/**") // 커뮤니티 모든 경로는 권한 필요
                        .hasAnyRole("USER", "OWNER", "ADMIN")

                        .requestMatchers("/api/comments", "/api/comments/**")// 댓글 경로는 권한 필요
                        .hasAnyRole("USER", "OWNER", "ADMIN")

                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated() // 모든 요청은 인증된 사용자만 접근 가능하다.
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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // React dev 서버 주소
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        //config.setExposedHeaders(List.of("Authorization"));// (필요없을 수도)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
