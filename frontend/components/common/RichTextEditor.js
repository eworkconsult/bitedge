import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Get your free API key from https://www.tiny.cloud/
const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY || 'no-api-key';

const RichTextEditor = ({ initialValue, onEditorChange, disabled = false }) => {
  const editorRef = useRef(null);

  // The onEditorChange prop will be a function passed from the parent component
  // to handle the updated content.
  const handleEditorChange = (content, editor) => {
    onEditorChange(content);
  };

  return (
    <Editor
      apiKey={TINYMCE_API_KEY}
      onInit={(evt, editor) => editorRef.current = editor}
      initialValue={initialValue || ''}
      onEditorChange={handleEditorChange}
      disabled={disabled}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        // This message will appear if you don't have a valid API key
        promotion: TINYMCE_API_KEY === 'no-api-key',
      }}
    />
  );
};

export default RichTextEditor;
