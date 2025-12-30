import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    company: "",
  });

const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('adminToken'); // Clear token
  navigate('/');              // Redirect to login
};

  const token = localStorage.getItem('adminToken');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://ecommerce-backend-yj8d.onrender.com/api/admin/users', config);
      const data = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users', err);
      setUsers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://ecommerce-backend-yj8d.onrender.com/api/admin/products', config);
      const data = Array.isArray(res.data) ? res.data : res.data.products || [];
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products', err);
      setProducts([]);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(
        `https://ecommerce-backend-yj8d.onrender.com/api/admin/users/${userId}`,
        { active: !currentStatus },
        config
      );
      fetchUsers();
    } catch (err) {
      console.error('Error updating user', err);
    }
  };

  const toggleProductAvailability = async (productId, currentStatus) => {
    try {
      await axios.put(
        `https://ecommerce-backend-yj8d.onrender.com/api/admin/products/${productId}`,
        { available: !currentStatus },
        config
      );
      fetchProducts();
    } catch (err) {
      console.error('Error updating product', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

 const handleAddProduct = async (e) => {
    e.preventDefault();


    const { name, price, image, description, category, company } = newProduct;

    if (!name || !price || !image || !description || !category || !company) {
      alert("Please fill in all fields");
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      new URL(image);
    } catch (error) {
      alert("Please enter a valid image URL");
      return;
    }

    try {
      const response = await axios.post("https://ecommerce-backend-yj8d.onrender.com/api/products", {
        name,
        price: Number(price),
        image,
        description,
        category,
        company,
      });

      if (response.data.success) {
        alert("Product submitted successfully!");
        setNewProduct({
          name: "",
          price: "",
          image: "",
          description: "",
          category: "",
          company: "",
        });
      } else {
        alert(response.data.message || "Failed to submit product");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      if (error.code === "ERR_NETWORK") {
        alert("Cannot connect to server. Please make sure the backend is running.");
      } else {
        alert(error.response?.data?.message || "Failed to submit product. Please try again.");
      }
    } finally {
      fetchProducts(); // Refresh product list after adding a new product
    }
  };


  return (
   <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
  {/* Top Navigation Bar */}
  <nav className="flex justify-between items-center bg-white text-gray-800 px-6 py-4 rounded-xl mb-8 shadow-lg sticky top-4 z-10">
    <div className="text-2xl font-bold tracking-tight flex items-center gap-2">
      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
      Admin Dashboard
    </div>
    <button
      onClick={handleLogout}
      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-150"
    >
      Logout
    </button>
  </nav>

  <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-800 tracking-tight">
    Welcome, Admin
  </h1>

  {/* Users Section */}
  <section className="mb-12">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-700">Users <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{users.length}</span></h2>
    </div>
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800">
            <th className="p-3 text-left font-semibold">Email</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-blue-50 transition">
              <td className="p-3">{u.email}</td>
              <td className="p-3">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${u.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {u.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="p-3">
                <button
                  onClick={() => toggleUserStatus(u._id, u.active)}
                  className={`px-4 py-1 rounded-lg text-white font-medium shadow transition-all duration-150 ${
                    u.active
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
                  }`}
                >
                  {u.active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>

  {/* Products Section */}
  <section className="mb-12">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-700">Products <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">{products.length}</span></h2>
    </div>
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl">
        <thead>
          <tr className="bg-gradient-to-r from-green-50 to-green-100 text-green-800">
            <th className="p-3 text-left font-semibold">Name</th>
            <th className="p-3 text-left font-semibold">Price</th>
            <th className="p-3 text-left font-semibold">Available</th>
            <th className="p-3 text-left font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-green-50 transition">
              <td className="p-3">{p.name}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.available ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="p-3">
                <button
                  onClick={() => toggleProductAvailability(p._id, p.available)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-1 rounded-lg font-medium shadow transition-all duration-150"
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>

  {/* Add Product Form */}
  <section>
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-gray-700">Add New Product</h2>
    </div>
    <form onSubmit={handleAddProduct} className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Image URL</label>
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Company</label>
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={newProduct.company}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-150"
        >
          Add Product
        </button>
      </div>
    </form>
  </section>
</div>

  );
}

export default AdminDashboard;
