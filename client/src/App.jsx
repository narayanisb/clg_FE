import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;
function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  async function loadStudents() {
    try {
      const response = await fetch(`${API}/api/students`);
      if (!response.ok) throw new Error("Unable to load students");
      setStudents(await response.json());
    } catch {
      setMessage("Could not connect to the server.");
    }
  }
  useEffect(() => {
    loadStudents();
      }, []);
  async function addStudent(event) {
    event.preventDefault();
    setMessage("");
    try {
      const response = await fetch(`${API}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setName("");
      setEmail("");
      setMessage("Student added successfully.");
      await loadStudents();
    } catch (error) {
      setMessage(error.message || "Unable to add student.");
    }
  }
  return (
    <main style={{ maxWidth: 650, margin: "40px auto",
      fontFamily: "Arial", padding: 20 }}>
      <h1>Student Management System</h1>
      <form onSubmit={addStudent}>
        <input
          placeholder="Student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Student email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Add Student</button>
      </form>
      <p>{message}</p>
      <h2>Registered Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.name} — {student.email}
          </li>
        ))}
      </ul>
    </main>
  );
}
export default App;