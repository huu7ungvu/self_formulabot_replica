'use client'; // Thêm directive vì đây là Client Component
import React, { useCallback, useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';

export default function CardSettings({ user }) {
  if (!user) {
    return <div className="p-4">Loading profile...</div>;
  }

  const jobTitles = [
    { value: "developer", text: "Developer" },
    { value: "designer", text: "Data Science" },
    { value: "manager", text: "Project Manager" },
    { value: "analyst", text: "Analyst" },
    { value: "qa", text: "QA Engineer" },
  ];

  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadPathAvatar, setUploadPathAvatar] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [email, setEmail] = useState(null);
  const [company, setCompany] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [address, setAddress] = useState(null);

  // Lấy thông tin profile từ Supabase
  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, email, company, job_title, address, avatar_url`)
        // .eq('id', user.id)
        .single();

      if (error && status !== 406) throw error;
      if (data) {
        setFullname(data.full_name);
        setEmail(data.email);
        setCompany(data.company);
        setJobTitle(data.job_title);
        setAddress(data.address);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  // Tải ảnh avatar từ Supabase Storage
  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log('Error downloading image: ', error);
      }
    }

    if (avatarUrl && !avatarUrl.startsWith('blob:')) {
      downloadImage(avatarUrl);
    }
  }, [avatarUrl, supabase]);

  // Xử lý upload avatar
  const uploadAvatar = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // const { error: uploadError } = await supabase.storage
      //   .from('avatars')
      //   .upload(filePath, file);

      // if (uploadError) throw uploadError;

      // Cập nhật avatar_url trong bảng profiles
      // const { error: updateError } = await supabase
      //   .from('profiles')
      //   .update({ avatar_url: filePath })
      //   .eq('id', user.id);

      // const newAvatarUrl = filePath;
      // setAvatarUrl(filePath);
      setAvatarUrl(URL.createObjectURL(file));
      setUploadPathAvatar({
        "file": file,
        "path": filePath
      });

      // if (updateError) throw updateError;
      // alert('Avatar updated successfully!');
    } catch (error) {
      alert('Error uploading avatar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật profile
  const updateProfile = async () => {
    try {
      setLoading(true);
      const updates = {
        id: user.id,
        full_name: fullname,
        email,
        company,
        job_title: jobTitle,
        address,
        // avatar_url: avatarUrl, 
        updated_at: new Date().toISOString(),
      };

      // Nếu có file avatar mới, upload lên Supabase Storage
      if (uploadPathAvatar) {
        const { file, path } = uploadPathAvatar;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, file);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: path })
          .eq('id', user.id);
        if (uploadError || updateError) throw uploadError || updateError;
        updates.avatar_url = path; // Cập nhật đường dẫn avatar mới
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi chọn job title từ dropdown
  const handleJobTitleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedJob = jobTitles.find((job) => job.value === selectedValue);
    setJobTitle(selectedJob ? selectedJob.text : ""); // Lưu text thay vì value
  };

  return (
    <div className="relative flex flex-col min-w-0 w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      {/* Header with avatar on top-left */}
      <div className="rounded-t bg-white mb-0 px-6 py-4 flex items-center">
        <h6 className="text-blueGray-700 text-xl font-bold flex-1">
          My account
        </h6>
        <button
          className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button"
          onClick={updateProfile}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>

      {/* Body */}
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            User Information
          </h6>
          <div className="flex flex"> 
            <div className="mr-4 flex flex-col items-center">
              <img
                alt="Avatar"
                src={avatarUrl || "https://via.placeholder.com/150"}
                className="h-20 w-20 rounded-full object-cover shadow-md flex justify-center"
              />
              {/* Button upload avatar */}
              {/* Button upload avatar tùy chỉnh */}
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-upload"
                  onChange={uploadAvatar}
                  disabled={loading}
                  className="hidden" // Ẩn input file
                />
                <label
                  htmlFor="avatar-upload"
                  className={`bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Uploading...' : 'Change Avatar'}
                </label>
              </div>
            </div>
            <div className="flex flex-wrap">
              {/* Full Name */}
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="full-name"
                  >
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={fullname || ""}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Company */}
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="company"
                  >
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={company || ""}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

              {/* Job Title */}
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="jobTitle"
                  >
                    Job Title
                  </label>
                  <div className="flex items-center">
                    <select
                      id="jobTitle"
                      name="jobTitle"
                      onChange={handleJobTitleChange}
                      className="block w-full px-3 py-2 text-sm text-blueGray-700 bg-white border border-blueGray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    >
                      <option value="">{jobTitle||''}</option>
                      {jobTitles.map((job) => (
                        <option key={job.value} value={job.value}>
                          {job.text}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <input
                    id="jobTitle"
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={jobTitle || ""}
                    onChange={(e) => setJobTitle(e.target.value)}
                  /> */}
                </div>
              </div>

              {/* Address */}
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={address || ""}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}