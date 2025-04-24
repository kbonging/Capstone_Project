package com.webcore.platform.security.jwt.filter;

import com.webcore.platform.domain.CustomUser;
import com.webcore.platform.security.jwt.constants.JwtConstants;
import com.webcore.platform.security.jwt.provider.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**         (/login)
 * client -> filter -> server
 * username, password 인증 시도 (attemptAuthentication)
 *      인증 실패 : response > status : 401 (NUATHORIZED)
 *
 *      인증 성공 (successfulAuthentication)
 *      -> JWT 생성
 *      -> response > headers > authorization : (JWT)
 * */
@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider=jwtTokenProvider;
        // 필터 URL 경로 설정 : /login
        setFilterProcessesUrl(JwtConstants.AUTH_LOGIN_URL);
    }

    /**
     * 🔐 인증 시도 메소드
     * : /login 경로로 (username, password) 를 요청하면 이 필터에서 걸려 인증을 시도합니다.
     * ✅ Authentication 인증 시도한 사용자 인증 객체를 반환하여, 시큐리티가 인증 성공 여부를 판단하게 합니다.
     * @param request
     * @param response
     * @return
     * @throws AuthenticationException
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // 여기 클라이언트에서 받아온 값이 memberId, memberPwd 로 바꿔야 할 수도
        String username = request.getParameter("memberId");
        String password = request.getParameter("memberPwd");

        log.info("memberId : {}", username);
        log.info("memberPwd : {}", password);

        // 사용자 인증정보 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, password);

        // 사용자 인증 (로그인)
        authentication = authenticationManager.authenticate(authentication);
      /*
        🔐 authenticate() 인증 처리 프로세스
        1️⃣ 주어진 Authentication 객체에서 사용자의 아이디를 추출합니다.
        2️⃣ UserDetailsService를 사용하여 해당 아이디에 대한 UserDetails 객체를 가져옵니다.
        3️⃣ 가져온 UserDetails 객체에서 저장된 비밀번호를 확인하기 위해 PasswordEncoder를 사용합니다.
        4️⃣ 사용자가 제공한 비밀번호와 저장된 비밀번호가 일치하는지 확인합니다.
        5️⃣ 인증이 성공하면, 새로운 Authentication 객체를 생성하여 반환합니다.
        ✅ 인증 여부를, isAuthenticated() ➡ true 로 확인할 수 있습니다.
     */

        log.info("authenticationManager : {}", authenticationManager);
        log.info("authentication : {}", authentication);
        log.info("인증 여부 : {}", authentication.isAuthenticated());

        // 인증 실패 (username, password 불일치)
        // 이거 필요 없을지도
        if(!authentication.isAuthenticated()){
            log.info("인증 실패 : 아이디 또는 비밀번호가 일치하지 않습니다.");
            response.setStatus(401);   // UNAUTHORIZED (인증 실패)
        }

        return authentication;
    }

    /** 
     * 인증 성공 메서드
     * 
     *  - JWT 을 생성
     *  - JWT 를 응답 헤더에 설정
     * */
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {

        log.info("인증 성공...");

        CustomUser user = (CustomUser) authentication.getPrincipal();
        int memberIdx = user.getMemberDTO().getMemberIdx();
        String memberId = user.getMemberDTO().getMemberId();

        List<String> roles = user.getMemberDTO().getAuthDTOList()
                .stream()
                .map( (auth) -> auth.getAuth()).collect(Collectors.toList());

        // JWT
        String jwt = jwtTokenProvider.createToken(memberIdx, memberId, roles);

        // { Authentication : Bearer + {jwt} }
        response.addHeader(JwtConstants.TOKEN_HEADER, JwtConstants.TOKEN_PREFIX + jwt);
        response.setStatus(200); // 200 > 정상적으로 처리
    }
}
