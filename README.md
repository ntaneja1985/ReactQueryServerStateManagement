# React Query/TanStack Query: React Server State Management
- React Query is a library that manages server state for our React App
- ![img_1.png](img_1.png)

### What problem does React Query solve?
- ![img_2.png](img_2.png)
- ![img_3.png](img_3.png)
- ![img_4.png](img_4.png)
- React Query maintains Loading/Error States
- It gives us tools for Pagination/infinite scroll
- We can pre-fetch data, put it in the cache and then if the user wants data, it can get from the cache
- React Query can also manage mutations or updating the data from the server
- React Query can help in de-duplication of requests
- It also supports Retry on Error
- It also provides callbacks so that we can take actions of query is successful, or it resulted in an error
- ![img_5.png](img_5.png)
- ![img_6.png](img_6.png)

### First project
- ![img_7.png](img_7.png)
- ![img_8.png](img_8.png)
- ![img_9.png](img_9.png)

### Getting started
- Install React-Query
```shell
npm install @tanstack/react-query
```
- Create a query client(which will manage queries and cache)\
- We will apply a Query Provider which provides client config and cache to the children
- It also takes the query client as the value
- Call useQuery() to fetch data from the server

### Adding a Query Client and Provider
- ![img_10.png](img_10.png)
- Add the following code to App.jsx to add the query client and query client provider
```jsx
import { Posts } from "./Posts";
import "./App.css";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    // provide React Query client to App
      <QueryClientProvider client={queryClient}>
    <div className="App">
      <h1>Blog &apos;em Ipsum</h1>
      <Posts />
    </div>
      </QueryClientProvider>
  );
}

export default App;

```
- The data we will get from the server looks like this
- ![img_11.png](img_11.png)
- To use ReactQuery use the following code:
```jsx
import {useQuery} from "@tanstack/react-query"
const {data} = useQuery({
    //Defines the data inside the query cache. Always an array
    queryKey: ["posts"],
    //Function that will run to fetch the data
    queryFn: fetchPosts,
});
return (
    <>
        <ul>
            {data.map((post) => (
                <li
                    key={post.id}
                    className="post-title"
                    onClick={() => setSelectedPost(post)}
                >
                    {post.title}
                </li>
            ))}
        </ul>
    </>
);
```
- Note that fetchPosts is an async function and it will take some time to return data
- So we need to do this
```jsx
 // replace with useQuery
const {data} = useQuery({
    //Defines the data inside the query cache. Always an array
    queryKey: ["posts"],
    //Function that will run to fetch the data
    queryFn: fetchPosts,
});

if(!data)
{
    return <div>Loading...</div>;
}
return (
    <>
        <ul>
            {data && data.map((post) => (
                <li
                    key={post.id}
                    className="post-title"
                    onClick={() => setSelectedPost(post)}
                >
                    {post.title}
                </li>
            ))}
        </ul>
</>
)
```

### Handling Loading and Error States
- ![img_12.png](img_12.png)
- We can make changes as follows to use isLoading and isError
```jsx
const {data, isError, isLoading} = useQuery({
    //Defines the data inside the query cache. Always an array
    queryKey: ["posts"],
    //Function that will run to fetch the data
    queryFn: fetchPosts,
});

if(isLoading)
{
    return <h3>Loading...</h3>;
}
```
### Difference between isLoading and isFetching and isError
- isFetching means the async query hasnt resolved
- isLoading is a subset of that. It means we have noCachedData and data isFetching
- isError means something went wrong
```jsx
if(isError)
  {
      return <h3>Error!</h3>;
  }
```
- Notice that React-Query tries to fetch the data minimum 3 times before it errors out
- This is configurable though
- ![img_13.png](img_13.png)

### Using React-Query Dev Tools
- It shows status of all of our queries and last updated timestamp
- It also has a data-explorer to view data returned by query
- It has a query explorer also where we can see the queries
- DEV_TOOLs are not included in production
- It looks at process.env.NODE_ENV === 'development'
- Include them in App.jsx as follows:
```jsx
import { Posts } from "./Posts";
import "./App.css";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
    return (
        // provide React Query client to App
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <h1>Blog &apos;em Ipsum</h1>
                <Posts />
            </div>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}

export default App;

```
- ![img_14.png](img_14.png)

