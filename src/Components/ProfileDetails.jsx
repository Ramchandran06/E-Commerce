import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Spinner, Image } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaEdit, FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ProfileDetails.css";

const BACKEND_URL = "http://localhost:5000";

const ProfileDetails = () => {
  const { user, token, updateUserProfile, changePassword, logout, setUser } =
    useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullname || "");
      setMobile(user.mobile || "");

      setImagePreview(user.profilepictureurl || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImageFile(file);

      setImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImageFile(null);
      toast.error("Please select a valid image file (jpg, png).");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (profileImageFile) {
        const formData = new FormData();
        formData.append("profilePicture", profileImageFile);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };

        const uploadResponse = await axios.put(
          `${BACKEND_URL}/api/auth/profile/picture`,
          formData,
          config
        );

        setUser(uploadResponse.data.user);

        toast.success(uploadResponse.data.message);
        setProfileImageFile(null);
      }

      if (fullName !== user.fullname || mobile !== user.mobile) {
        await updateUserProfile({ fullName, mobile });
        toast.success("Profile details updated!");
      }

      if (newPassword) {
        if (newPassword !== confirmPassword)
          throw new Error("New passwords do not match.");
        if (!oldPassword) throw new Error("Current password is required.");
        await changePassword({ oldPassword, newPassword });
        toast.success("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast.error(
        error.response?.data?.message || error.message || "An error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFullName(user.fullname || "");
      setMobile(user.mobile || "");
      setImagePreview(
        user.profilepictureurl ? `${BACKEND_URL}${user.profilepictureurl}` : ""
      );
    }
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div>
      {isEditing ? (
        <Form onSubmit={handleUpdate} className="text-start">
          <div className="profile-picture-edit text-center mb-4">
            <Image
              src={imagePreview || "default-avatar.png"}
              roundedCircle
              width={120}
              height={120}
              className="profile-avatar"
            />
            <Button
              variant="link"
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="mt-2"
            >
              Change Picture
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" value={user.email} disabled readOnly />
          </Form.Group>
          <hr className="my-4" />
          <h6 className="mt-3">Change Password</h6>
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Current Password</Form.Label>
              <Link to="/forgot-password" style={{ fontSize: "0.8rem" }}>
                Forgot Password?
              </Link>
            </div>
            <Form.Control
              type="password"
              placeholder="Required to set a new password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Leave blank to keep current password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleCancelEdit}>
              <MdCancel className="me-1" /> Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <FaSave className="me-1" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </Form>
      ) : (
        <div className="text-center">
          {user && user.profilepictureurl ? (
            <Image
              src={user.profilepictureurl}
              roundedCircle
              width={120}
              height={120}
              className="profile-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
          ) : (
            <FaUserCircle size={100} className="profile-avatar-modal" />
          )}
          <h4 className="mt-3">{user.fullname}</h4>
          <p className="text-white-50">{user.email}</p>
          <hr />
          <div className="text-start profile-info-section">
            <p>
              <strong className="profile-info-label">Full Name:</strong>
              <span className="profile-info-value">
                {user.fullname || "Not Set"}
              </span>
            </p>
            <p>
              <strong className="profile-info-label">Mobile:</strong>
              <span className="profile-info-value">
                {user.mobile || "Not Set"}
              </span>
            </p>
            <p>
              <strong className="profile-info-label">Email:</strong>
              <span className="profile-info-value">{user.email}</span>
            </p>
          </div>
          <Button className="edit-btn mt-4 " onClick={() => setIsEditing(true)}>
            <FaEdit className="me-2" /> Edit Profile
          </Button>
          <Button className="logout-btn mt-4 ms-4" onClick={() => logout()}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
