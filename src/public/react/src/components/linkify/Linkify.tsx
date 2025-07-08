import React from "react";

interface LinkifyInterface {
  text: string | undefined;
}

const Linkify = ({ text }: LinkifyInterface) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parts = text?.split(urlRegex);

  return (
    <>
      {parts?.map((part, index) =>
        urlRegex.test(part) ? (
          <a href={part} key={index} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  );
};

export default Linkify;
