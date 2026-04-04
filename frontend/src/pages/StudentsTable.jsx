const StudentsTable = ({ students }) => {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Category</th>
            <th>Allocated Room</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.selectedCategory || "-"}</td>
              <td>{student.allocatedRoom?.roomNumber || "-"}</td>
              <td>
                <span className={`badge ${student.allocatedRoom ? "available" : "almost-full"}`}>
                  {student.allocatedRoom ? "Allocated" : "Pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
