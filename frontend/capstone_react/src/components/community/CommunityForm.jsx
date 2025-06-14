import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import { createPost, updatePost, getCommunityDetail } from "../../api/communityApi";
import { fetchCommonCode } from "../../api/commonApi";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CommunityForm({ mode = "create"}) {
  const { user } = useContext(AppContext);
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { communityIdx } = useParams();
  
  const isEdit = mode === "edit"; // 수정 페이지 유무
  const isAdmin = user?.authDTOList?.some(auth => auth.auth === "ROLE_ADMIN"); // 관리자 유무 확인

  // input에 포커스 주기 위한 ref 추가
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const categoryRef = useRef(null);
  
  // 전송 데이터
  const [formData, setFormData] = useState({
    title: "",
    content:  "",
    categoryId:  "",
  });

  useEffect(()=>{ // 카테고리 DB 조회
    fetchCommonCode('COMMU_CATE')
    .then((data)=>{
      if(!isAdmin){
        data = data.filter((code) => code.codeId !== "COMMU004"); // 관리자가 아닐경우 "공지" 항목을 빼고 노출
      }
      setCategories(data);
    })
    .catch((error) => {
      console.error("공통 코드 조회 실패:", error);
    });
  }, [isAdmin]);

  useEffect(() => {
    if (isEdit && communityIdx) {
      // 수정 모드일 경우 기존 데이터 불러오기
    getCommunityDetail(communityIdx, token)
      .then((res) => {
        console.log(res.data);
        const isPostAuthor = res.data.memberIdx === user.memberIdx;
        if(!isPostAuthor){
          alert("수정 권한이 없습니다.");
          navigate("/community");
        }
        setFormData({
          title: res.data.title,
          content: res.data.content,
          categoryId: res.data.categoryId,
        });
      })
      .catch((err) => {
        console.error("게시글 상세 조회 실패:", err);
      })
      .finally();
    }
  }, [communityIdx, isEdit, token]);


  // 일반 input/select 변경 처리 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ReactQuill 별도 처리 함수
  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      titleRef.current?.focus();
      return;
    }
    
    if (!formData.categoryId) {
      categoryRef.current?.focus();
      return;
    }
    if (!formData.content.trim()) {
      contentRef.current?.focus();
      return;
    }

    try {
      if (isEdit) {
        // 게시글 수정일 경우
        await updatePost(communityIdx, formData, token);
        alert("수정되었습니다.");
        navigate(`/community/${communityIdx}`);
      } else {
        // 게시글 등록일 경우
        await createPost(formData, token);
        alert("등록되었습니다.");
        navigate("/community"); // ✅ 등록 후 커뮤니티 목록으로 이동
      }
    } catch (err) {
      console.error("등록/수정 실패", err);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg  p-6 max-w-3xl mx-auto mt-10"
    >
      <h2 className="text-xl font-bold mb-6">
        {isEdit ? "커뮤니티 글 수정" : "커뮤니티 글 작성"}
      </h2>

      {/* 제목 */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">제목</label>
        <input
          type="text"
          name="title"
          ref={titleRef}
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 "
          placeholder="제목을 입력하세요"
          maxLength={200}
        />
      </div>

      {/* 카테고리 */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">카테고리</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          ref={categoryRef}
          className="w-full px-4 py-2 border border-gray-300 "
        >
        <option value="">선택</option>
        {categories.map((cat) => (
          <option key={cat.codeId} value={cat.codeId}>
            {cat.codeNm}
          </option>
        ))}
        </select>
      </div>

      {/* 내용 (ReactQuill 에디터) */}
      <div className="mb-6 ">
        <label className="block text-gray-700 font-semibold mb-2 ">내용</label>
        <ReactQuill
          ref={contentRef}
          theme="snow"
          value={formData.content}
          onChange={handleContentChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["blockquote", "code-block"],
              ["link", "image"],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "color",
            "background",
            "list",
            "bullet",
            "blockquote",
            "code-block",
            "link",
            "image",
          ]}
          placeholder="내용을 작성하세요"
          style={{ height: "300px", marginBottom: "50px" }}
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate("/community")}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
        >
          커뮤니티로 돌아가기
        </button>

        <div className="space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 font-semibold"
          >
            {isEdit ? "수정하기" : "등록하기"}
          </button>
        </div>
      </div>
    </form>
  );
}