### What are stale queries?
- Stale data is data that is expired and is ready to be re-fetched
- Data is still in the cache though
- Stale means that Data is stale while revalidating
- This means show this stale data till we get the latest data from server to show latest data
- Data refetch only triggers when data is stale
- Data refetch is also triggered if the component remounts or browser window refocuses
- StaleTime is the maxAge means how much are we willing to tolerate the data being out of date
```jsx
const {data, isError, isLoading} = useQuery({
    //Defines the data inside the query cache. Always an array
    queryKey: ["posts"],
    //Function that will run to fetch the data
    queryFn: fetchPosts,
    staleTime: 2000, //2 seconds
});
```
- Please note data needs to be stale, for refetch triggers to be triggered
- ![img_15.png](img_15.png)
- By defaulting to stateTime of 0, we are always assuming data is out of date, and it needs to be refetched from the server
- That makes it much less likely that we will have out of date data on the client application

### Staletime vs gcTime
- ![img_16.png](img_16.png)
- ![img_17.png](img_17.png)

## Pagination, Pre-fetching and Mutations
- Now we need to fetch the comments.
- ![img_18.png](img_18.png)
- We pass the post to a PostDetail component which fetches the comments
- We will make changes to PostDetail component as follows:
```jsx
import { fetchComments } from "./api";
import "./PostDetail.css";
import {useQuery} from "@tanstack/react-query";

export function PostDetail({ post }) {
  console.log(post);
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
      <button>Delete</button> <button>Update title</button>
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

```
### Key Changes Made:
- Fixed queryFn: Changed from fetchComments(post.id) to () => fetchComments(post.id)
- Updated queryKey: Added post.id to the query key as ["comments", post.id] so React Query can cache comments per post

### Why This Matters:
- Without the arrow function: fetchComments(post.id) executes immediately when the component renders, and React Query receives the Promise result instead of a function
- With the arrow function: () => fetchComments(post.id) passes a function that React Query can call when it needs to fetch data

### Understanding Query Keys
- ![img_19.png](img_19.png)
- ![img_20.png](img_20.png)
- ![img_22.png](img_22.png)
- Note the queryFn relies on post.id, so we need to add post.id as a dependency array
- ![img_23.png](img_23.png)
- ![img_21.png](img_21.png)
- ![img_24.png](img_24.png)
- So we can see some active queries and inactive queries
- For inactive queries, the gc time clock is ticking
- After the gctime has passed, they will be automatically garbage collected
- Think of this as, whenever we make a query, the results of that query are cached
- When we make a new query, the results of previous query are still in the cache
- If that old query is reused, then results come straight from the cache, else if gctime has passed, it is garbage collected and removed from cache

### Pagination
- ![img_25.png](img_25.png)
- We write the following code in Posts.jsx file
```jsx
import { useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import {useQuery} from "@tanstack/react-query"
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

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
            onClick={() => setSelectedPost(post)}
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
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}

```

### Prefetching data
- ![img_26.png](img_26.png)
- Prefetching is a method of the query client
- We can get a reference to the query client inside a component using the useQueryClient hook
- We have a prefetch query function that will fetch data for the next page
- We have to prefetch the data inside the useEffect to keep tracking of which page we are on and we want to run this function when we go to the next page
```jsx
const [currentPage, setCurrentPage] = useState(1);
const [selectedPost, setSelectedPost] = useState(null);

const queryClient = useQueryClient();

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
```
- This really reduces loading time and provides a nice experience to the user

### isLoading vs isFetching
- ![img_27.png](img_27.png)
```jsx
// First time loading
data: undefined
isLoading: true    // Show spinner
isFetching: true

// Background refetch with cached data
data: [...existing data...]
isLoading: false   // Don't show spinner
isFetching: true   // Still fetching new data

```
- Use isLoading when you want to show a loading spinner only for the initial data load.
- Use isFetching when you want to indicate any network activity, including background refreshes.
- For most UI patterns, isLoading is preferred because it prevents showing loading spinners every time React Query refetches data in the background.
- isLoading indicates initial data fetch, isFetching shows any ongoing fetch process

