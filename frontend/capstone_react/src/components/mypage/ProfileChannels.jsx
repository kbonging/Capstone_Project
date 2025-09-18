import React from "react";

export default function ProfileChannels({ user, platformList }) {
  if (!user) return null;

  return (
    <div className="flex justify-center gap-12">
      {platformList.map((platform) => {
        const channel = user.reviewerChannelList?.find(
          (c) => c.infTypeCodeId === platform.code_id
        );
        const isRegistered = !!channel?.channelUrl;

        return (
          <div
            key={platform.code_id}
            className="flex flex-col items-center text-center"
          >
            <img
              src={platform.image_url}
              alt={platform.code_nm}
              className={`w-5 h-5 ${isRegistered ? "" : "opacity-40"}`}
            />
            {isRegistered ? (
              <a
                href={channel.channelUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm mt-2 text-gray-700 font-semibold"
              >
                등록 완료
              </a>
            ) : (
              <span className="text-sm mt-2 text-gray-400">미등록</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
