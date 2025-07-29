// eslint-disable-next-line react/prop-types
const InputImage = ({ onImageChange }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <input type="file" accept="image/*" onChange={handleFileChange} />
  );
};

export default InputImage;