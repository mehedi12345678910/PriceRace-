import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

const MyBids = () => {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/bids?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setBids(data);
        });
    }
  }, [user?.email]);

  const handleDeleteBid = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1", // Indigo color to match
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937", // SweetAlert dark background
      color: "#fff"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/bids/${_id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Your bid has been deleted.",
                icon: "success",
                background: "#1f2937",
                color: "#fff"
              });
              const remainingBids = bids.filter((bid) => bid._id !== _id);
              setBids(remainingBids);
            }
          });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-10 font-sans min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-extrabold text-white">
          My Bids: <span className="text-indigo-400">{bids.length}</span>
        </h2>
        <p className="text-gray-400 mt-2">Manage your active bids and track status</p>
      </div>

      {/* Table Container - Dark Mode Optimized */}
      <div className="overflow-x-auto bg-gray-900/50 rounded-xl border border-gray-800 shadow-2xl backdrop-blur-sm">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SL No</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Buyer Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Bid Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {bids.map((bid, index) => (
              <tr key={bid._id} className="hover:bg-white/5 transition-all duration-200">
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">
                  {index + 1}
                </td>

                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                      <span className="text-indigo-400 font-bold text-xl uppercase">
                        {bid.buyer_name ? bid.buyer_name.charAt(0) : "P"}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-100 leading-tight">Product ID</div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">{bid.product}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-200">{bid.buyer_name}</div>
                  <div className="text-xs text-gray-500">{bid.buyer_email}</div>
                </td>

                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-base font-bold text-indigo-300">${bid.bid_price}</span>
                </td>

                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5 w-fit
                    ${bid.status === "pending" 
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" 
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${bid.status === "pending" ? "bg-orange-400" : "bg-emerald-400"}`}></span>
                    {bid.status}
                  </span>
                </td>

                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleDeleteBid(bid._id)}
                    className="px-5 py-1.5 border border-red-500/30 text-red-400 rounded-md text-xs font-bold hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg shadow-red-500/10"
                  >
                    Remove Bid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBids;