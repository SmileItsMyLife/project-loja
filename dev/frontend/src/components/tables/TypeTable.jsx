import { Table, Form, Button } from "react-bootstrap";
import { useState } from "react";

const TypeTable = ({ types, updateTypeById = null, deleteTypeById, createType }) => {
    const [editingRows, setEditingRows] = useState({});
    const [newTypeName, setNewTypeName] = useState("");

    const handleInputChange = (id, value) => {
        setEditingRows((prev) => ({
            ...prev,
            [id]: { ...prev[id], name: value },
        }));
    };

    const handleUpdate = async (id, originalName) => {
        if (!updateTypeById) return;

        const updates = editingRows[id] || {};
        const updatedName = updates.name ?? originalName;

        if (!updatedName.trim()) {
            alert("⚠️ Type name cannot be empty");
            return;
        }

        const res = await updateTypeById({ id, name: updatedName });
        if (!res.success) {
            alert("❌ Failed to update type");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this type?")) return;
        const res = await deleteTypeById(id);
        if (!res.success) {
            alert("❌ Failed to delete type");
        }
    };

    const handleCreate = async () => {
        if (!newTypeName.trim()) {
            alert("⚠️ Please enter a type name");
            return;
        }
        const res = await createType({ name: newTypeName });
        if (res.success) {
            setNewTypeName("");
        } else {
            alert("❌ Failed to create type");
        }
    };

    return (
        <div className="mt-5">
            <h3>📂 Manage Types</h3>

            <div className="d-flex mb-3">
                <Form.Control
                    type="text"
                    placeholder="New type name"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    style={{ maxWidth: "250px" }}
                />
                <Button variant="success" className="ms-2" onClick={handleCreate}>
                    ➕ Add Type
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type Name</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {types?.map((t) => (
                        <tr key={t.id}>
                            <td className="text-center">{t.id}</td>
                            <td>
                                <Form.Control
                                    type="text"
                                    value={editingRows[t.id]?.name ?? t.name}
                                    onChange={(e) => handleInputChange(t.id, e.target.value)}
                                />
                            </td>
                            <td className="text-center">
                                <Button variant="primary" onClick={() => handleUpdate(t.id, t.name)}>
                                    Update
                                </Button>
                            </td>
                            <td className="text-center">
                                <Button variant="danger" onClick={() => handleDelete(t.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TypeTable;
