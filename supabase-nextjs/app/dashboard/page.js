'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Home from "../../layouts/Home.js";
import CardLineChart from "../../components/Cards/CardLineChart.js";

export default function DashBoardUser() {
  const supabase = createClient();
  const [data, setData] = useState(null);
//   const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        setLoading(true);
        setError(null);

        // // Lấy thông tin user
        // const { data: { user }, error: userError } = await supabase.auth.getUser();
        // if (userError) {
        //   throw new Error('Error fetching user: ' + userError.message);
        // }
        // if (!user) {
        //   throw new Error('No user found. Please log in.');
        // }

        // setUser(user);

        // Lấy dữ liệu từ daily_spending
        const { data: spendingData, error: dataError } = await supabase
          .from('daily_spending')
          .select('*')
          .order('date', { ascending: false })
        //   .eq('user_id', user.id); // Lọc theo user_id

        if (dataError) {
          throw new Error('Error fetching data: ' + dataError.message);
        }

        setData(spendingData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, []); // Chạy một lần khi component mount

  return (
    <Home>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardLineChart />
        </div>
      </div>
    </Home>
  );
}