### Intro to Mutations
- ![img_28.png](img_28.png)
- ![img_29.png](img_29.png)
- To add a delete mutation add the following code to Posts.jsx
- Note that we can pass arguments to mutations
```jsx
import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query"
import { fetchPosts, deletePost, updatePost } from "./api";

const deleteMutation = useMutation({
    //No need to add mutation Key
    mutationFn: (postId) => deletePost(postId),
})

{selectedPost && <PostDetail post={selectedPost} deleteMutation = {deleteMutation} />}
```
- Now inside the PostDetail component we have this code:
```jsx
export function PostDetail({ post, deleteMutation }) {
    const {data,isLoading,isError, error } = useQuery({
        queryKey: ["comments",post.id],
        queryFn: ()=> fetchComments(post.id),
    })

    return (
        <>
            <h3 style={{ color: "blue" }}>{post.title}</h3>
            // Specify arguments for the mutation
            <button onClick={()=>deleteMutation.mutate(post.id)}>Delete</button> <button>Update title</button>
            <p>{post.body}</p>
            <h4>Comments</h4>
            {data && data.map((comment) => (
                <li key={comment.id}>
                    {comment.email}: {comment.body}
                </li>
            ))}
        </>
    );
```
- The arguments for useMutation are less than that for useQuery
- There is no isLoading and isFetching properties
- We do have isPending
```jsx
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
          <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data && data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
```
- We need to reset the mutation when we click on a different post
- The reset function resets all the mutation properties
- This can be done by the following code:
```jsx
return (
    <>
      <ul>
        {data && data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
                deleteMutation.reset()
                setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
)
```
### Updating the Post Title
- ![img_30.png](img_30.png)
- The code is exactly similar to deleteMutation code above
```jsx

const updateMutation = useMutation({
        mutationFn: (postId) => updatePost(postId),
    })
    
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
```
### Summary of React-Query Basics
- ![img_31.png](img_31.png)

## Infinite Scroll - Infinite Queries for Loading Data (Just in Time)
- ![img_32.png](img_32.png)
- We will use a new hook useInfiniteQuery
- ![img_33.png](img_33.png)
- ![img_34.png](img_34.png)

```jsx
import "./App.css";
import { InfinitePeople } from "./people/InfinitePeople";
import { InfiniteSpecies } from "./species/InfiniteSpecies";
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

function App() {
  return (
      <QueryClientProvider client={queryClient}>
    <div className="App">
      <h1>Infinite SWAPI</h1>
      <InfinitePeople />
      {/* <InfiniteSpecies /> */}
    </div>
          <ReactQueryDevtools />
      </QueryClientProvider>
  );
}

export default App;

```
### useInfiniteQuery
- ![img_35.png](img_35.png)
- ![img_36.png](img_36.png)
- ![img_37.png](img_37.png)
- ![img_38.png](img_38.png)
- ![img_39.png](img_39.png)
- Initial when the component mounts and we fetch the first page, the data is undefined
- Then we fetch the first page
- ![img_40.png](img_40.png)
- It sets the first property of the data.pages object
- After we get the data back, React Query will run the getNextPageParam
- ![img_41.png](img_41.png)
- Then we check if there is a next Page
- ![img_42.png](img_42.png)
- Then we run the getNextPageParam
- If getNextPageParam is undefined, it means there are no more pages
- So hasNextPage is false and we are done
- ![img_43.png](img_43.png)
- Initial code for useInfiniteQuery is as follows:
```jsx
import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";
import {useInfiniteQuery} from "@tanstack/react-query"

const initialUrl = "https://swapi-node.now.sh/api/people";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {

    //fetch Next page is called when we want to load more data
  const {data, fetchNextPage, hasNextPage} = useInfiniteQuery({
    queryKey:["sw-people"],
    queryFn: ({pageParam = initialUrl}) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) =>{
      return lastPage.next || undefined;
    }
  })
```
### React Infinite Scroller
- ![img_45.png](img_45.png)
- Code will be as follows:
```jsx
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Person } from "./Person";

const baseUrl = "https://swapi-node.vercel.app";
const initialUrl = baseUrl + "/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["sw-people"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next ? baseUrl + lastPage.next : undefined;
    },
  });

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }

  return (
      <>
        {isFetching && <div className="loading">Loading...</div>}
        <InfiniteScroll
            loadMore={() => {
              if (!isFetching) {
                fetchNextPage();
              }
            }}
            hasMore={hasNextPage}
        >
          {data.pages.map((pageData) => {
            return pageData.results.map((person) => {
              return (
                  <Person
                      key={person.fields.name}
                      name={person.fields.name}
                      hairColor={person.fields.hair_color}
                      eyeColor={person.fields.eye_color}
                  />
              );
            });
          })}
        </InfiniteScroll>
      </>
  );
}
```
- We can write similar code for InfiniteSpecies

