package com.webcore.platform.file;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {
    private static final String BASE_DIR = "uploads";

    /**
     * 파일 저장 (공통 메서드)
     * @param file 업로드할 파일
     * @param subDir 저장할 하위 디렉토리 (예: "thumbnails", "profiles")
     * @return 저장된 파일의 접근 경로
     */
    public String storeFile(MultipartFile file, String subDir) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String uploadDir = BASE_DIR + "/" + subDir + "/";
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            Files.createDirectories(filePath.getParent()); // 디렉토리 생성
            Files.write(filePath, file.getBytes());        // 파일 저장

            return "/uploads/" + subDir + "/" + fileName; // URL 반환

        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패: " + e.getMessage(), e);
        }
    }

}
