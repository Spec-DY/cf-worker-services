import PropTypes from "prop-types";

type ImageListProps = {
  images: Array<UserImage>;
};

export const ImageList = ({ images }: ImageListProps) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full">
        {Object.values(images).map((image, index) => {
          return (
            <>
              <div key={index} className="flex flex-row">
                <div className="w-1/2">
                  <img src={image.url} className="w-full" />
                </div>
                <div className="w-1/2">Image analysis will go here</div>
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
};

ImageList.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
    })
  ),
};
