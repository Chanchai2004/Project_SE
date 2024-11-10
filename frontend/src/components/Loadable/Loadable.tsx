// src/components/Loadable/Loadable.tsx
import { Suspense, ComponentType, useState, useEffect } from "react";
import Loader from "./Loader"; // นำเข้า Loader

const Loadable = <P extends object>(Component: ComponentType<P>): ComponentType<P> => {
  return (props: P) => {
    const [showComponent, setShowComponent] = useState(false);

    useEffect(() => {
      // ตั้งค่า delay 1 วินาที (1000 มิลลิวินาที)
      const timer = setTimeout(() => {
        setShowComponent(true);
      }, 1000);

      return () => clearTimeout(timer); // ล้าง timer เมื่อ component ถูก unmount
    }, []);

    return (
      <Suspense fallback={<Loader />}>
        {showComponent ? <Component {...props} /> : <Loader />}
      </Suspense>
    );
  };
};

export default Loadable;
