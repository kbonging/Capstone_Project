package com.webcore.platform.test;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  // application.properties 의 app.upload-dir 값
  @Value("${app.upload-dir}")
  private String uploadDir; // 예: C:/Capstone_Project/backend/src/main/resources/static/img

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 윈도우는 file: 접두어 + 절대경로, 끝에 슬래시 꼭!
    String location = "file:" + (uploadDir.endsWith("/") || uploadDir.endsWith("\\")
        ? uploadDir
        : uploadDir + "/");

    registry.addResourceHandler("/img/**")
        .addResourceLocations(location);
  }
}