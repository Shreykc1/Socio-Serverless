// src/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
});

const fetchUsers = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_APPWRITE_URL}/database/collections/${import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID}/items`, {
    headers: {
      'X-Appwrite-Project': import.meta.env.VITE_APPWRITE_PROJECT_ID,
      'X-Appwrite-Key': import.meta.env.VITE_APPWRITE_API_KEY,
      'Content-Type': 'application/json',
    },
  });
  return data.items;
};

const deleteUser = async (id: string) => {
  await axios.delete(`YOUR_APPWRITE_API_ENDPOINT/database/collections/YOUR_COLLECTION_NAME/items/${id}`, {
    headers: {
      'X-Appwrite-Project': 'YOUR_PROJECT_ID',
      'X-Appwrite-Key': 'YOUR_API_KEY',
      'Content-Type': 'application/json',
    },
  });
};

const AdminDashboard: React.FC = () => {
  const { data: users, isLoading, isError } = useQuery('users', fetchUsers);
  const mutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    // Implement create and update logic here
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading users</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.$id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => mutation.mutate(user.$id)}>Delete</button>
                <Link to={`/edit-user/${user.$id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Form fields for creating/updating users */}
        <input {...register('name')} placeholder="Name" />
        {errors.name && <span>{errors.name.message}</span>}
        <input {...register('email')} placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
