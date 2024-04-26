import React, { useState, useRef } from "react";
import "./PostShare.css";
import { UilLocationPoint, UilScenery, UilPlayCircle, UilSchedule, UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/UploadAction";
import mapImage from "../../img/map.jpeg"; // Import the map image
import interactionsImage from "../../img/interaction.png"; // Import the interactions photo

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const loading = useSelector((state) => state.postReducer.uploading);
  const [image, setImage] = useState(null);
  const [showInteractionsPhoto, setShowInteractionsPhoto] = useState(false); // State to control showing interactions photo
  const desc = useRef();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  // handle Image Change
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };

  const imageRef = useRef();

  // handle post upload
  const handleUpload = async (e) => {
    e.preventDefault();

    //post data
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    // if there is an image with post
    if (image) {
      const data = new FormData();
      const fileName = Date.now() + image.name;
      data.append("name", fileName);
      data.append("file", image);
      newPost.image = fileName;
      console.log(newPost);
      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(uploadPost(newPost));
    resetShare();
  };

  // Reset Post Share
  const resetShare = () => {
    setImage(null);
    desc.current.value = "";
  };

  // Handle location option click
  const handleLocationClick = () => {
    setImage(mapImage); // Set the image state to the map image
  };

  // Handle interactions option click
  const handleInteractionsClick = () => {
    setShowInteractionsPhoto(true); // Show the interactions photo
  };

  return (
    <div className="PostShare">
      <img
        src={
          user.profilePicture
            ? serverPublic + user.profilePicture
            : serverPublic + "defaultProfile.png"
        }
        alt="Profile"
      />
      <div>
        <input
          type="text"
          placeholder="What's happening?"
          required
          ref={desc}
        />
        <div className="postOptions">
          <div
            className="option"
            style={{ color: "var(--photo)" }}
            onClick={() => imageRef.current.click()}
          >
            <UilScenery />
            Photo
          </div>

          <div className="option" style={{ color: "var(--video)" }}>
            <UilPlayCircle />
            Video
          </div>
          <div
            className="option"
            style={{ color: "var(--location)" }}
            onClick={handleLocationClick}
          >
            <UilLocationPoint />
            Location
          </div>
          <div className="option" style={{ color: "var(--schedule)" }} onClick={handleInteractionsClick}>
            <UilSchedule />
            Help
          </div>
          <button
            className="button ps-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "Uploading" : "Share"}
          </button>

          <div style={{ display: "none" }}>
            <input type="file" ref={imageRef} onChange={onImageChange} />
          </div>
        </div>

        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={image} alt="Preview" />
          </div>
        )}

        {showInteractionsPhoto && (
          <div className="interactionsPhoto">
            <UilTimes onClick={() => setShowInteractionsPhoto(false)} />
            <img src={interactionsImage} alt="Interactions" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;