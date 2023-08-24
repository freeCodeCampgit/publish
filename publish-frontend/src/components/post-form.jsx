import { useEffect, useState } from 'react';
import Tiptap from '@/components/tiptap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import slugify from 'slugify';
import { Img } from '@chakra-ui/react';

const PostForm = ({ tags, authors, _session }) => {
  const [showDrafts, setShowDrafts] = useState(true);
  const [showPinned, setShowPinned] = useState(true);
  const [showPublished, setShowPublished] = useState(true);
  // editing title
  const [title, setTitle] = useState('this is the title');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const [clientTags, setClientTags] = useState([]);

  const [isFocused, setIsFocused] = useState(false);

  const [postUrl, setPostUrl] = useState('');

  const [featureImage, setFeatureImage] = useState('');

  const [author, setAuthor] = useState('');

  useEffect(() => {
    function removeTag(tag) {
      const newTags = clientTags.filter(t => t !== tag);
      setClientTags(newTags);
    }

    function createNewTags() {
      const tagContainer = document.getElementById('tag-container');

      if (tagContainer === null) return;

      tagContainer.innerHTML = '';

      clientTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.innerHTML = tag;
        const removeButton = document.createElement('button');
        removeButton.innerHTML = 'x';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => removeTag(tag));
        tagElement.appendChild(removeButton);
        tagContainer.appendChild(tagElement);
      });
    }

    createNewTags();
  }, [clientTags]);

  function handleFileInputChange(event) {
    const file = event.target.files[0];
    setFeatureImage(URL.createObjectURL(file));
  }

  function handleTitleChange() {
    const newTitle = document.getElementById('title-input').value;
    setTitle(newTitle);
  }

  function addTag(event) {
    if (!clientTags.includes(event.target.value)) {
      const newTags = [...clientTags, event.target.value];
      setClientTags(newTags);
    }
  }

  function addAuthor(event) {
    setAuthor(event.target.value);
  }

  function handleSubmit() {
    const data = {
      data: {
        title: title,
        body: {},
        slug: postUrl.length > 0 ? postUrl : slugify(title, { lower: true }),
        tags: clientTags,
        feature_image: featureImage,
        author: author
      }
    };

    console.log(data);
    console.log('submitting');
  }

  return (
    <div className='page'>
      <div className='side-drawer'>
        {!isFocused ? (
          <>
            <button
              className='dropdown-button'
              onClick={() => setShowDrafts(!showDrafts)}
            >
              <h2>Drafts</h2>
            </button>
            {showDrafts && (
              <div>
                <ul>
                  <li>Post 1</li>
                  <li>Post 2</li>
                  <li>Post 3</li>
                </ul>
              </div>
            )}

            <button
              className='dropdown-button'
              onClick={() => setShowPinned(!showPinned)}
            >
              <h2>Pinned</h2>
            </button>
            {showPinned && (
              <div>
                <ul>
                  <li>Post 4</li>
                  <li>Post 5</li>
                  <li>Post 6</li>
                </ul>
              </div>
            )}

            <button
              className='dropdown-button'
              onClick={() => setShowPublished(!showPublished)}
            >
              <h2>Published</h2>
            </button>
            {showPublished && (
              <div>
                <ul>
                  <li>Post 7</li>
                  <li>Post 8</li>
                  <li>Post 9</li>
                </ul>
              </div>
            )}

            <button
              className='submit-button full-width-btn'
              onClick={handleSubmit}
            >
              Save Draft
            </button>
          </>
        ) : (
          <div>
            <h2 className='input-title'>Feature Image</h2>
            <div className='feature-image'>
              {featureImage ? (
                <Img src={featureImage} alt='Feature Image' />
              ) : (
                <>
                  <label htmlFor='feature-image' className='custom-file-upload'>
                    <button
                      type='button'
                      onClick={() =>
                        document.getElementById('feature-image').click()
                      }
                    >
                      Select Image
                    </button>
                  </label>
                  <input
                    type='file'
                    id='feature-image'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                </>
              )}
            </div>
            {featureImage && (
              <button
                className='submit-button full-width-btn delete-button'
                onClick={() => setFeatureImage(null)}
              >
                Delete
              </button>
            )}
            <h2 className='input-title'>Tags</h2>
            <div id='tag-container'></div>
            <select className='tag-selector' onChange={addTag}>
              <option value='0'>Select a tag</option>
              {tags.map(tag => (
                <option key={tag.attributes.name} value={tag.attributes.name}>
                  {tag.attributes.name}
                </option>
              ))}
            </select>
            <h2 className='input-title'>Authors</h2>
            <select className='tag-selector' onChange={addAuthor}>
              <option value='0'>Select an Author</option>
              {authors.map(author => (
                <option key={author.username} value={author.username}>
                  {author.username}
                </option>
              ))}
            </select>
            <h2 className='input-title'>Publish Date</h2>
            <div className='time-date-input'>
              <input
                type='date'
                id='publish-date'
                name='publish-date'
                required
              />
              <input
                type='time'
                id='publish-time'
                name='publish-time'
                required
              />
            </div>
            <h2 className='input-title'>Post URL</h2>
            <label htmlFor='slug'>
              <input
                type='text'
                id='slug'
                name='slug'
                pattern='\S+'
                placeholder={slugify(title)}
                onChange={() => setPostUrl(event.target.value)}
                required
              />
              <span>
                https://www.freecodecamp.com/news/
                {slugify(postUrl != '' ? postUrl : title, { lower: true })}
              </span>
            </label>
            <button
              className='submit-button full-width-btn'
              onClick={handleSubmit}
            >
              Save Draft
            </button>
            <br />
            <hr />
            <button
              className='submit-button full-width-btn'
              onClick={() => setIsFocused(false)}
            >
              View Posts
            </button>
          </div>
        )}
      </div>
      <div className='post-container'>
        <div className='header'>
          <div className='title-pos' id='title'>
            {isEditingTitle ? (
              <>
                <input type='text' id='title-input' name='title-input' />

                <button
                  type='submit'
                  className='submit-button icon-margin'
                  onClick={() => {
                    handleTitleChange();
                    setIsEditingTitle(false);
                  }}
                >
                  Save
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditingTitle(true)}>
                <h1 className='title icon-margin-left'>
                  <span>{title}</span>
                  <FontAwesomeIcon icon={faEdit} />
                </h1>
              </button>
            )}
          </div>
          <div>
            <button className='preview-button'>Preview</button>
            <button className='submit-button'>Send for Review</button>
          </div>
        </div>
        <div className='editor' onClick={() => setIsFocused(true)}>
          <Tiptap />
        </div>
      </div>
    </div>
  );
};
export default PostForm;
