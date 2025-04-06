<?php

namespace App\Repositories\User;

use App\Models\User;
use App\Repositories\User\UserRepositoryInterface;
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

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

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
}
