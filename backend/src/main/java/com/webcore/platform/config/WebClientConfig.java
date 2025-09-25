package com.webcore.platform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;


@Configuration
public class WebClientConfig {

  @Bean
  public WebClient pythonClient() {
    return WebClient.builder()
        .baseUrl("http://localhost:8000") // 파이썬 FastAPI 서버 주소
        .build();
  }
}
