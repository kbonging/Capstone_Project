package com.webcore.platform.config;

import java.time.Duration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import io.netty.channel.ChannelOption;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.ProxyProvider;

@Configuration
public class WebClientConfig {

  @Bean
  public WebClient pythonClient() {
    // Netty HTTP 클라이언트 구성
    HttpClient httpClient = HttpClient.create()
        .keepAlive(true)
        // 커넥션/읽기 타임아웃을 여유있게 (SSE는 길게 열림)
        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 15_000)
        // responseTimeout은 "첫 바이트까지 대기" 시간. SSE면 넉넉히.
        .responseTimeout(Duration.ofMinutes(10));

    // (옵션) 프록시가 있다면 설정
    // .proxy(typeSpec -> typeSpec.type(ProxyProvider.Proxy.HTTP).host("proxy.host").port(8080))

    // (옵션) 코덱 버퍼 사이즈 상향 (대용량 JSON 대비. SSE엔 필수는 아님)
    ExchangeStrategies strategies = ExchangeStrategies.builder()
        .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(16 * 1024 * 1024)) // 16MB
        .build();

    return WebClient.builder()
        .baseUrl("http://localhost:8000")
        .clientConnector(new ReactorClientHttpConnector(httpClient))
        .exchangeStrategies(strategies)
        // (옵션) 기본 Accept 지정 — 컨트롤러에서 .accept(TEXT_EVENT_STREAM) 쓰면 생략 가능
        // .defaultHeaders(h -> h.setAccept(List.of(MediaType.TEXT_EVENT_STREAM)))
        .build();
  }
}
