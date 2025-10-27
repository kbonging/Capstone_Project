package com.webcore.platform.chatgateway;

import com.webcore.platform.security.custom.CustomUser;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatGatewayController {

  private final WebClient pythonClient;

  @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public Flux<String> stream(
      @RequestBody Map<String, Object> body,
      @AuthenticationPrincipal CustomUser principal, // 로그인 유저 (null 가능)
      HttpServletRequest request
  ) {
    body.putIfAbsent("top_k", 4);

    if (principal != null && principal.getMemberDTO() != null) {
      // 1) user_id: 정수 PK (memberIdx) 사용
      Integer userId = principal.getMemberDTO().getMemberIdx();
      if (userId != null) {
        body.put("user_id", userId);
      }

      // 2) role: authorities에서 OWNER/REVIEWER 계산
      Set<String> roleSet = principal.getAuthorities().stream()
          .map(GrantedAuthority::getAuthority)           // e.g. "ROLE_OWNER" / "OWNER"
          .filter(Objects::nonNull)
          .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r)
          .map(String::toUpperCase)
          .collect(Collectors.toCollection(LinkedHashSet::new));

      String primaryRole = roleSet.contains("OWNER") ? "OWNER"
          : roleSet.contains("REVIEWER") ? "REVIEWER"
              : roleSet.stream().findFirst().orElse(null);

      if (primaryRole != null) {
        body.put("role", primaryRole);// "OWNER" / "REVIEWER" / 그 외
      }

      // (선택) username도 필요하면
      body.put("username", principal.getUsername());
    }

    // (선택) 클라이언트 JWT를 FastAPI로 전달 (Python에서 검증할 때)
    String auth = request.getHeader("Authorization"); // "Bearer xxx"
    return pythonClient.post()
        .uri("/chat/stream")
        .contentType(MediaType.APPLICATION_JSON)
        .accept(MediaType.TEXT_EVENT_STREAM) // ⬅️ 추가
        .headers(h -> {
          if (auth != null) h.set("X-Forwarded-Authorization", auth);
        })
        .bodyValue(body)
        .retrieve()
        .bodyToFlux(String.class)
        // 원격이 중간에 닫혀도 사용자에게는 부드럽게 종료 신호 전송
        .onErrorResume(reactor.netty.http.client.PrematureCloseException.class, e ->
            Flux.just("data: [ERROR] upstream closed during response\n\n", "data: [DONE]\n\n")
        )
        // 기타 예외도 동일 처리
        .onErrorResume(ex ->
            Flux.just("data: [ERROR] " + ex.getMessage() + "\n\n", "data: [DONE]\n\n")
        );
  }
}
