import { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal, Input, Toast } from '../../components/ui';
import { Plus, Edit, Users, Stethoscope } from 'lucide-react';

export default function DepartmentManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [toast, setToast] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);
  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleEdit = (dept) => {
    setEditDept(dept);
    setName(dept.name || '');
    setDescription(dept.description || '');
    setIcon(dept.icon || '');
    setShowModal(true);
  };
  const handleAdd = () => {
    setEditDept(null);
    setName('');
    setDescription('');
    setIcon('');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const departmentData = {
        name,
        description,
        icon,
      };

      const url = editDept
        ? `/api/departments/${editDept._id}`
        : '/api/departments';

      const method = editDept ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save department');
      }

      await fetchDepartments();

      setShowModal(false);

      setToast({
        message: editDept
          ? 'Department updated'
          : 'Department added',
        type: 'success',
      });
    } catch (error) {
      console.error('Error saving department:', error);

      setToast({
        message: error.message,
        type: 'danger',
      });
    }
  };

  return (
    <div id="department-management-page" className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Departments</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage hospital departments</p>
        </div>
        <Button icon={Plus} onClick={handleAdd}>Add Department</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departments.map((dept, i) => {

          return (
            <Card key={dept._id} hover className="animate-fade-in-up group" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${dept.color}15` }}>
                  {dept.icon}
                </div>
                <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEdit(dept)} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">{dept.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">{dept.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  <Stethoscope size={14} /> 0 doctors
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editDept ? 'Edit Department' : 'Add Department'} size="md"
        footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}
      >
        <div className="space-y-4">

          <Input
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cardiology"
          />

          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description"
          />

          <Input
            label="Icon (emoji)"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="❤️"
          />
        </div>
      </Modal>
    </div>
  );
}
