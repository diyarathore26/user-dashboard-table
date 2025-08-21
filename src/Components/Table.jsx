import axios from "axios";
import React, { useEffect, useState } from "react";

const Table = () => {
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const getUserData = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  //  Search
  let filteredData = userData.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  //  Filter
  if (filter !== "all") {
    filteredData = filteredData.filter((user) =>
      user.website.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Sorting
  filteredData.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return sortOrder === "asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Delete User
  const handleDelete = (id) => {
    setUserData(userData.filter((user) => user.id !== id));
  };

  // Edit User
  const handleEdit = (user) => {
    setEditUser(user.id);
    setFormData({ name: user.name, email: user.email });
  };

  //Save andd Updated User
  const handleUpdate = (id) => {
    setUserData(
      userData.map((user) => (user.id === id ? { ...user, ...formData } : user))
    );
    setEditUser(null); 
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", fontFamily:"cursive"}}>User Details</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "16px",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: "8px", width: "250px" }}
        />

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: "8px" }}
        >
          <option value="all">All Websites</option>
          <option value="org">.org</option>
          <option value="net">.net</option>
          <option value="info">.info</option>
          <option value="biz">.biz</option>
        </select>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="asc">Sort: Name A → Z</option>
          <option value="desc">Sort: Name Z → A</option>
        </select>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 2fr 3fr 2fr 2fr 2fr",
          fontWeight: "bold",
          padding: "8px",
          borderBottom: "2px solid black",
        }}
      >
        <div>S No.</div>
        <div>Name</div>
        <div>Username</div>
        <div>Email</div>
        <div>Phone</div>
        <div>Website</div>
        <div>Actions</div>
      </div>

      {/* T Body */}
      {currentRows.length > 0 ? (
        currentRows.map((user, index) => (
          <div
            key={user.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 2fr 3fr 2fr 2fr 2fr",
              padding: "8px",
              borderBottom: "1px solid gray",
              alignItems: "center",
            }}
          >
            <div>{indexOfFirstRow + index + 1}</div>

            {/* Edit */}
            {editUser === user.id ? (
              <>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <div>{user.username}</div>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <div>{user.phone}</div>
                <div>{user.website}</div>
                <div>
                  <button onClick={() => handleUpdate(user.id)}>Save</button>
                  <button onClick={() => setEditUser(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div>{user.name}</div>
                <div>{user.username}</div>
                <div>{user.email}</div>
                <div>{user.phone}</div>
                <div>{user.website}</div>
                <div>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No matching results found.
        </div>
      )}

      {/* Pagi */}
      {filteredData.length > rowsPerPage && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
