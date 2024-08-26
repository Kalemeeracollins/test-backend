

//   return (
//     <div>
//       <h1>Welcome, {userData.uname}</h1>
//       <p>Email: {userData.email}</p>
//       <p>Phone: {userData.phone}</p>
//       <p>Upline: {userData.upline}</p>
//       {/* Display other data as needed */}
//     </div>
//   );
// }
'use client'
import { Home, LayoutDashboard, FileText, MessageCircle, Youtube, Store, HeadphonesIcon, LogOut, Wallet, User, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Component() {

  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}userdata`,
          { headers }
        );

        console.log(response)
        // Access the userdetails inside the data object
        if (response.data && response.data.data && response.data.data.userdetails && response.data.data.balances) {
          // Merge user details and balances into one object
          const mergedData = {
            ...response.data.data.userdetails,
            ...response.data.data.balances
          };
          setUserData(mergedData);
        } else {
          console.error('userdetails or balances not found in response:', response.data);
          router.push('/login');
        }
      } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);

        if (error.response && error.response.status === 401) {
          Cookies.remove('access_token');
          router.push('/login');
        } else {
          alert('An error occurred while fetching data.');
        }
      }
    };

    fetchData();
  }, [router]);
  
  const logout = () => {
    Cookies.remove('access_token');
    router.push('/login')
  }

  if (!userData) return <div>Loading...</div>;
  return (
    <div className="flex h-screen bg-gradient-to-br from-yellow-200 via-green-200 to-pink-200">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-300 via-yellow-200 to-green-300 p-4">
        <nav className="space-y-4">
          <SidebarItem icon={<Home />} label="Home" />
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" />
          <SidebarItem icon={<FileText />} label="Transactions" />
          <SidebarItem icon={<MessageCircle />} label="Whatsapp" />
          <SidebarItem icon={<Youtube />} label="Youtube" />
          <SidebarItem icon={<Store />} label="Market Store" />
          <SidebarItem icon={<HeadphonesIcon />} label="Customer Care" />
          <div className="flex-grow" />
          <button onClick={logout}>
          <SidebarItem icon={<LogOut />} label="LogOut" onClick={logout}/>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="bg-yellow-300 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">{userData.uname}, welcome to your professional dashboard for Tronq Agencies</h1>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image src="/man.jpeg" alt="User" width={40} height={40} className="rounded-full" />
              <span>{userData.uname}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded">Invitation Link</button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard title="BALANCE" amount={userData.actbals} icon={<Wallet />} description="My current Balance" gradient="from-orange-400 to-pink-500" />
          <DashboardCard title="DEPOSIT" amount={userData.deposit} icon={<MessageCircle />} description="My Whatsapp Balance" gradient="from-purple-400 to-pink-500" />
          <DashboardCard title="WITHDRAWN" amount={userData.totalwithdrawal} icon={<Wallet />} description="My Withdrawn Amount" gradient="from-pink-400 to-purple-500" />
          <DashboardCard title="PENDING WITHDRAWAL" amount={userData.pendingwithdrawal} icon={<Wallet />} description="My Withdrawn Amount" gradient="from-pink-400 to-purple-500" />
          <DashboardCard title="MY PROFITS" amount={userData.profit} icon={<Wallet />} description="My cashback is redeemable" gradient="from-pink-400 to-yellow-300" />
          <DashboardCard title="YOUTUBE" amount={userData.youtube} icon={<Youtube />} description="My youtube balance" gradient="from-pink-500 to-purple-700" />
          <DashboardCard title="TRIVIA" amount={userData.trivia} icon={<User />} description="Overview of refferal Earnings" gradient="from-orange-400 to-pink-400" />
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-gradient-to-r from-green-300 to-pink-300 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            <TransactionItem type="Transfer" status="Failed" date="June 5, 2023" amount="$29.99" />
            <TransactionItem type="Withdraw" status="Completed" date="June 7, 2023" amount="$79.99" />
          </div>
        </div>

        {/* Referral */}
        <div className="mt-8 bg-gradient-to-r from-yellow-200 to-green-300 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Referral</h2>
          <div className="flex justify-between items-center">
            <span>Performance</span>
            <select className="border rounded p-2">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>1</span>
              <span>People Reached</span>
            </div>
            <div className="flex justify-between">
              <span>0</span>
              <span>Follows</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center space-x-2 text-gray-700 hover:bg-white hover:bg-opacity-20 rounded p-2 cursor-pointer">
      {icon}
      <span>{label}</span>
    </div>
  )
}

function DashboardCard({ title, amount, icon, description, gradient }) {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-lg p-6 text-white`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-bold mb-2">{amount}</p>
      <p>{description}</p>
    </div>
  )
}

function TransactionItem({ type, status, date, amount }) {
  return (
    <div className="flex justify-between items-center bg-white bg-opacity-50 rounded p-4">
      <div>
        <p className="font-bold">{type}</p>
        <p className={status === 'Failed' ? 'text-red-500' : 'text-green-500'}>{status}</p>
        <p>{date}</p>
      </div>
      <p className="font-bold">{amount}</p>
    </div>
  )
}