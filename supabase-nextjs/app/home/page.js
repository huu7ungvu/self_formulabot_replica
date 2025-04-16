'use client'
import React, { useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';
import CardUserManagement from "../../components/Cards/CardUserManagement.js";
import Home from "../../layouts/Home.js";

// Khởi tạo Supabase client một lần
const supabase = createClient();

export default function UserManagement() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          throw new Error("Error fetching user: " + error.message);
        }
        if (!user) {
          throw new Error("No user found");
        }

        setUser(user);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Chạy một lần khi component mount;

  // print user data
  console.log(user);

  return (
    <Home>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-full px-4"> {/* Sửa lg-full thành lg:w-full */}
          <CardUserManagement user={user} />
        </div>
      </div>
    </Home>
  );

  // return user data json
  // return (
  //   <div className="flex flex-wrap">
  //     <div className="w-full lg:w-full px-4"> {/* Sửa lg-full thành lg:w-full */}
  //       {loading ? (
  //         <p>Loading...</p>
  //       ) : error ? (
  //         <p>Error: {error}</p>
  //       ) : (
  //         <pre>{JSON.stringify(user, null, 2)}</pre>
  //       )}
  //     </div>
  //   </div>
  // );
}