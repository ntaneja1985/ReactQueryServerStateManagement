import { useState, useEffect } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query"
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
      mutationFn: (postId) => deletePost(postId),
  })

  const updateMutation = useMutation({
        mutationFn: (postId) => updatePost(postId),
    })

  useEffect(() => {
      if(currentPage < maxPostPage) {
          const nextPage = currentPage + 1;
          queryClient.prefetchQuery({
              query: ["posts", nextPage],
              queryFn: () => fetchPosts(nextPage),
          });
      }
  },[currentPage,queryClient]);

  const {data, isError, isLoading} = useQuery({
      //Defines the data inside the query cache. Always an array
      queryKey: ["posts", currentPage],
      //Function that will run to fetch the data
      queryFn: ()=> fetchPosts(currentPage),
      staleTime: 2000, //2 seconds
  });

  if(isLoading)
  {
      return <h3>Loading...</h3>;
  }
  if(isError)
  {
      return <h3>Error!</h3>;
  }
  return (
    <>
      <ul>
        {data && data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
                deleteMutation.reset()
                updateMutation.reset()
                setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled = {currentPage <= 1} onClick={() => {
            setCurrentPage((previousValue) => previousValue - 1);
        }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled = {currentPage >= maxPostPage} onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1)
        }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} deleteMutation = {deleteMutation} updateMutation={updateMutation} />}
    </>
  );
}
