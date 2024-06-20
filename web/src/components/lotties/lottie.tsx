import React, { useRef, useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';

export const Animated = ({animation, className, height, width, onEndAnimation = ()=>{}}: {animation: string, className: string, height:number, width: number, onEndAnimation?: Function}) => {
  const containerRef = useRef<any>(null);

  const [animationData, setAnimationData] = useState<object>();

  useEffect(() => {
    import(`./collection/${animation}.json`).then(setAnimationData).catch(() => {
      import(`./collection/unknown.json`).then(setAnimationData);
    });
  }, [animation]);

  if (!animationData) return <div></div>;
  return <Lottie className={className} ref={containerRef} style={{height, width}} animationData={animationData} play  onLoopComplete={() => {containerRef.current.pause(); onEndAnimation()}}/>;
};