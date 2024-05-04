// UploadForm.js
import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const UploadForm = () => {
  const [videoLink, setVideoLink] = useState('');
  // const [audioUrl, setAudioUrl] = useState('');

  const [title, setTitle] = useState('');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData) => axios.post('/api/upload', formData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['audioList'] });

      setTitle('');
      setVideoLink('');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    mutation.mutate({ title, videoUrl: videoLink });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Audio Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Video Link</label>
          <input
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
        </div>

        {mutation.isError ? (
          <div>
            {mutation.error.response.data.error || mutation.error.toString()}
          </div>
        ) : null}

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {/* {audioUrl && <audio controls src={audioUrl} />} */}
    </div>
  );
};

export default UploadForm;
