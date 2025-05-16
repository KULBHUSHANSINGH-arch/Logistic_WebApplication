// import React from 'react';
// import '../Loader/Loader.css';

// const Loader = () => {
//   return (
//     <>
//       <div className="overlay"></div> 
//       <div className="spinner">
//         <div className="double-bounce1"></div>
//         <div className="double-bounce2"></div>
//       </div>
//     </>
//   );
// }

// export default Loader;
import React from 'react';
import '../Loader/Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>
  );
};

export default Loader;
