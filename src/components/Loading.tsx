import React from "react";

function Loading() {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-50 z-10 flex items-center justify-center w-[100%] h-[100%]">
      <span className="h-6 w-6 mx-2 block rounded-full border-4 border-t-black animate-spin"></span>
    </div>
  );
}

export default Loading;
