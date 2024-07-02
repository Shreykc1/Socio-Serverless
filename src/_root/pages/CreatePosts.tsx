import PostForm from "@/components/forms/PostForm"

const CreatePosts = () => {


   // 1. Define your form.
  




  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="justify-start w-full max-w-5xl flex-start gap-3 ">
          <img src="/assets/icons/add-post.svg" alt="logo" width={35} height={35} />
          <h2 className="h3-bold md:h2-bold text-left w-full">New Post</h2>
        </div>

        <PostForm action="Create"  />

      </div>
    </div>
  )
}

export default CreatePosts