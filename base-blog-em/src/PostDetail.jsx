import { fetchComments } from "./api";
import "./PostDetail.css";
import {useQuery} from "@tanstack/react-query";

export function PostDetail({ post, deleteMutation, updateMutation }) {
  const {data,isLoading,isError, error } = useQuery({
      queryKey: ["comments",post.id],
      queryFn: ()=> fetchComments(post.id),
  })

    if(isLoading) {
        return(
            <div>Loading...</div>
        )
    }

    if(isError)
    {
        return <h3>Error!</h3>;
    }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={()=>deleteMutation.mutate(post.id)}>
            Delete
        </button>
          {deleteMutation.isPending && (
              <p className="loading">Deleting the Post</p>
          )}
          {deleteMutation.isError && (
              <p className="error">Error Deleting the Post: {deleteMutation.error.toString()}</p>
          )}
          {deleteMutation.isSuccess && (
              <p className="success">Post was Deleted</p>
          )}
      </div>
        <div>
          <button onClick={()=>updateMutation.mutate(post.id)}>
              Update title
          </button>
            {updateMutation.isPending && (
                <p className="loading">Updating the Post</p>
            )}
            {updateMutation.isError && (
                <p className="error">Error Updating the Post: {updateMutation.error.toString()}</p>
            )}
            {updateMutation.isSuccess && (
                <p className="success">Post was Updated</p>
            )}
        </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data && data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
