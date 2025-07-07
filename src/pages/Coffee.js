import React, { useState, useEffect } from "react";
import {
  Coffee,
  Users,
  Clock,
  Plus,
  Minus,
  X,
  UserCheck,
  UserX,
  DollarSign,
} from "lucide-react";

const TIME_SLOTS = generateTimeSlots();

function generateTimeSlots() {
  const slots = [];
  const now = new Date();
  const minimumTime = new Date(now.getTime() + 15 * 60000); // Add 15 minutes

  for (let hour = 7; hour < 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const slotTime = new Date();
      slotTime.setHours(hour, minute, 0, 0);
      if (slotTime >= minimumTime) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }
  }

  return slots;
}

const CoffeeOrderingApp = () => {
  const [activeTab, setActiveTab] = useState("order");
  // Load state from localStorage or initialize
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]")
  );
  const [groups, setGroups] = useState(() =>
    JSON.parse(localStorage.getItem("groups") || "[]")
  );
  const [selectedGroup, setSelectedGroup] = useState(() =>
    JSON.parse(localStorage.getItem("selectedGroup") || "null")
  );
  const [orderHistory, setOrderHistory] = useState(() =>
    JSON.parse(localStorage.getItem("orderHistory") || "[]")
  );
  const [customerEmail, setCustomerEmail] = useState(
    () => localStorage.getItem("customerEmail") || ""
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [comments, setComments] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem("selectedGroup", JSON.stringify(selectedGroup));
  }, [selectedGroup]);

  useEffect(() => {
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem("customerEmail", customerEmail);
  }, [customerEmail]);

  // Initialize selected members when group changes
  useEffect(() => {
    if (selectedGroup) {
      setSelectedGroupMembers(
        selectedGroup.members.filter((member) => member.isActive)
      );
    } else {
      setSelectedGroupMembers([]);
    }
  }, [selectedGroup]);

  const coffeeMenu = [
    {
      id: 1,
      name: "Espresso",
      prices: { single: 2.3, double: 3.2 },
      category: "Coffee",
      description: "Rich and bold single shot",
      sizes: ["single", "double"],
    },
    {
      id: 2,
      name: "Americano",
      prices: { small: 2.6, large: 3.5 },
      category: "Coffee",
      description: "Espresso with hot water",
      sizes: ["small", "large"],
    },
    {
      id: 3,
      name: "Latte",
      prices: { medium: 4.3, large: 4.9 },
      category: "Coffee",
      description: "Espresso with steamed milk",
      sizes: ["medium", "large"],
    },
    {
      id: 4,
      name: "Cappuccino",
      prices: { small: 3.5, large: 4.6 },
      category: "Coffee",
      description: "Espresso with steamed milk foam",
      sizes: ["small", "large"],
    },
    {
      id: 5,
      name: "Mocha",
      prices: { small: 4.2, large: 5.4 },
      category: "Coffee",
      description: "Espresso with chocolate and steamed milk",
      sizes: ["small", "large"],
    },
    {
      id: 6,
      name: "Macchiato",
      prices: { small: 3.6, large: 4.7 },
      category: "Coffee",
      description: "Espresso with a dollop of foam",
      sizes: ["small", "large"],
    },
    {
      id: 7,
      name: "Green Tea",
      prices: { small: 2.4, large: 3.3 },
      category: "Tea",
      description: "Fresh green tea",
      sizes: ["small", "large"],
    },
    {
      id: 8,
      name: "Chai Latte",
      prices: { medium: 4.0, large: 4.5 },
      category: "Tea",
      description: "Spiced tea with steamed milk",
      sizes: ["medium", "large"],
    },
    {
      id: 9,
      name: "Hot Chocolate",
      prices: { regular: 3.5 },
      category: "Other",
      description: "Rich hot chocolate",
      sizes: ["regular"],
    },
    {
      id: 10,
      name: "Croissant",
      prices: { regular: 2.8 },
      category: "Food",
      description: "Buttery pastry",
      sizes: ["regular"],
    },
  ];

  const addToCart = (item, size = item.sizes[0]) => {
    const price = item.prices[size];
    const cartItem = {
      id: `${item.id}-${size}`,
      originalId: item.id,
      name: item.name,
      size: size,
      price: price,
      quantity: 1,
      category: item.category,
    };
    const existingItem = cart.find(
      (cartItem) => cartItem.id === `${item.id}-${size}`
    );
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === `${item.id}-${size}`
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, cartItem]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const createGroup = (groupName, members) => {
    const newGroup = {
      id: Date.now(),
      name: groupName,
      members: members.map((member) => ({
        ...member,
        isActive: true,
        paymentHistory: [],
        totalPaid: 0,
        ordersCount: 0,
      })),

      lastOrder: null,
      paymentRotation: 0,
    };
    setGroups([...groups, newGroup]);
    setShowGroupModal(false);
  };

  const toggleMemberActive = (groupId, memberId) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.map((member) =>
                member.id === memberId
                  ? { ...member, isActive: !member.isActive }
                  : member
              ),
            }
          : group
      )
    );
  };

  const getNextPayer = (group) => {
    const activeMembers = group.members.filter((member) => member.isActive);
    if (activeMembers.length === 0) return null;
    return activeMembers[group.paymentRotation % activeMembers.length];
  };

  const sendOrderEmail = async (order) => {
    console.log("Sending order confirmation...");
    alert(`Order confirmation sent to ${customerEmail}`);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!selectedTime) {
      alert("Please select a pickup time!");
      return;
    }
    if (!customerEmail) {
      alert("Please enter your email address!");
      return;
    }

    const order = {
      id: Date.now(),
      items: [...cart],
      total: getTotalPrice(),
      pickupTime: selectedTime,
      comments: comments,
      group: selectedGroup,
      selectedMembers: selectedGroupMembers,

      status: "pending",
      customerEmail: customerEmail,
      paidBy: selectedGroup ? getNextPayer(selectedGroup)?.name : null,
    };

    setOrderHistory([...orderHistory, order]);

    if (selectedGroup) {
      setGroups(
        groups.map((group) =>
          group.id === selectedGroup.id
            ? {
                ...group,
                paymentRotation: group.paymentRotation + 1,
                lastOrder: order,
              }
            : group
        )
      );
    }

    await sendOrderEmail(order);

    setCart([]);
    setComments("");
    setSelectedTime("");
    setSelectedGroupMembers([]);

    alert("Order placed successfully!");
  };

  const toggleGroupMemberSelection = (member) => {
    setSelectedGroupMembers((prev) => {
      const isSelected = prev.find((m) => m.id === member.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const GroupModal = () => {
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState([{ id: 1, name: "", email: "" }]);

    const addMember = () => {
      setMembers([...members, { id: Date.now(), name: "", email: "" }]);
    };

    const removeMember = (id) => {
      setMembers(members.filter((member) => member.id !== id));
    };

    const updateMember = (id, field, value) => {
      setMembers(
        members.map((member) =>
          member.id === id ? { ...member, [field]: value } : member
        )
      );
    };

    const handleSubmit = () => {
      if (!groupName.trim()) {
        alert("Please enter a group name");
        return;
      }
      const validMembers = members.filter((member) => member.name.trim());
      if (validMembers.length === 0) {
        alert("Please add at least one member");
        return;
      }
      createGroup(groupName, validMembers);
      setGroupName("");
      setMembers([{ id: 1, name: "", email: "" }]);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Create New Group</h3>
            <button
              onClick={() => setShowGroupModal(false)}
              className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Office Team"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Members</label>
            {members.map((member) => (
              <div key={member.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) =>
                    updateMember(member.id, "name", e.target.value)
                  }
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) =>
                    updateMember(member.id, "email", e.target.value)
                  }
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email (optional)"
                />
                {members.length > 1 && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="text-red-500 hover:text-red-700">
                    <Minus size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addMember}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
              <Plus size={16} /> Add Member
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
              Create Group
            </button>
            <button
              onClick={() => setShowGroupModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderOrderTab = () => (
    <div className="space-y-6">
      {/* Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coffeeMenu.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            <div className="mb-3">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {item.category}
              </span>
            </div>
            <div className="space-y-2">
              {item.sizes.map((size) => (
                <div key={size} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {size === "single"
                        ? "Single Shot"
                        : size === "double"
                        ? "Double Shot"
                        : size.charAt(0).toUpperCase() + size.slice(1)}
                    </span>
                    <span className="text-green-600 font-bold">
                      €{item.prices[size]}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(item, size)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm">
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart */}
      {cart.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold mb-3">Your Order</h3>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
                    <Plus size={12} />
                  </button>
                </div>
                <div>
                  <span>{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({item.size})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center font-semibold">
              <span>Total: €{getTotalPrice()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Order Details */}
      {cart.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
          <h3 className="font-semibold">Order Details</h3>
          {/* Customer Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Email Address *
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
              required
            />
          </div>
          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Pickup Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select pickup time</option>
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Order for Group (Optional)
            </label>
            <select
              value={selectedGroup?.id || ""}
              onChange={(e) => {
                const group = groups.find(
                  (g) => g.id === parseInt(e.target.value)
                );
                setSelectedGroup(group || null);
              }}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Personal order</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          {/* Group Member Selection */}
          {selectedGroup && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Members for this Order
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedGroup.members
                  .filter((member) => member.isActive)
                  .map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`member-${member.id}`}
                        checked={
                          selectedGroupMembers.find(
                            (m) => m.id === member.id
                          ) !== undefined
                        }
                        onChange={() => toggleGroupMemberSelection(member)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`member-${member.id}`}
                        className="text-sm">
                        {member.name}
                      </label>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {selectedGroupMembers.length} of{" "}
                {selectedGroup.members.filter((m) => m.isActive).length} members
                selected
              </p>
            </div>
          )}
          {/* Comments */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Special Instructions
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Any special requests or modifications..."
            />
          </div>
          {/* Payment Info */}
          {selectedGroup && (
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm">
                <strong>Next to pay:</strong>{" "}
                {getNextPayer(selectedGroup)?.name || "No active members"}
              </p>
            </div>
          )}
          <button
            onClick={placeOrder}
            className="w-full bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 transition-colors font-semibold">
            Place Order - Pay at Till
          </button>
        </div>
      )}
    </div>
  );

  const renderGroupsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Groups</h2>
        <button
          onClick={() => setShowGroupModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2">
          <Plus size={16} /> Create Group
        </button>
      </div>
      {groups.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No groups yet. Create one to start ordering for your team!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{group.name}</h3>
              </div>
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Members:</p>
                <div className="space-y-1">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            member.isActive ? "text-green-600" : "text-gray-400"
                          }>
                          {member.isActive ? (
                            <UserCheck size={16} />
                          ) : (
                            <UserX size={16} />
                          )}
                        </span>
                        <span
                          className={
                            member.isActive ? "" : "line-through text-gray-400"
                          }>
                          {member.name}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleMemberActive(group.id, member.id)}
                        className={`px-2 py-1 rounded text-xs ${
                          member.isActive
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}>
                        {member.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-sm">
                  <strong>Next to pay:</strong>{" "}
                  {getNextPayer(group)?.name || "No active members"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                    Use for Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Order History</h2>
        <div className="text-sm text-gray-500">
          {orderHistory.length} orders placed
        </div>
      </div>
      {orderHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No orders yet. Place your first order to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orderHistory
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      €{order.total}
                    </div>
                    <div className="text-sm text-gray-500">
                      Pickup: {order.pickupTime}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Items:</p>
                  <div className="text-sm text-gray-600">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.quantity}x {item.name} ({item.size}) - €
                        {(item.price * item.quantity).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
                {order.group && (
                  <div className="mb-3 text-sm">
                    <strong>Group:</strong> {order.group.name}
                    {order.paidBy && (
                      <span className="ml-2 text-green-600">
                        Paid by: {order.paidBy}
                      </span>
                    )}
                  </div>
                )}
                {order.comments && (
                  <div className="mb-3 text-sm">
                    <strong>Comments:</strong> {order.comments}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="text-gray-800" size={24} />
              <h1 className="text-2xl font-bold text-gray-800">Coffee Hub</h1>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("order")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "order"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}>
            <Coffee size={16} className="inline mr-2" />
            Order
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "groups"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}>
            <Users size={16} className="inline mr-2" />
            Groups ({groups.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "history"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}>
            <Clock size={16} className="inline mr-2" />
            History ({orderHistory.length})
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === "order" && renderOrderTab()}
        {activeTab === "groups" && renderGroupsTab()}
        {activeTab === "history" && renderHistoryTab()}
      </div>
      {/* Modals */}
      {showGroupModal && <GroupModal />}
    </div>
  );
};

export default CoffeeOrderingApp;
