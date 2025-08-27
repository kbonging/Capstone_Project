// src/pages/ImageUploadTest.jsx
import { useEffect, useState } from "react";

// .env 에 VITE_API_BASE=http://localhost:8080 설정해두면 절대경로로 보정됨
const API_BASE = import.meta.env.VITE_API_BASE || "";

// 백엔드가 "/img?/..." 같은 잘못된 경로를 주는 경우 보정
function normalizeUrl(u) {
  if (!u) return "";
  let s = String(u).trim();

  // "/img?/" → "/img/" , "/uploads?/" → "/uploads/"
  s = s.replace("/img?/", "/img/").replace("/uploads?/", "/uploads/");
  // "/img?2025..." → "/img/2025..." 같은 케이스
  s = s.replace("/img?", "/img").replace("/uploads?", "/uploads");

  // 이미 절대 URL이면 그대로
  if (/^https?:\/\//i.test(s)) return s;

  // API_BASE가 있으면 절대경로로 변환
  return API_BASE ? `${API_BASE}${s.startsWith("/") ? s : `/${s}`}` : s;
}

export default function ImageUploadTest() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);

    if (!f) {
      setPreview("");
      return;
    }

    // 클라이언트 단 간단 검증 (선택)
    const ok = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!ok.includes(f.type)) {
      alert("JPG/PNG/GIF/WEBP만 업로드할 수 있어요.");
      e.target.value = "";
      setFile(null);
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      alert("최대 10MB까지 업로드할 수 있어요.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("파일을 선택하세요!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다. (토큰 없음)");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      // TODO: memberIdx는 실제 로그인 사용자의 ID로 교체
      const res = await fetch(`/api/members/7/profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`업로드 실패 (${res.status}) ${text}`);
      }

      // 서버 응답 예: { "url": "/img?/20250827/uuid.jpeg" }
      const data = await res.json();
      const fixed = normalizeUrl(data?.url);
      setUploadedUrl(fixed);
      alert("업로드 성공!");
    } catch (err) {
      console.error(err);
      alert(err.message || "업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      {/* 파일 선택 */}
      <div>
        <label className="block text-sm mb-1">프로필 사진</label>
        <label
          htmlFor="profileImage"
          className="cursor-pointer block border-dashed border-2 border-gray-300 rounded p-6 text-center text-sm text-gray-500 hover:bg-gray-50"
        >
          이미지 업로드 영역 (JPG, PNG 최대 10MB)
          <br />
          <span className="text-blue-500 underline">클릭해서 파일 선택</span>
        </label>
        <input
          id="profileImage"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      {/* 로컬 미리보기 */}
      {preview && (
        <div>
          <p className="text-sm text-gray-500">로컬 미리보기</p>
          <img
            src={preview}
            alt="preview"
            className="mt-2 w-40 h-40 object-cover rounded border"
          />
        </div>
      )}

      {/* 업로드 버튼 */}
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "업로드 중..." : "업로드"}
      </button>

      {/* 서버 업로드된 이미지 */}
      {uploadedUrl && (
        <div>
          <p className="text-sm text-gray-500">서버 저장 이미지</p>
          <img
            src={uploadedUrl}
            alt="uploaded"
            className="mt-2 w-40 h-40 object-cover rounded border"
          />
          <div className="text-xs text-gray-400 break-all">{uploadedUrl}</div>
        </div>
      )}
    </div>
  );
}
