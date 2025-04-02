<?php

namespace App\Repositories\User;

use App\Models\User;
use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserRepositoryInterface
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function userDataTable($validatedQueryParams)
    {
        $query = User::query();
        $perPage = $validatedQueryParams->perPage ?? 10;
        $currentPage = request()->page ?? 1;
        $search = request()->search ?? '';
        $sort = request()->sort ?? 'updated_at';
        $direction = request()->direction ?? 'desc';

        // Validate sort field (whitelist approach for security)
        $allowedSortFields = ['name', 'email', 'created_at', 'updated_at'];
        if (!in_array($sort, $allowedSortFields)) {
            $sort = 'updated_at';
        }

        // Validate direction
        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $query->orderBy($sort, $direction);

        $users = $query->paginate($perPage);

        $startNumber = ($currentPage - 1) * $perPage + 1;
        foreach ($users->items() as $index => $user) {
            $user->row_number = $startNumber + $index . ".";
        }

        return $users;
    }

    public function createUser($request): ?User
    {
        return User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
    }
    
    /**
     * Create a new user
     */
    public function create(array $data): User
    {
        // Generate a random password if not provided
        if (!isset($data['password'])) {
            $data['password'] = Hash::make(\Illuminate\Support\Str::random(10));
        } else {
            $data['password'] = Hash::make($data['password']);
        }
        
        return $this->model->create($data);
    }
    
    /**
     * Update an existing user
     */
    public function update($id, array $data): User
    {
        $user = $this->model->findOrFail($id);
        
        // Only hash password if it's provided
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        $user->update($data);
        
        return $user;
    }
    
    /**
     * Delete a user
     */
    public function delete($id): bool
    {
        $user = $this->model->findOrFail($id);
        return $user->delete();
    }
}
