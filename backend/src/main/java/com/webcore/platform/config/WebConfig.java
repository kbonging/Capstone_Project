package com.webcore.platform.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  // application.properties에 적어둔 경로 값을 읽어옴
  @Value("${app.upload-dir}")
  private String uploadDir; // 예: C:/Capstone_Project/backend/src/main/resources/static/img

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String normalized = uploadDir.replace("\\", "/");
    if (!normalized.endsWith("/")) normalized += "/";

    String location = "file:///" + normalized; // file:///C:/.../uploads/thumbnails/
    registry.addResourceHandler("/uploads/thumbnails/**")
        .addResourceLocations(location);
  }
}