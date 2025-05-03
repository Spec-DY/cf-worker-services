import PropTypes from "prop-types";

type ImageListProps = {
  images: Array<UserImage>;
};

export const ImageList = ({ images }: ImageListProps) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full flex justify-center gap-4 pt-4">
        {Object.values(images).map((image, index) => {
          return (
            <div key={index} className="flex items-center justify-center">
              <div className="w-auto">
                <img src={image.url} className="w-48 h-auto object-contain" />
              </div>
            </div>
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
