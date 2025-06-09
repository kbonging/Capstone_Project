//package com.webcore.platform.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebMvcConfig implements WebMvcConfigurer {
//    @Override
//    public void addViewControllers(ViewControllerRegistry registry) {
//        // /login, /dashboard, /profile 등 특정 단일 경로를 모두 index.html로 포워딩
//        registry.addViewController("/{path}")
//                .setViewName("forward:/index.html");
//
//        // /admin/settings, /user/profile 등 다중 경로를 모두 index.html로 포워딩
//        registry.addViewController("/{path}/**")
//                .setViewName("forward:/index.html");
//         명시적으로 /login도 SPA index.html로 포워딩 (중복이지만 명확하게)
//        registry.addViewController("/login")
//                .setViewName("forward:/index.html");
//    }
//}
