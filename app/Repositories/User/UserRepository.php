<?php

namespace App\Repositories\User;

use App\Models\User;
use App\Repositories\User\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function userDataTable($validatedQueryParams)
    {
        // dd($validatedQueryParams);
        $query = User::query();

        if (isset($validatedQueryParams->search) && !empty($validatedQueryParams->search)) {
            $searchTerm = $validatedQueryParams->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        if (isset($validatedQueryParams->sort) && !empty($validatedQueryParams->sort)) {
            $direction = $validatedQueryParams['order'] && $validatedQueryParams['order'] === 'desc' ? 'desc' : 'asc';
            $query->orderBy($validatedQueryParams->sort, $direction);
        } else {
            $query->orderBy('id', 'asc');
        }

        $users = $query->paginate($validatedQueryParams->perPage);

        return $users;
    }
}
