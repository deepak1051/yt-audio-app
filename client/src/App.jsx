import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import UploadForm from './components/UploadForm';
import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const App = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['audioList'],
    queryFn: () => axios.get('/api/audio').then((res) => res.data),
  });

  // const [playList, setPlayList] = useState([
  //   {
  //     id: 1,
  //     name: 'Video 1',
  //     url: 'https://res.cloudinary.com/dzwub5bux/video/upload/v1708502602/sdfrlr7pikvbzy74l78y.mp3',
  //   },
  //   {
  //     id: 2,
  //     name: 'Video 2',
  //     url: 'https://res.cloudinary.com/dzwub5bux/video/upload/v1708513716/uqnqgahswgv0xezm5tls.mp3',
  //   },
  //   {
  //     id: 3,
  //     name: 'Video 3',
  //     url: 'https://res.cloudinary.com/dzwub5bux/video/upload/v1708623213/sskmwtyscwrgp9puodue.mp3',
  //   },
  // ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data } = await api.get('/');

  //     setPlayList(data);
  //   };

  //   fetchData();
  // }, []);

  const handleNext = () => {
    if (currentIndex === data.length - 1) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((c) => c + 1);
  };

  const handlePrevious = () => {
    if (currentIndex === 0) {
      setCurrentIndex(data.length - 1);
      return;
    }
    setCurrentIndex((c) => c - 1);
  };

  // if (playList.length === 0) {
  //   return <h2>Add Audio</h2>;
  // }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  if (isPending) {
    return <h2>Loading...</h2>;
  }
  console.log(data);

  return (
    <>
      <UploadForm />

      <hr />

      <h2>Current Song {data[currentIndex].title}</h2>

      <div>
        {data?.map((item, index) => (
          <div key={item._id} onClick={() => setCurrentIndex(index)}>
            <h3>{item.title}</h3>
            {/* <p>{item.url}</p> */}
          </div>
        ))}
      </div>

      <AudioPlayer
        autoPlay
        src={data[currentIndex]?.url}
        onPlay={() => console.log('onPlay')}
        // other props here
        showSkipControls={true}
        onClickPrevious={handlePrevious}
        onClickNext={handleNext}
        onEnded={handleNext}
      />
    </>
  );
};

export default App;
