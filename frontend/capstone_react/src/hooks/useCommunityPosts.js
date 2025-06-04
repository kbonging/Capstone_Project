// import { useInfiniteQuery } from "@tanstack/react-query";
// import { fetchCommunityPosts } from "../api/communityApi";

// export function useCommunityPosts(token, params) {
//   return useInfiniteQuery({
//     queryKey: ["community-post", params],
//     queryFn: ({ pageParam = 1 }) =>
//       fetchCommunityPosts({ token, params, pageParam }),
//     getNextPageParam: (lastPage) => {
//       if (lastPage.page < lastPage.total_pages) {
//         return lastPage.page + 1;
//       }
//       return undefined;
//     },
//     initialPageParam: 1,
//     enabled: !!token,
//   });
// }


// 보류중