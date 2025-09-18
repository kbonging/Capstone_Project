package com.webcore.platform.file;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    /**
     * 업로드 기본 경로를 application.properties에서 읽어옵니다.
     * 예: app.upload-dir=${user.dir}/backend/uploads
     */
    @Value("${app.upload-dir}")
    private String baseDir;

    /**
     * 파일 저장 (공통 메서드)
     * @param file 업로드할 파일
     * @param subDir 저장할 하위 디렉토리 (예: "thumbnails", "profiles")
     * @return 저장된 파일의 접근 경로 (웹에서 접근 가능한 URL)
     */
    public String storeFile(MultipartFile file, String subDir) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // 실제 파일 저장 경로
            Path uploadPath = Paths.get(baseDir, subDir);
            Files.createDirectories(uploadPath); // 디렉토리 없으면 생성

            // 저장할 파일명 (중복 방지)
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // 파일 저장
            Files.write(filePath, file.getBytes());

            // 반환할 URL (필요에 따라 조정)
            return "/uploads/" + subDir + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패: " + e.getMessage(), e);
        }
    }
}
