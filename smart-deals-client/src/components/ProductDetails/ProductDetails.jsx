import React, { useRef, useContext, useEffect, useState } from "react";
import { useLoaderData, Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import Swal from 'sweetalert2';

const ProductDetails = () => {
  // ১. সব ডেটা এবং স্টেট আগে ডিক্লেয়ার করুন
  const product = useLoaderData() || {};
  const { user } = useContext(AuthContext);
  const bidModalRef = useRef(null);
  
  // বিডগুলো রাখার জন্য স্টেট
  const [bids, setBids] = useState([]);

  // ২. প্রোডাক্ট অবজেক্ট থেকে প্রপার্টিগুলো বের করে নিন (useEffect এর আগে)
  const {
    _id,
    title,
    price_min,
    price_max,
    category,
    created_at,
    image,
    status,
    location,
    seller_image,
    seller_name,
    condition,
    usage,
    description,
    seller_contact,
    email: seller_email, // email নামটা ক্ল্যাশ এড়াতে রিনেম করা হলো
  } = product;

  // ৩. বিড ডেটা ফেচ করার জন্য useEffect
  useEffect(() => {
    if (_id) {
      fetch(`http://localhost:3000/products/bids/${_id}`) // Template literal (``) ব্যবহার করুন
        .then((res) => res.json())
        .then((data) => {
          setBids(data);
        })
        .catch(err => console.error("Error fetching bids:", err));
    }
  }, [_id]); // _id চেঞ্জ হলে আবার রান হবে

  // Modal open
  const handleBidModalOpen = () => {
    if (bidModalRef.current) bidModalRef.current.showModal();
  };

  // Bid submit
  const handleBidSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const bid = form.bid.value;

    const newBid = {
      product_id: _id,
      product_title: title,
      buyer_name: name,
      buyer_email: email,
      bid_price: parseFloat(bid), // Number এ কনভার্ট করা ভালো
      status: "pending",
      seller_email: seller_email
    };

    fetch("http://localhost:3000/bids", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newBid),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          bidModalRef.current.close();
          form.reset(); // ফর্ম খালি করা
          
          // নতুন বিডটি লিস্টে তখনি যোগ করে দেওয়া (UI আপডেট)
          setBids([...bids, newBid]);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your bid has been placed",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  if (!_id) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-950 min-h-screen text-gray-100">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 mb-6 hover:text-purple-400 transition-colors">
        ← Back To Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-square border border-gray-800 shadow-2xl">
            <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-white">Product Description</h3>
            <div className="flex gap-8 mb-4 text-sm">
              <p><span className="text-purple-400 font-medium">Condition:</span> {condition}</p>
              <p><span className="text-purple-400 font-medium">Usage:</span> {usage}</p>
            </div>
            <hr className="border-gray-800 my-4" />
            <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{title}</h1>
            <span className="bg-purple-900/30 text-purple-400 border border-purple-800/50 px-4 py-1 rounded-full text-xs font-bold uppercase">
              {category}
            </span>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <h2 className="text-4xl font-black text-green-400">${price_min} - ${price_max}</h2>
            <p className="text-gray-500 text-sm mt-1 uppercase font-semibold">Price range starts from</p>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h3 className="font-bold text-lg mb-4 text-white">Seller Information</h3>
            <div className="flex items-center gap-4 mb-5 p-3 bg-gray-800/40 rounded-xl">
              <div className="avatar">
                <div className="w-14 rounded-full ring ring-purple-500 ring-offset-2">
                  <img src={seller_image} alt={seller_name} />
                </div>
              </div>
              <div>
                <p className="font-bold text-lg text-white">{seller_name}</p>
                <p className="text-xs text-purple-400">{seller_email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p className="text-gray-400 italic"><strong>Location:</strong> {location}</p>
              <p className="text-gray-400 italic"><strong>Contact:</strong> {seller_contact}</p>
            </div>
          </div>

          <button onClick={handleBidModalOpen} className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-2xl transition-all shadow-lg uppercase tracking-widest text-lg">
            I Want To Buy This Product
          </button>
        </div>
      </div>

      {/* Bids List Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-white mb-8">
          Bids For This <span className="text-purple-500">Product</span> : 
          <span className="bg-gray-800 ml-2 px-3 rounded text-green-400">{bids.length}</span>
        </h2>
        <div className="overflow-x-auto bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
          <table className="table w-full">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th>SL No</th>
                <th>Buyer Name</th>
                <th>Buyer Email</th>
                <th>Bid Price</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {bids.map((bid, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <th className="text-purple-500 font-mono">{index + 1}</th>
                  <td>{bid.buyer_name}</td>
                  <td>{bid.buyer_email}</td>
                  <td className="font-bold text-green-400">${bid.bid_price}</td>
                  <td className="text-center">
                    <span className="badge badge-outline border-purple-500 text-purple-400 uppercase text-xs">
                        {bid.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DaisyUI Modal */}
      <dialog ref={bidModalRef} className="modal">
        <div className="modal-box bg-gray-900 border border-gray-700">
          <h3 className="font-black text-2xl text-white">Give the best offer!</h3>
          <form onSubmit={handleBidSubmit} className="mt-4 space-y-4">
            <div>
              <label className="label text-gray-400">Name</label>
              <input type="text" className="input w-full bg-gray-800 text-white" name="name" readOnly defaultValue={user?.displayName || ""} />
            </div>
            <div>
              <label className="label text-gray-400">Email</label>
              <input type="email" className="input w-full bg-gray-800 text-white" name="email" readOnly defaultValue={user?.email || ""} />
            </div>
            <div>
              <label className="label text-gray-400">Your Bid ($)</label>
              <input type="number" className="input w-full bg-gray-800 text-white border-purple-500" name="bid" placeholder="Enter amount" required />
            </div>
            <div className="modal-action">
              <button type="button" onClick={() => bidModalRef.current.close()} className="btn btn-ghost text-gray-400">Cancel</button>
              <button type="submit" className="btn bg-purple-600 hover:bg-purple-500 text-white border-none">Submit Bid</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ProductDetails;