### Bi-directional Scrolling
- ![img_46.png](img_46.png)
- getPreviousPageParam
- ![img_47.png](img_47.png)

## React Query in a larger app
- We will try to centralize error logging
- We will use custom hooks for useQuery rather than use useQuery directly in the components
- ![img_48.png](img_48.png)
- ![img_49.png](img_49.png)
- We can lazy load the react-query-devtools in the development also
- We can call windows.toggleDevtools() to enable devTools in production
- We will install eslint plugin for react-query
- To install anything as a dev dependencies we will add the -D switch along the command
```shell
npm i -D @tanstack/eslint-plugin-query
```
- We can set up aliases to our folders in the tsconfig.json file
- ![img_50.png](img_50.png)

### Setting up React Query in App.tsx for client
- Include the following code in App.tsx to install React Query Client, Query Client Provider and ReactQueryDevTools
- Please note that rather than defining an instance of queryClient we define it inside a queryClient.ts file
- This allows us to import the instance whenever we need it
- Then make the following changes in App.tsx
```jsx
import {queryClient} from "@/react-query/queryClient";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
    <AuthContextProvider>
        <Loading />
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Staff" element={<AllStaff />} />
                <Route path="/Calendar" element={<Calendar />} />
                <Route path="/Treatments" element={<Treatments />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/user/:id" element={<UserProfile />} />
            </Routes>
        </BrowserRouter>
        <ToastContainer />
    </AuthContextProvider>
    <ReactQueryDevtools></ReactQueryDevtools>
</QueryClientProvider>
```
### Custom Query Hook: useTreatments
- In larger apps, we make custom hooks for each type of data
- This makes it accessible from multiple components
- This also eliminates the risk of mixing up keys
- It also encapsulates the queryFn in a custom hook
- Also, it abstracts the implementation from the Presentation Layer
- We can update the implementation without affecting other components
- Code for useTreatments is as follows:
```jsx
import type { Treatment } from "@shared/types";
import {useQuery} from "@tanstack/react-query";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
    //specify a default value
  const fallback : Treatment[] = []
    //initialize data to be default value
  const {data = fallback} = useQuery({
   queryKey: [queryKeys.treatments],
   queryFn: getTreatments,
 })
  return data;
}

```

### Centralized Fetching Indicator (useInFetching)
- ![img_51.png](img_51.png)
- We will modify the Loading.tsx as follows
```jsx
import { Spinner, Text } from "@chakra-ui/react";
import {useIsFetching} from "@tanstack/react-query";

export function Loading() {
  // will use React Query `useIsFetching` to determine whether or not to display
  const isFetching = useIsFetching(); // returns an integer, if > 0, then query calls are still pending, if 0, then it will give false
  const display = isFetching ? "inherit" : "none";

  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="olive.200"
      color="olive.800"
      role="status"
      position="fixed"
      zIndex="9999"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      display={display}
    >
      <Text display="none">Loading...</Text>
    </Spinner>
  );
}

```

### Global Callback to show a toast message everytime there is an error
- ![img_52.png](img_52.png)
- We will setup the error handler as follows:
```jsx
import { toast } from "@/components/app/toast";
import {QueryCache, QueryClient} from "@tanstack/react-query";

function errorHandler(errorMsg: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    const action = "fetch";
    const title = `could not ${action} data: ${
      errorMsg ?? "error connecting to server"
    }`;
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}


export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            errorHandler(error.message);
        },
    })
});

```
- It displays the error like this
- ![img_53.png](img_53.png)
- Default retries for react query is 3

### Writing a custom hook for Staff Data
- ![img_54.png](img_54.png)
- Code for useStaff is as follows
```jsx
import { useState } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import {useQuery} from "@tanstack/react-query";

//query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}
interface UseStaffReturn {
  staff: Staff[];
  filter: string;
  setFilter: (filter: string) => void;
}

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");

  //fallback data
  const fallback: Staff[] = [];
  // TODO: get data from server via useQuery
  const {data:staff = fallback} = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
  });
  return { staff, filter, setFilter };
}

```

### Summary
- Create a separate file for the Query Client
- Create custom hooks to create code modular and reusable
- We centralized the loading component using the useInFetching() hook for react-query
- We centralized the error handling using the onError callback inside the Query Client Cache

### Query Features: Pre-fetching and Pagination





































