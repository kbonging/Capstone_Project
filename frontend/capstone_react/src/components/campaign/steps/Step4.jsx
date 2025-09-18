import React from "react";

export default function Step4({ formData, setFormData }) {
  return (
    <div className="space-y-6">
      {/* 체험단 미션 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          체험단 미션 *
        </label>
        <textarea
          value={formData.mission}
          onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
          placeholder="예: 매장 방문 후 시식 사진과 함께 상세한 리뷰 작성"
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none"
          rows={5} // 세로 길이 늘림
          required
        />
      </div>

      {/* 키워드 */}
      <div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                키워드 {num} {num === 1 && "*"}
              </label>
              <input
                type="text"
                value={formData[`keyword${num}`]}
                onChange={(e) =>
                  setFormData({ ...formData, [`keyword${num}`]: e.target.value })
                }
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                required={num === 1}
              />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#2A7DD4] mt-1">
          *띄어쓰기까지 반영되므로 명확하게 작성해 주세요<br/>
          *해당 키워드는 리뷰 순위를 체크하는데 활용됩니다
        </p>
      </div>
      {/* 제공 내역 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          제공 내역 *
        </label>
        <p className="text-[11px] text-gray-500 mt-1">
          리뷰어에게 제공할 서비스를 입력해주세요
        </p>
        <textarea
          value={formData.benefitDetail}
          onChange={(e) =>
            setFormData({ ...formData, benefitDetail: e.target.value })
          }
          placeholder="예: 2인 식사권 제공, 음료 포함"
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-none"
          rows={4}
          required
        />
        <p className="text-[11px] text-red-500">
          가격과 품목을 명확히 표기하지 않으면 반려되니 주의하세요
        </p>
      </div>

      {/* 모집 인원 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          체험단 모집 인원 (최대 50명) *
        </label>
        <input
          type="number"
          min={1}
          max={50}
          value={formData.recruitCount}
          onChange={(e) =>
            setFormData({
              ...formData,
              recruitCount: Math.min(
                50,
                parseInt(e.target.value, 10) || 0
              ),
            })
          }
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          required
        />
      </div>

      {/* 일정 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 모집 시작일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            모집 시작일 *
          </label>
          <input
            type="date"
            value={formData.applyStartDate}
            onChange={(e) =>
              setFormData({ ...formData, applyStartDate: e.target.value })
            }
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
        </div>

        {/* 모집 마감일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            모집 마감일 *
          </label>
          <input
            type="date"
            value={formData.applyEndDate}
            onChange={(e) =>
              setFormData({ ...formData, applyEndDate: e.target.value })
            }
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
        </div>

        {/* 체험 시작일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            체험 시작일 *
          </label>
          <input
            type="date"
            value={formData.expStartDate}
            onChange={(e) =>
              setFormData({ ...formData, expStartDate: e.target.value })
            }
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
        </div>

        {/* 체험 종료일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            체험 종료일 *
          </label>
          <input
            type="date"
            value={formData.expEndDate}
            onChange={(e) =>
              setFormData({ ...formData, expEndDate: e.target.value })
            }
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
        </div>

        {/* 발표일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            발표일 *
          </label>
          <input
            type="date"
            value={formData.announceDate}
            onChange={(e) =>
              setFormData({ ...formData, announceDate: e.target.value })
            }
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
        </div>

        {/* 리뷰 작성 마감일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            리뷰 작성 마감일 *
          </label>
          <input
            type="date"
            value={formData.deadlineDate}
            onChange={(e) =>
              setFormData({ ...formData, deadlineDate: e.target.value })
            }
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
        </div>
      </div>
    </div>
  );
}
