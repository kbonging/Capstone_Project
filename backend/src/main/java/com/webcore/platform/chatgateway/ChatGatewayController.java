package com.webcore.platform.chatgateway;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
      @AuthenticationPrincipal Object CustomUser// JWT 쓰면 CustomUser로 교체
  ) {

    body.putIfAbsent("top_k", 4);

    return pythonClient.post()
        .uri("/chat/stream")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(body)
        .retrieve()
        .bodyToFlux(String.class);
  }
}
