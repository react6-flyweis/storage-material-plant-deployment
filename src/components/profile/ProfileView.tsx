import { Camera, CircleAlert, MoveLeft, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TitleSubtitle from "../common_component/TitleSubtitle";
import SuccessModal from "../common_component/SuccessModal";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  type UpdateProfileRequest,
} from "../../redux/api/profileApi";
import { useGetPresignedUrlMutation } from "../../redux/api/uploadApi";

interface ProfileViewProps {
  onNavigate?: (view: "settings") => void;
}

const DEFAULT_AVATAR = "";

const ProfileView: React.FC<ProfileViewProps> = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [getPresignedUrl] = useGetPresignedUrlMutation();

  const [profilePicture, setProfilePicture] = useState<string>(DEFAULT_AVATAR);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    mobile: "",
    role: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState({
    title: "Profile Updated",
    subTitle: "Your personal information has been updated successfully.",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        mobile: profile.mobile || "",
        role: profile.role || "",
      }));
      if (profile.avatar) {
        setProfilePicture(profile.avatar);
        setUploadedAvatarUrl(profile.avatar);
      }
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (
      ["currentPassword", "newPassword", "confirmPassword"].includes(
        e.target.name,
      )
    ) {
      setPasswordError(null);
    } else {
      setErrorMessage(null);
      setInfoMessage(null);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("File size must be less than 2MB");
      return;
    }

    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/i)) {
      setErrorMessage("Only JPG, PNG, GIF, or WEBP files are allowed");
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingAvatar(true);
    try {
      const presignedRes = await getPresignedUrl({
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        folder: "avatars",
      }).unwrap();

      const { uploadUrl, fileUrl } = presignedRes;

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      setUploadedAvatarUrl(fileUrl);
      setProfilePicture(fileUrl);
    } catch (err: unknown) {
      console.warn("Direct upload error, falling back to local preview:", err);
      // Keep local preview intact
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveProfile = async () => {
    setErrorMessage(null);
    setInfoMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage("Full Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Email Address is required");
      return;
    }

    const payload: UpdateProfileRequest = {};
    const nameTrim = formData.fullName.trim();
    const emailTrim = formData.email.trim();
    const phoneTrim = formData.phone.trim();
    const mobileTrim = formData.mobile.trim();
    const avatarVal = uploadedAvatarUrl.trim();

    if (nameTrim !== (profile?.name || "").trim()) {
      payload.name = nameTrim;
    }
    if (emailTrim !== (profile?.email || "").trim()) {
      payload.email = emailTrim;
    }
    if (phoneTrim !== (profile?.phone || "").trim()) {
      payload.phone = phoneTrim;
    }
    if (mobileTrim !== (profile?.mobile || "").trim()) {
      payload.mobile = mobileTrim;
    }
    if (avatarVal && avatarVal !== (profile?.avatar || "").trim()) {
      payload.avatar = avatarVal;
    }

    const hasProfileChanges = Object.keys(payload).length > 0;

    if (!hasProfileChanges) {
      setInfoMessage("No changes detected to save");
      return;
    }

    try {
      await updateProfile(payload).unwrap();
      setSuccessModalData({
        title: "Profile Updated",
        subTitle: "Your personal information has been updated successfully.",
      });
      setIsSuccessModalOpen(true);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? ((err as { data?: { message?: string } }).data?.message ??
            "Failed to save profile changes")
          : err instanceof Error
            ? err.message
            : "Failed to save profile changes";
      setErrorMessage(msg);
    }
  };

  const handleSavePassword = async () => {
    setPasswordError(null);

    if (!formData.currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }
    if (!formData.newPassword) {
      setPasswordError("Please enter a new password");
      return;
    }
    if (formData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setSuccessModalData({
        title: "Password Updated",
        subTitle: "Your password has been changed successfully.",
      });
      setIsSuccessModalOpen(true);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? ((err as { data?: { message?: string } }).data?.message ??
            "Failed to update password")
          : err instanceof Error
            ? err.message
            : "Failed to update password";
      setPasswordError(msg);
    }
  };

  const isSavingProfile = isUpdatingProfile || isUploadingAvatar;

  return (
    <div className="xl:pr-5 px-2 md:pt-5 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap md:items-center items-start justify-between mt-2 xl:mt-0">
        <div className="flex items-start gap-4 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <MoveLeft className="w-4 h-4" />
            <p className="font-normal">Back</p>
          </button>
          <TitleSubtitle
            title="My Profile"
            subtitle="Update your personal information and security settings"
          />
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={isSavingProfile || isProfileLoading}
          className="flex items-center justify-center gap-2 md:px-4 ml-auto md:mt-0 mt-4 py-2.5 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity md:text-sm text-xs font-normal min-w-[128px] w-fit"
        >
          {isSavingProfile ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Profile</span>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      {infoMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">
          {infoMessage}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-wrap items-center gap-6">
        <img
          src={profilePicture || DEFAULT_AVATAR}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-50"
        />
        <div className="space-y-2 flex flex-col flex-wrap">
          <h3 className="md:text-lg font-semibold text-gray-900">
            Profile Picture
          </h3>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleProfilePictureClick}
              disabled={isUploadingAvatar}
              type="button"
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
              <p className="md:text-sm text-xs">
                {isUploadingAvatar ? "Uploading..." : "Change Picture"}
              </p>
            </button>
            <span className="md:text-sm text-xs text-gray-400">
              JPG, PNG, GIF or WEBP, Max size 2MB.
            </span>
          </div>
        </div>
      </div>

      <h3 className="md:text-lg font-semibold text-gray-900 my-1">
        Basic Information
      </h3>
      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
            />
            <span className="text-xs text-gray-500">
              Role cannot be changed from this interface
            </span>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <h3 className="md:text-lg font-semibold text-gray-900">
        Security Settings
      </h3>
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Leave password fields empty if you don't want to change your
            password.
          </p>
        </div>

        <div className="space-y-6">
          <div className="w-full md:w-1/2 pr-0 md:pr-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                New password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password (min. 8 characters)"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {passwordError}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSavePassword}
              disabled={isChangingPassword}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity md:text-sm text-xs font-normal min-w-[128px] w-fit"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Password</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Password Requirements Info */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4 text-(--text-color-primary-blue) font-medium md:text-sm text-xs">
          <CircleAlert className="w-5 h-5" />
          Password Requirements:
        </div>
        <ul className="space-y-2 md:text-sm text-xs text-(--text-color-primary-blue)">
          <li>At least 8 characters long</li>
          <li>Include uppercase and lowercase letters</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successModalData.title}
        subTitle={successModalData.subTitle}
      />
    </div>
  );
};

export default ProfileView;
