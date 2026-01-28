import React, { useEffect } from 'react'
import DetailedIntroduction from '../components/DetailedIntroduction'

const Introduce = () => {
  useEffect(() => {
    const ov = document.getElementById('page-transition-overlay');
    if (ov) {
      ov.style.opacity = '0';
      ov.style.transition = 'opacity 400ms ease';
      setTimeout(() => ov.remove(), 400);
    }
  }, []);
  return (
    <div>
      <DetailedIntroduction />
    </div>
  )
}

export default Introduce
