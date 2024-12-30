'use client'
import React, { Suspense, useState, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import { searchUsers, updateUser } from '@/app/actions/actions'
import UserCard from './user-card'
import { User } from '@/app/actions/schemas'
import EditUserModal from './edit-user-modal'

interface Option {
  value: string;
  label: string;
  user: User;
}

export default function UserSearch() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    const users = await searchUsers(inputValue);
    return users.map(user => ({
      value: user.id,
      label: user.name,
      user: user, // Ensure user is defined
    }));
  }

  const handleChange = (option: Option | null) => {
    if (option && option.user) {
      setSelectedUser(option.user);
    } else {
      setSelectedUser(null);
    }
  }

  const handleEdit = (user: User) => {
    console.log('Editing user:', user);
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSave = async (updatedUser: User) => {
    try {
      const response = await fetch(`/api/people/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      if (data.user) {
        setSelectedUser(data.user);
      }
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  useEffect(() => {
    console.log('Selected user:', selectedUser);
  }, [selectedUser]);

  return (
    <div className="space-y-6">
      <AsyncSelect
        cacheOptions={false}
        loadOptions={loadOptions}
        onChange={handleChange}
        placeholder="Search for a user..."
        className="w-full max-w-md mx-auto"
      />
      {selectedUser && (
        <UserCard 
          user={selectedUser}
          onEdit={handleEdit}
        />
      )}
      {showEditModal && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
