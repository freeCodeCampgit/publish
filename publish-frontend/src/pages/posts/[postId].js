import PostForm from '@/components/post-form';
import { getPost, updatePost } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const { postId } = context.params;
  const { data: tags } = await getTags(session.user.jwt);
  const { data: post } = await getPost(postId, session.user.jwt);
  return {
    props: { tags, post }
  };
}

export default function EditPostPage({ tags, post }) {
  // Get auth data from the session
  const { data: session } = useSession();
  // declare state variables
  const [content, setContent] = useState(post.attributes.body);

  const handleContentChange = updatedContent => {
    setContent(updatedContent);
  };

  // Handles the submit event on form submit.
  const handleSubmit = async (event, session) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Construct the data to be sent to the server
    const data = {
      // Need to nest in data object because Strapi expects so
      data: {
        title: event.target.title.value,
        body: content, // Get the content from the state
        slug: event.target.slug.value
      }
    };

    // Send the data to the Strapi server in JSON format.
    const JSONdata = JSON.stringify(data);

    // Bearer token for authentication
    const token = session.user.jwt;

    // Sending request
    try {
      const result = await updatePost(post.id, JSONdata, token);
      console.log('updatePost response: ', JSON.stringify(result));
      alert('Saved!');
    } catch (error) {
      console.error('createPost Error:', error);
      alert('Failed to save the post');
    }
  };

  // loading screen
  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <PostForm
        tags={tags}
        onSubmit={event => handleSubmit(event, session)}
        initialValues={post}
        onContentChange={handleContentChange}
      />
    </>
  );
}
