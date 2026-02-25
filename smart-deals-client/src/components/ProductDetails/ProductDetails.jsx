import React, { useRef, useContext } from "react";
import { useLoaderData, Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

const ProductDetails = () => {
  // Loader থেকে product directly
  const product = useLoaderData() || {};
  const bidModalRef = useRef(null);

  // AuthContext থেকে user
  const { user } = useContext(AuthContext);

  // Product properties
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
    email,
  } = product;

  // Modal open
  const handleBidModalOpen = () => {
    if (bidModalRef.current) bidModalRef.current.showModal();
  };

  // Bid submit
  const handleBidSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const bid = e.target.bid.value;
    console.log("Bid Data:", { name, email, bid, product_id: _id });
    bidModalRef.current.close();
    const newBid={
        product:_id,
        buyer_name:name,
        buyer_email:email,
        bid_price:bid,
        status:'pending'
    }
    fetch('http://localhost:3000/bids',{
        method:"POST",
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(newBid)
    })
    .then(res=>res.json())
    .then(data=>{
        console.log('after placing bid ',data)
    })
  };

  // Loading fallback
  if (!_id) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-white">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-950 min-h-screen text-gray-100">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-400 mb-6 hover:text-purple-400 transition-colors"
      >
        ← Back To Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-square border border-gray-800 shadow-2xl">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Product Description */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-white">
              Product Description
            </h3>
            <div className="flex gap-8 mb-4 text-sm">
              <p>
                <span className="text-purple-400 font-medium">Condition:</span>{" "}
                {condition}
              </p>
              <p>
                <span className="text-purple-400 font-medium">Usage Time:</span>{" "}
                {usage}
              </p>
            </div>
            <hr className="border-gray-800 my-4" />
            <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
              {title} <span className="text-purple-500">For Sale</span>
            </h1>
            <span className="bg-purple-900/30 text-purple-400 border border-purple-800/50 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {category}
            </span>
          </div>

          {/* Pricing */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <h2 className="text-4xl font-black text-green-400">
              ${price_min} - ${price_max}
            </h2>
            <p className="text-gray-500 text-sm mt-1 uppercase font-semibold">
              Price range starts from
            </p>
          </div>

          {/* Product Details */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h3 className="font-bold text-lg mb-3 text-white border-b border-gray-800 pb-2">
              Product Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-sm text-gray-400">
                <strong>Product ID:</strong>{" "}
                <span className="text-gray-200">{_id}</span>
              </p>
              <p className="text-sm text-gray-400">
                <strong>Posted:</strong>{" "}
                <span className="text-gray-200">
                  {created_at ? new Date(created_at).toLocaleDateString() : "-"}
                </span>
              </p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
            <h3 className="font-bold text-lg mb-4 text-white">Seller Information</h3>
            <div className="flex items-center gap-4 mb-5 p-3 bg-gray-800/40 rounded-xl">
              <div className="avatar">
                <div className="w-14 rounded-full ring ring-purple-500 ring-offset-base-100 ring-offset-2">
                  <img src={seller_image} alt={seller_name} />
                </div>
              </div>
              <div>
                <p className="font-bold text-lg text-white">{seller_name}</p>
                <p className="text-xs text-purple-400">{email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p className="text-gray-400 italic">
                <strong>Location:</strong> {location}
              </p>
              <p className="text-gray-400 italic">
                <strong>Contact:</strong> {seller_contact}
              </p>
            </div>
            <div className="mt-4">
              <span className="bg-orange-500/10 text-orange-500 border border-orange-500/30 px-4 py-1 rounded-md text-xs uppercase font-black">
                {status}
              </span>
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={handleBidModalOpen}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-purple-900/20 uppercase tracking-widest text-lg"
          >
            I Want To Buy This Product
          </button>
        </div>
      </div>

      {/* Bids Table */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-white mb-8">
          Bids For This{" "}
          <span className="text-purple-500 underline decoration-indigo-500">
            Product
          </span>{" "}
          : <span className="bg-gray-800 px-3 rounded text-green-400">03</span>
        </h2>
        <div className="overflow-x-auto bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
          <table className="table w-full">
            <thead className="bg-gray-800 text-gray-300">
              <tr className="border-b border-gray-700">
                <th className="py-4">SL No</th>
                <th>Product</th>
                <th>Seller</th>
                <th>Bid Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <th className="text-purple-500 font-mono">01</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      <img src={image} className="object-cover w-full h-full" alt="" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{title}</div>
                      <div className="text-xs text-gray-500">${price_min}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm font-bold text-gray-200">{seller_name}</div>
                  <div className="text-xs text-gray-500">{email}</div>
                </td>
                <td className="font-bold text-green-400 text-lg">$1,250</td>
                <td className="flex gap-2 justify-center py-6">
                  <button className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none">
                    Accept
                  </button>
                  <button className="btn btn-sm bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50">
                    Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DaisyUI Modal */}
      <dialog ref={bidModalRef} className="modal">
        <div className="modal-box bg-gray-900 border border-gray-700 shadow-2xl">
          <h3 className="font-black text-2xl text-white">Give the best offer!</h3>
          <p className="py-4 text-gray-400 italic">
            Offer something the seller cannot resist for this {title}.
          </p>

          <form onSubmit={handleBidSubmit}>
            <fieldset className="fieldset">
              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                name="name"
                readOnly
                defaultValue={user?.displayName || ""}
              />
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                name="email"
                readOnly
                defaultValue={user?.email || ""}
              />
              <label className="label">Bid</label>
              <input type="text" className="input" name="bid" placeholder="Your Bid" />
              <div className="modal-action">
                <div method="dialog" className="flex gap-3">
                  <button className="btn btn-ghost text-gray-400 hover:text-white">
                    Cancel
                  </button>
                  <button className="btn bg-purple-600 hover:bg-purple-500 text-white border-none px-8">
                    Submit Bid
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ProductDetails;

// 56.5 start inshaallah