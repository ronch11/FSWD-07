import React from 'react';
import { useEffect, useState } from 'react';
import { useLoading } from '../../LoadingContext';
import '../../Styles/Loading.css';
function LoadingOverlay() {
    const [fadeIn, setFadeIn] = useState(false);
    const loading = useLoading();
    useEffect(() => {
        if (loading) {
          setFadeIn(true);
        } else {
          const timer = setTimeout(() => setFadeIn(false), 300);
          return () => clearTimeout(timer);
        }
      }, [loading]);


    return loading && (
      <div className={'loading-overlay ' + (fadeIn ? 'fade-in' : '')} >
        <div>Loading...</div>
      </div>
    );
  }
  
  export default LoadingOverlay;