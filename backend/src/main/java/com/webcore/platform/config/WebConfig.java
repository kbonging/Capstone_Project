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
    // 윈도우는 file: 접두어 + 절대경로, 끝에 슬래시 꼭!
    String location = "file:" + (uploadDir.endsWith("/") || uploadDir.endsWith("\\")
        ? uploadDir
        : uploadDir + "/");


    //브라우저가 /uploads/thumbnails/xxx.png 로 요청하면
    //addResourceLocations("file:/C:/.../uploads/thumbnails/")
    //→ 여기 폴더에서 해당 파일을 찾아 바로 정적 파일로 응답
    registry.addResourceHandler("/uploads/thumbnails/**")
        .addResourceLocations(Paths.get(uploadDir).toUri().toString());
  }
}