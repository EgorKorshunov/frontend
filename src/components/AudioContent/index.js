import React, { useEffect } from 'react';
import winSound from '../../data/audio/win.mp3';
import explodeSound from '../../data/audio/crash.wav';
import failSound from '../../data/audio/fail.mp3';
import flyingSound from '../../data/audio/flying.mp3';

function AudioContent() {
  useEffect(() => {
    function onTouch() {
      ['audio-flying', 'audio-win', 'audio-explode', 'audio-fail'].forEach(
        id => {
          try {
            document.getElementById(id).load();
          } catch (e) {
            console.error(e);
          }
        }
      );
    }

    document.addEventListener('touchstart', onTouch);
    return () => document.removeEventListener('touchstart', onTouch);
  }, []);

  return (
    <>
      <audio id="audio-flying" preload="auto">
        <source src={flyingSound} type="audio/mpeg" />
      </audio>
      <audio id="audio-win" preload="auto">
        <source src={winSound} type="audio/mpeg" />
      </audio>
      <audio id="audio-explode" preload="auto">
        <source src={explodeSound} type="audio/wav" />
      </audio>
      <audio id="audio-fail" preload="auto">
        <source src={failSound} type="audio/mpeg" />
      </audio>
    </>
  );
}

export default AudioContent;
