import { useEffect, useRef, useState } from 'react';

const RevealOnScroll = ({ children, className = "", animation = "animate-fade-up", delay = "0s" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1,
      rootMargin: "0px"
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`${className} ${isVisible ? animation : 'opacity-0'}`}
      style={{ animationDelay: isVisible ? delay : '0s' }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
