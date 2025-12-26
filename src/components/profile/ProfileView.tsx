import React, { useState, useRef } from "react";

interface ProfileViewProps {
  onBack: () => void;
  onNavigate?: (view: "settings") => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
  const [profilePicture, setProfilePicture] = useState(
    "https://imgs.search.brave.com/C6AU3hqShumrOuZaswKHOeZBwOo-XeuuJnf7XZ-5QW4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTAx/Njc0NDAzNC92ZWN0/b3IvcHJvZmlsZS1w/bGFjZWhvbGRlci1p/bWFnZS1ncmF5LXNp/bGhvdWV0dGUtbm8t/cGhvdG8uanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVJxdGky/NlZRal_mcy1_aEwx/NW1KajZiODRGRVpO/YTAwRkpnWlJhRzVQ/RDQ9"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "John Anderson",
    email: "johnanderson@company.com",
    phone: "+1 (555) 123-4567",
    role: "Plant Manager",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        alert("Only JPG, PNG, or GIF files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {/* Header */}
      <div className="flex md:items-center items-start justify-between">
        <div className="flex items-start gap-4 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <p className="font-normal">Back</p>
          </button>
          <div>
            <h1 className="md:text-2xl font-normal text-gray-900">
              My Profile
            </h1>
            <p className="text-gray-500 md:text-sm text-xs">
              Update your personal information and security settings
            </p>
          </div>
        </div>
        <button className="md:px-6 py-2.5 bg-(--button-bg-primary-color) text-white rounded-lg hover:opacity-90 transition-opacity md:text-sm text-xs font-medium">
          Save All Changes
        </button>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-center gap-6">
        <img
          src={
            profilePicture &&
            "https://imgs.search.brave.com/C6AU3hqShumrOuZaswKHOeZBwOo-XeuuJnf7XZ-5QW4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTAx/Njc0NDAzNC92ZWN0/b3IvcHJvZmlsZS1w/bGFjZWhvbGRlci1p/bWFnZS1ncmF5LXNp/bGhvdWV0dGUtbm8t/cGhvdG8uanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVJxdGky/NlZRal9mcy1faEwx/NW1KajZiODRGRVpO/YTAwRkpnWlJhRzVQ/RDQ9"
          }
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-gray-50"
        />
        <div className="space-y-2">
          <h3 className="md:text-lg font-semibold text-gray-900">
            Profile Picture
          </h3>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleProfilePictureClick}
              type="button"
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
              <p className="md:text-sm text-xs">Change Picture</p>
            </button>
            <span className="md:text-sm text-xs text-gray-400">
              JPG, PNG or GIF, Max size 2MB.
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
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
            />
            <span className="text-xs text-gray-500">
              Role can not be changed from this interface
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
                placeholder="Enter new password"
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
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Password Requirements Info */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4 text-(--text-color-primary-blue) font-medium md:text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          Password Requirements:
        </div>
        <ul className="space-y-2 md:text-sm text-(--text-color-primary-blue)">
          <li>At least 8 characters long</li>
          <li>Include uppercase and lowercase letters</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileView;
