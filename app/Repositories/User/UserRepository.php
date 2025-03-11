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

        $users = $query->paginate($validatedQueryParams->perPage);

        return $users;
    }
}
